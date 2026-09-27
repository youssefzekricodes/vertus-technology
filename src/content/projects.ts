import type { Locale, Project } from "./types";

/**
 * Réalisations — fiche projet conforme au cahier des charges (§11).
 * EXEMPLES À REMPLACER par les projets réels (nom/référence, client selon
 * autorisation, photos avant/pendant/après). `result` n’est affiché que
 * lorsqu’il est renseigné : ne jamais inventer de résultat.
 */
const fr: Project[] = [
  {
    id: "res-sfax-15",
    name: "Installation résidentielle",
    sector: "Particulier",
    segment: "residentiel",
    city: "Sfax",
    type: "Photovoltaïque — autoconsommation",
    power: "15 kWc",
    problem: "Réduire la part de la facture d’électricité liée à la consommation de jour d’une maison individuelle.",
    solution: "Centrale en toiture dimensionnée sur le profil de consommation, avec suivi de production.",
    image: "/projects/residential.webp",
  },
  {
    id: "ind-tunis-500",
    name: "Projet industriel",
    sector: "Industrie",
    segment: "industriel",
    city: "Tunis",
    type: "Photovoltaïque — toiture industrielle",
    power: "500 kWc",
    problem: "Site à forte consommation diurne cherchant à maîtriser son coût énergétique.",
    solution: "Étude du profil énergétique, dimensionnement et centrale en toiture raccordée en moyenne tension.",
    image: "/projects/industrial.jpg",
  },
  {
    id: "agr-sousse-120",
    name: "Projet agricole",
    sector: "Agriculture",
    segment: "agricole",
    city: "Sousse",
    type: "Pompage solaire",
    power: "120 kWc",
    problem: "Alimenter l’irrigation d’une exploitation sans dépendre d’un groupe électrogène.",
    solution: "Pompage solaire dimensionné à partir du débit, de la hauteur manométrique et du cycle d’irrigation.",
    image: "/projects/agricultural.webp",
  },
  {
    id: "com-hammamet-250",
    name: "Projet commercial",
    sector: "Commerce",
    segment: "commercial",
    city: "Hammamet",
    type: "Photovoltaïque — ombrières et toiture",
    power: "250 kWc",
    problem: "Valoriser les surfaces de toiture et de parking d’un site commercial.",
    solution: "Ombrières photovoltaïques et centrale en toiture, structures métalliques adaptées au site.",
    image: "/projects/commercial-onduleurs.jpg",
  },
];

const ar: Project[] = [
  {
    id: "res-sfax-15",
    name: "تركيبة سكنية",
    sector: "حريف خاص",
    segment: "residentiel",
    city: "صفاقس",
    type: "كهروضوئي — استهلاك ذاتي",
    power: "15 كيلوواط ذروة",
    problem: "تخفيض جزء فاتورة الكهرباء المرتبط بالاستهلاك النهاري لمنزل فردي.",
    solution: "محطة على السطح محدّدة الأبعاد حسب ملف الاستهلاك، مع متابعة الإنتاج.",
    image: "/projects/residential.webp",
  },
  {
    id: "ind-tunis-500",
    name: "مشروع صناعي",
    sector: "الصناعة",
    segment: "industriel",
    city: "تونس",
    type: "كهروضوئي — سطح صناعي",
    power: "500 كيلوواط ذروة",
    problem: "موقع ذو استهلاك نهاري مرتفع يسعى إلى التحكم في تكلفة الطاقة.",
    solution: "دراسة الملف الطاقي وتحديد الأبعاد ومحطة على السطح موصولة بالجهد المتوسط.",
    image: "/projects/industrial.jpg",
  },
  {
    id: "agr-sousse-120",
    name: "مشروع فلاحي",
    sector: "الفلاحة",
    segment: "agricole",
    city: "سوسة",
    type: "ضخ شمسي",
    power: "120 كيلوواط ذروة",
    problem: "تزويد الري في ضيعة فلاحية دون الاعتماد على مولّد كهربائي.",
    solution: "ضخ شمسي محدّد الأبعاد انطلاقاً من التدفق والارتفاع المانومتري ودورة الري.",
    image: "/projects/agricultural.webp",
  },
  {
    id: "com-hammamet-250",
    name: "مشروع تجاري",
    sector: "التجارة",
    segment: "commercial",
    city: "الحمامات",
    type: "كهروضوئي — مظلات وسطح",
    power: "250 كيلوواط ذروة",
    problem: "تثمين مساحات السطح والمرآب في موقع تجاري.",
    solution: "مظلات كهروضوئية ومحطة على السطح، بهياكل معدنية ملائمة للموقع.",
    image: "/projects/commercial-onduleurs.jpg",
  },
];

export function getProjects(locale: Locale): Project[] {
  return locale === "ar" ? ar : fr;
}
