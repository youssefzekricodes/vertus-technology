/**
 * VERTUS Technology — "Demander une étude" → Google Sheets (CRM prospects)
 *
 * Writes each request as ONE READABLE ROW (one column per field, real dates
 * and numbers, status dropdown, clickable attachments) instead of raw JSON.
 *
 * Installation
 *  1. Google Sheet → Extensions → Apps Script → replace everything with this file.
 *  2. Select the function `setup` → Run (once) and accept ALL permissions
 *     (Sheets, Drive for attachments, Gmail for alerts).
 *  3. Deploy → Manage deployments → edit (pencil) → Version: "New version" → Deploy.
 *     (Keep the same deployment so the /exec URL does not change.)
 */

const SHEET_NAME = "Prospects";
const FOLDER_NAME = "VERTUS — pièces jointes";
const NOTIFY_EMAIL = "vertustechnology@gmail.com"; // "" to disable e-mail alerts
const TIMEZONE = "Africa/Tunis";

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "STUDY", "QUOTE_SENT", "WON", "LOST", "FOLLOW-UP"];
const STATUS_COLORS = {
  NEW: "#dbeafe",
  CONTACTED: "#fef3c7",
  QUALIFIED: "#e0e7ff",
  STUDY: "#ede9fe",
  QUOTE_SENT: "#fce7f3",
  WON: "#dcfce7",
  LOST: "#fee2e2",
  "FOLLOW-UP": "#ffedd5",
};

/** [payload key, column header, column width px, type] */
const COLUMNS = [
  ["id", "Réf.", 150, "text"],
  ["date", "Date", 130, "date"],
  ["status", "Statut", 120, "status"],
  ["fullName", "Nom et prénom", 170, "text"],
  ["company", "Entreprise", 150, "text"],
  ["phone", "Téléphone", 130, "text"],
  ["email", "E-mail", 210, "text"],
  ["city", "Ville", 120, "text"],
  ["projectType", "Type de projet", 210, "text"],
  ["power", "Puissance (kWc)", 115, "number"],
  ["consumption", "Conso. annuelle (kWh)", 150, "number"],
  ["bill", "Facture (TND/mois)", 135, "number"],
  ["surface", "Surface (m²)", 105, "number"],
  ["roof", "Toiture", 150, "text"],
  ["storage", "Stockage", 85, "text"],
  ["pumping", "Pompage", 85, "text"],
  ["ev", "Recharge VE", 95, "text"],
  ["message", "Message", 320, "longtext"],
  ["attachments", "Pièces jointes", 200, "links"],
  ["locale", "Langue", 70, "text"],
  ["source", "Source", 110, "text"],
  ["medium", "Support", 100, "text"],
  ["campaign", "Campagne", 120, "text"],
  ["page", "Page", 170, "text"],
  ["referrer", "Provenance", 200, "text"],
  ["notes", "Notes internes", 260, "longtext"],
];

/** Run once from the editor: asks for every permission, then creates the sheet, headers, formats and dropdown. */
function setup() {
  // Touch Drive and Mail here so Google asks for those permissions now,
  // not on the first real request (which would otherwise fail).
  DriveApp.getRootFolder();
  if (NOTIFY_EMAIL) MailApp.getRemainingDailyQuota();

  const sheet = getSheet_();
  sheet.getRange(1, 1, 1, COLUMNS.length)
    .setValues([COLUMNS.map((c) => c[1])])
    .setFontWeight("bold")
    .setBackground("#0c2240")
    .setFontColor("#ffffff")
    .setVerticalAlignment("middle");
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
  sheet.setRowHeight(1, 34);

  COLUMNS.forEach((c, i) => {
    const col = i + 1;
    sheet.setColumnWidth(col, c[2]);
    const body = sheet.getRange(2, col, sheet.getMaxRows() - 1, 1);
    if (c[3] === "date") body.setNumberFormat("dd/MM/yyyy HH:mm");
    if (c[3] === "number") body.setNumberFormat("#,##0.##");
    if (c[3] === "text" || c[3] === "links") body.setNumberFormat("@"); // keep phone "+216…" intact
    if (c[3] === "longtext") body.setWrap(true);
  });

  // Status dropdown + one colour per status
  const statusCol = colIndex_("status");
  const statusRange = sheet.getRange(2, statusCol, sheet.getMaxRows() - 1, 1);
  statusRange.setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build()
  );
  sheet.setConditionalFormatRules(
    STATUSES.map((s) =>
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(s)
        .setBackground(STATUS_COLORS[s])
        .setRanges([statusRange])
        .build()
    )
  );

  if (!sheet.getFilter()) sheet.getRange(1, 1, sheet.getMaxRows(), COLUMNS.length).createFilter();
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // two requests at once must not overwrite each other
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet_();
    if (sheet.getLastRow() === 0) setup();

    // Attachments / e-mail problems must never lose the lead itself.
    let links = [];
    let attachmentError = "";
    try {
      links = saveAttachments_(data);
    } catch (err) {
      attachmentError = "⚠ Pièces jointes non enregistrées : " + err;
    }
    const row = COLUMNS.map(([key, , , type]) => {
      const v = data[key];
      if (type === "date") return v ? new Date(v) : new Date();
      if (type === "number") return v === "" || v == null ? "" : Number(v);
      if (type === "links") return attachmentError;
      if (key === "status") return v || "NEW";
      if (key === "storage" || key === "pumping" || key === "ev") return v === "oui" ? "Oui" : v === "non" ? "Non" : "";
      if (key === "locale") return v === "ar" ? "AR" : "FR";
      return v == null ? "" : String(v);
    });

    // Newest request on top, right under the header
    sheet.insertRowBefore(2);
    sheet.getRange(2, 1, 1, row.length).setValues([row]).setVerticalAlignment("top");
    if (links.length) {
      const cell = sheet.getRange(2, colIndex_("attachments"));
      const rich = SpreadsheetApp.newRichTextValue().setText(links.map((l) => l.name).join("\n"));
      let pos = 0;
      links.forEach((l) => {
        rich.setLinkUrl(pos, pos + l.name.length, l.url);
        pos += l.name.length + 1;
      });
      cell.setRichTextValue(rich.build());
    }

    try {
      notify_(data, links);
    } catch (err) {
      console.error("notification failed: " + err);
    }
    return json_({ ok: true, id: data.id });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------------- helpers ---------------- */

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME, 0);
}

function colIndex_(key) {
  return COLUMNS.findIndex((c) => c[0] === key) + 1;
}

/** Files go to Drive: one sub-folder per request, links shown in the sheet. */
function saveAttachments_(data) {
  if (!data.attachments || !data.attachments.length) return [];
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  const root = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
  const folder = root.createFolder(data.id + " — " + (data.fullName || ""));
  return data.attachments.map((a) => {
    const blob = Utilities.newBlob(Utilities.base64Decode(a.base64), a.type, a.name);
    const file = folder.createFile(blob);
    return { name: a.name, url: file.getUrl() };
  });
}

function notify_(data, links) {
  if (!NOTIFY_EMAIL) return;
  const when = Utilities.formatDate(new Date(data.date || Date.now()), TIMEZONE, "dd/MM/yyyy HH:mm");
  const lines = [
    "Nouvelle demande d’étude " + data.id + " — " + when,
    "",
    "Nom : " + data.fullName + (data.company ? " (" + data.company + ")" : ""),
    "Téléphone : " + data.phone,
    "E-mail : " + data.email,
    "Ville : " + data.city,
    "Projet : " + data.projectType,
    "",
    data.message,
  ];
  if (links.length) lines.push("", "Pièces jointes :", ...links.map((l) => "- " + l.name + " : " + l.url));
  lines.push("", SpreadsheetApp.getActiveSpreadsheet().getUrl());
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: data.email,
    subject: "Demande d’étude " + data.id + " — " + data.projectType + " — " + data.city,
    body: lines.join("\n"),
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
