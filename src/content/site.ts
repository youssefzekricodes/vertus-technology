/**
 * All editable site content lives in this file (plus company.ts).
 * Replace the mock values here — no component changes needed.
 */

export type Locale = "fr" | "ar";

export const company = {
  name: "VERTUS TECHNOLOGY",
  domain: "https://www.vertus-technology.com",
  email: "contact@vertus-technology.com",
  phone: "+216 XX XXX XXX",
  country: "Tunisie",
  founder: "Omar Tounsi",
  social: {
    linkedin: "https://www.linkedin.com/company/vertus-technology",
    facebook: "https://www.facebook.com/vertustechnology",
    instagram: "https://www.instagram.com/vertustechnology",
  },
};

export type Dict = typeof fr;

export const fr = {
  dir: "ltr" as "ltr" | "rtl",
  lang: "fr",
  meta: {
    title:
      "VERTUS TECHNOLOGY | Solutions Solaires & Énergie Renouvelable en Tunisie",
    description:
      "VERTUS TECHNOLOGY accompagne les particuliers, entreprises et industries en Tunisie avec des solutions photovoltaïques, électriques et énergétiques intelligentes et durables.",
  },
  nav: {
    links: [
      { href: "#accueil", label: "Accueil" },
      { href: "#societe", label: "Société" },
      { href: "#solutions", label: "Solutions" },
      { href: "#projets", label: "Projets" },
      { href: "#expertise", label: "Expertise" },
      { href: "#contact", label: "Contact" },
    ],
    cta: "Demander une étude",
  },
  hero: {
    tagline: "L’énergie de demain.",
    sub: "Des solutions solaires intelligentes et durables pour construire un avenir énergétique plus indépendant.",
    ctaPrimary: "Découvrir nos solutions",
    ctaSecondary: "Demander une étude",
    scrollHint: "Découvrir",
  },
  intro: {
    heading: "Transformer l’énergie solaire en opportunité.",
    body: "VERTUS TECHNOLOGY accompagne les particuliers, entreprises et acteurs industriels dans leur transition vers une énergie plus propre, plus intelligente et plus indépendante.",
  },
  stats: [
    { value: 250, prefix: "+", suffix: "", label: "Installations réalisées" },
    { value: 4.8, prefix: "+", suffix: " MW", label: "Puissance installée", decimals: 1 },
    { value: 1200, prefix: "+", suffix: "", label: "Tonnes de CO₂ évitées" },
    { value: 98, prefix: "+", suffix: "%", label: "Clients satisfaits" },
  ],
  solutions: {
    title: "Nos solutions",
    sub: "Six domaines d’intervention, une même exigence : des installations fiables, performantes et durables.",
    items: [
      {
        icon: "panel",
        title: "Installation photovoltaïque",
        desc: "Solutions solaires adaptées aux besoins résidentiels, professionnels et industriels.",
      },
      {
        icon: "study",
        title: "Études & dimensionnement",
        desc: "Analyse énergétique, étude technique et dimensionnement précis de chaque installation.",
      },
      {
        icon: "industry",
        title: "Solutions industrielles",
        desc: "Installations photovoltaïques adaptées aux environnements industriels et grandes consommations.",
      },
      {
        icon: "home",
        title: "Autoconsommation",
        desc: "Produire et consommer votre propre énergie pour améliorer votre indépendance énergétique.",
      },
      {
        icon: "monitor",
        title: "Maintenance & monitoring",
        desc: "Suivi des performances, maintenance préventive et optimisation continue.",
      },
      {
        icon: "bolt",
        title: "Solutions électriques",
        desc: "Solutions électriques modernes intégrées aux projets énergétiques.",
      },
    ],
  },
  flow: {
    title: "De l’énergie solaire à votre consommation.",
    sub: "Chaque installation VERTUS est une chaîne complète, pensée de la captation à la consommation.",
    steps: [
      { key: "sun", title: "Soleil", desc: "La ressource : une irradiation parmi les plus élevées du bassin méditerranéen." },
      { key: "panels", title: "Panneaux photovoltaïques", desc: "Les modules convertissent le rayonnement solaire en courant continu." },
      { key: "inverter", title: "Onduleur", desc: "Le courant continu est converti en courant alternatif utilisable." },
      { key: "smart", title: "Gestion intelligente", desc: "Le système pilote la production, la consommation et les priorités en temps réel." },
      { key: "home", title: "Consommation", desc: "Votre bâtiment consomme d’abord sa propre énergie solaire." },
      { key: "battery", title: "Stockage", desc: "Le surplus est stocké ou réinjecté selon la configuration du projet." },
    ],
  },
  why: {
    title: "Pourquoi VERTUS TECHNOLOGY ?",
    items: [
      { title: "Expertise", desc: "Une équipe spécialisée dans les solutions énergétiques et électriques." },
      { title: "Qualité", desc: "Des équipements sélectionnés selon des standards élevés de performance." },
      { title: "Innovation", desc: "Des technologies modernes pour optimiser chaque installation." },
      { title: "Accompagnement", desc: "Un accompagnement complet de l’étude jusqu’au suivi." },
    ],
  },
  about: {
    title: "Construire aujourd’hui l’énergie de demain.",
    image: "/about/solar-construction-site.jpg",
    imageAlt: "Techniciens installant des panneaux solaires sur un chantier de centrale photovoltaïque",
    body: "VERTUS TECHNOLOGY accompagne les particuliers, entreprises et acteurs industriels dans leur transition énergétique. Notre mission est de développer des solutions solaires fiables, performantes et adaptées aux réalités de chaque projet.",
    pillars: [
      { title: "Notre mission", desc: "Rendre l’énergie solaire accessible, rentable et fiable pour chaque type de projet, du résidentiel à l’industriel." },
      { title: "Notre vision", desc: "Faire de la Tunisie un territoire d’excellence en énergie renouvelable, une installation à la fois." },
      { title: "Nos valeurs", desc: "Rigueur technique, transparence, proximité client et responsabilité environnementale." },
    ],
  },
  founder: {
    name: "Omar Tounsi",
    role: "Directeur Général & Fondateur",
    bio: "Animé par la volonté de contribuer à une transition énergétique durable, Omar Tounsi a fondé VERTUS TECHNOLOGY autour d’une vision simple : associer expertise technique, innovation et proximité client pour développer les solutions énergétiques de demain.",
    quote: "L’énergie de demain se construit avec la rigueur d’aujourd’hui.",
  },
  projects: {
    title: "Nos projets",
    sub: "Des installations livrées sur tout le territoire tunisien, du résidentiel au grand industriel.",
    filters: [
      { key: "all", label: "Tous" },
      { key: "residentiel", label: "Résidentiel" },
      { key: "industriel", label: "Industriel" },
      { key: "agricole", label: "Agricole" },
      { key: "commercial", label: "Commercial" },
    ],
    capacityLabel: "Puissance installée",
    items: [
      {
        type: "residentiel",
        typeLabel: "Installation Résidentielle",
        city: "Sfax",
        capacity: "15 kWc",
        image: "/projects/residential.webp",
        desc: "Installation en autoconsommation sur toiture résidentielle, avec monitoring de production en temps réel.",
      },
      {
        type: "industriel",
        typeLabel: "Projet Industriel",
        city: "Tunis",
        capacity: "500 kWc",
        image: "/projects/industrial.jpg",
        desc: "Centrale photovoltaïque en toiture pour un site industriel à forte consommation, raccordée en moyenne tension.",
      },
      {
        type: "agricole",
        typeLabel: "Projet Agricole",
        city: "Sousse",
        capacity: "120 kWc",
        image: "/projects/agricultural.webp",
        desc: "Pompage solaire et alimentation d’une exploitation agricole, dimensionnés sur le cycle d’irrigation.",
      },
      {
        type: "commercial",
        typeLabel: "Projet Commercial",
        city: "Hammamet",
        capacity: "250 kWc",
        image: "/projects/commercial.jpg",
        desc: "Ombrières photovoltaïques et couverture de toiture pour un centre commercial en bord de mer.",
      },
    ],
  },
  expertise: {
    title: "Notre expertise",
    sub: "Un processus maîtrisé de bout en bout, de la première visite technique au suivi de production.",
    steps: [
      { title: "Étude", desc: "Visite technique, analyse de consommation et étude de faisabilité." },
      { title: "Conception", desc: "Dimensionnement, choix des équipements et plans d’exécution." },
      { title: "Installation", desc: "Pose par nos équipes certifiées, dans le respect des normes." },
      { title: "Mise en service", desc: "Tests, raccordement et démarches administratives." },
      { title: "Monitoring", desc: "Suivi de production en temps réel et alertes automatiques." },
      { title: "Maintenance", desc: "Entretien préventif et interventions correctives rapides." },
    ],
  },
  testimonials: {
    title: "Ils nous font confiance",
    items: [
      {
        quote: "L’équipe VERTUS nous a accompagnés de l’étude jusqu’à la mise en service avec beaucoup de professionnalisme.",
        name: "Karim B.",
        org: "Société textile",
        city: "Tunis",
        type: "Projet industriel · 500 kWc",
      },
      {
        quote: "Installation propre, délais respectés, et une production conforme à l’étude. Nous recommandons sans hésiter.",
        name: "Salma M.",
        org: "Particulier",
        city: "Sfax",
        type: "Résidentiel · 15 kWc",
      },
      {
        quote: "Le pompage solaire a transformé notre exploitation. Le suivi à distance nous fait gagner un temps précieux.",
        name: "Hédi T.",
        org: "Exploitation agricole",
        city: "Sousse",
        type: "Agricole · 120 kWc",
      },
      {
        quote: "Un interlocuteur unique du début à la fin, des réponses claires et un chantier parfaitement organisé.",
        name: "Nadia K.",
        org: "Centre commercial",
        city: "Hammamet",
        type: "Commercial · 250 kWc",
      },
      {
        quote: "Après un an, la production dépasse légèrement les prévisions. La maintenance préventive est un vrai plus.",
        name: "Mehdi J.",
        org: "PME agroalimentaire",
        city: "Nabeul",
        type: "Industriel · 180 kWc",
      },
    ],
  },
  cta: {
    title: "Prêt à passer à l’énergie solaire ?",
    body: "Parlons de votre projet et construisons ensemble une solution énergétique adaptée à vos besoins.",
    primary: "Demander une étude",
    secondary: "Nous contacter",
  },
  contact: {
    title: "Parlons de votre projet",
    sub: "Décrivez-nous votre besoin : notre équipe vous répond sous 48 h ouvrées avec une première analyse.",
    fields: {
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      companyName: "Entreprise",
      projectType: "Type de projet",
      message: "Message",
    },
    projectTypes: ["Résidentiel", "Industriel", "Agricole", "Commercial", "Autre"],
    optional: "facultatif",
    submit: "Envoyer ma demande",
    sending: "Envoi en cours…",
    success: "Merci pour votre demande. Notre équipe vous contactera prochainement.",
    error: "Une erreur est survenue. Vérifiez votre connexion et réessayez, ou écrivez-nous directement.",
    validation: {
      required: "Ce champ est requis",
      email: "Adresse email invalide",
      phone: "Numéro de téléphone invalide",
    },
  },
  footer: {
    tagline: "L’énergie de demain.",
    navTitle: "Navigation",
    contactTitle: "Contact",
    copyright: "© 2026 VERTUS TECHNOLOGY. Tous droits réservés.",
  },
  a11y: {
    switchLang: "التبديل إلى العربية",
    switchLangShort: "AR",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    prev: "Précédent",
    next: "Suivant",
    goToSlide: "Aller au témoignage",
    themeToLight: "Passer en mode clair",
    themeToDark: "Passer en mode sombre",
  },
};

export const ar: Dict = {
  dir: "rtl",
  lang: "ar",
  meta: {
    title: "فيرتوس تكنولوجي | حلول الطاقة الشمسية والطاقات المتجددة في تونس",
    description:
      "ترافق فيرتوس تكنولوجي الأفراد والشركات والمصانع في تونس بحلول كهروضوئية وكهربائية وطاقية ذكية ومستدامة.",
  },
  nav: {
    links: [
      { href: "#accueil", label: "الرئيسية" },
      { href: "#societe", label: "الشركة" },
      { href: "#solutions", label: "حلولنا" },
      { href: "#projets", label: "مشاريعنا" },
      { href: "#expertise", label: "خبرتنا" },
      { href: "#contact", label: "اتصل بنا" },
    ],
    cta: "اطلب دراسة",
  },
  hero: {
    tagline: "طاقة الغد.",
    sub: "حلول شمسية ذكية ومستدامة لبناء مستقبل طاقي أكثر استقلالية.",
    ctaPrimary: "اكتشف حلولنا",
    ctaSecondary: "اطلب دراسة",
    scrollHint: "اكتشف",
  },
  intro: {
    heading: "نحوّل الطاقة الشمسية إلى فرصة.",
    body: "ترافق فيرتوس تكنولوجي الأفراد والشركات والفاعلين الصناعيين في انتقالهم نحو طاقة أنظف وأذكى وأكثر استقلالية.",
  },
  stats: [
    { value: 250, prefix: "+", suffix: "", label: "تركيبة منجزة" },
    { value: 4.8, prefix: "+", suffix: " م.و", label: "قدرة مركّبة", decimals: 1 },
    { value: 1200, prefix: "+", suffix: "", label: "طن من CO₂ تم تفاديه" },
    { value: 98, prefix: "+", suffix: "%", label: "حرفاء راضون" },
  ],
  solutions: {
    title: "حلولنا",
    sub: "ستة مجالات تدخل، ومعيار واحد: تركيبات موثوقة وفعّالة ومستدامة.",
    items: [
      { icon: "panel", title: "التركيبات الكهروضوئية", desc: "حلول شمسية ملائمة للاحتياجات السكنية والمهنية والصناعية." },
      { icon: "study", title: "الدراسات وتحديد الأبعاد", desc: "تحليل طاقي ودراسة فنية وتحديد دقيق لأبعاد كل تركيبة." },
      { icon: "industry", title: "الحلول الصناعية", desc: "تركيبات كهروضوئية ملائمة للبيئات الصناعية والاستهلاكات الكبرى." },
      { icon: "home", title: "الاستهلاك الذاتي", desc: "أنتج واستهلك طاقتك الخاصة لتعزيز استقلاليتك الطاقية." },
      { icon: "monitor", title: "الصيانة والمراقبة", desc: "متابعة الأداء، صيانة وقائية وتحسين متواصل." },
      { icon: "bolt", title: "الحلول الكهربائية", desc: "حلول كهربائية حديثة مدمجة في المشاريع الطاقية." },
    ],
  },
  flow: {
    title: "من الطاقة الشمسية إلى استهلاكك.",
    sub: "كل تركيبة من فيرتوس سلسلة متكاملة، مصممة من الالتقاط إلى الاستهلاك.",
    steps: [
      { key: "sun", title: "الشمس", desc: "المورد: إشعاع شمسي من بين الأعلى في حوض البحر الأبيض المتوسط." },
      { key: "panels", title: "الألواح الكهروضوئية", desc: "تحوّل الوحدات الإشعاع الشمسي إلى تيار مستمر." },
      { key: "inverter", title: "العاكس", desc: "يُحوَّل التيار المستمر إلى تيار متناوب قابل للاستعمال." },
      { key: "smart", title: "الإدارة الذكية", desc: "يتحكم النظام في الإنتاج والاستهلاك والأولويات في الوقت الحقيقي." },
      { key: "home", title: "الاستهلاك", desc: "يستهلك مبناك أولاً طاقته الشمسية الخاصة." },
      { key: "battery", title: "التخزين", desc: "يُخزَّن الفائض أو يُعاد ضخه حسب إعدادات المشروع." },
    ],
  },
  why: {
    title: "لماذا فيرتوس تكنولوجي؟",
    items: [
      { title: "الخبرة", desc: "فريق متخصص في الحلول الطاقية والكهربائية." },
      { title: "الجودة", desc: "معدات مختارة وفق معايير أداء عالية." },
      { title: "الابتكار", desc: "تقنيات حديثة لتحسين كل تركيبة." },
      { title: "المرافقة", desc: "مرافقة كاملة من الدراسة إلى المتابعة." },
    ],
  },
  about: {
    title: "نبني اليوم طاقة الغد.",
    image: "/about/solar-construction-site.jpg",
    imageAlt: "فنيون يركّبون ألواحاً شمسية في ورشة محطة كهروضوئية",
    body: "ترافق فيرتوس تكنولوجي الأفراد والشركات والفاعلين الصناعيين في انتقالهم الطاقي. مهمتنا تطوير حلول شمسية موثوقة وفعّالة وملائمة لواقع كل مشروع.",
    pillars: [
      { title: "مهمتنا", desc: "جعل الطاقة الشمسية في متناول الجميع، مربحة وموثوقة لكل أنواع المشاريع، من السكني إلى الصناعي." },
      { title: "رؤيتنا", desc: "جعل تونس أرض تميّز في الطاقات المتجددة، تركيبةً تلو الأخرى." },
      { title: "قيمنا", desc: "الدقة الفنية، الشفافية، القرب من الحريف والمسؤولية البيئية." },
    ],
  },
  founder: {
    name: "عمر التونسي",
    role: "المدير العام والمؤسس",
    bio: "بدافع الرغبة في المساهمة في انتقال طاقي مستدام، أسّس عمر التونسي شركة فيرتوس تكنولوجي حول رؤية بسيطة: الجمع بين الخبرة الفنية والابتكار والقرب من الحريف لتطوير حلول طاقة الغد.",
    quote: "طاقة الغد تُبنى بدقة اليوم.",
  },
  projects: {
    title: "مشاريعنا",
    sub: "تركيبات منجزة على كامل التراب التونسي، من السكني إلى الصناعي الكبير.",
    filters: [
      { key: "all", label: "الكل" },
      { key: "residentiel", label: "سكني" },
      { key: "industriel", label: "صناعي" },
      { key: "agricole", label: "فلاحي" },
      { key: "commercial", label: "تجاري" },
    ],
    capacityLabel: "القدرة المركّبة",
    items: [
      {
        type: "residentiel",
        typeLabel: "تركيبة سكنية",
        city: "صفاقس",
        capacity: "15 كيلوواط",
        image: "/projects/residential.webp",
        desc: "تركيبة استهلاك ذاتي على سطح منزل، مع متابعة الإنتاج في الوقت الحقيقي.",
      },
      {
        type: "industriel",
        typeLabel: "مشروع صناعي",
        city: "تونس",
        capacity: "500 كيلوواط",
        image: "/projects/industrial.jpg",
        desc: "محطة كهروضوئية على سطح موقع صناعي كبير الاستهلاك، موصولة بالجهد المتوسط.",
      },
      {
        type: "agricole",
        typeLabel: "مشروع فلاحي",
        city: "سوسة",
        capacity: "120 كيلوواط",
        image: "/projects/agricultural.webp",
        desc: "ضخ شمسي وتزويد ضيعة فلاحية بالطاقة، وفق دورة الري.",
      },
      {
        type: "commercial",
        typeLabel: "مشروع تجاري",
        city: "الحمامات",
        capacity: "250 كيلوواط",
        image: "/projects/commercial.jpg",
        desc: "مظلات كهروضوئية وتغطية سطح مركز تجاري على الشاطئ.",
      },
    ],
  },
  expertise: {
    title: "خبرتنا",
    sub: "مسار متحكَّم فيه من البداية إلى النهاية، من أول زيارة فنية إلى متابعة الإنتاج.",
    steps: [
      { title: "الدراسة", desc: "زيارة فنية، تحليل الاستهلاك ودراسة الجدوى." },
      { title: "التصميم", desc: "تحديد الأبعاد، اختيار المعدات ومخططات التنفيذ." },
      { title: "التركيب", desc: "إنجاز من فرقنا المؤهلة، مع احترام المعايير." },
      { title: "التشغيل", desc: "اختبارات، ربط بالشبكة وإجراءات إدارية." },
      { title: "المراقبة", desc: "متابعة الإنتاج في الوقت الحقيقي وتنبيهات آلية." },
      { title: "الصيانة", desc: "صيانة وقائية وتدخلات تصحيحية سريعة." },
    ],
  },
  testimonials: {
    title: "يثقون بنا",
    items: [
      {
        quote: "رافقنا فريق فيرتوس من الدراسة إلى التشغيل بكثير من الاحترافية.",
        name: "كريم ب.",
        org: "شركة نسيج",
        city: "تونس",
        type: "مشروع صناعي · 500 كيلوواط",
      },
      {
        quote: "تركيب نظيف، آجال محترمة، وإنتاج مطابق للدراسة. ننصح بهم دون تردد.",
        name: "سلمى م.",
        org: "حريف خاص",
        city: "صفاقس",
        type: "سكني · 15 كيلوواط",
      },
      {
        quote: "غيّر الضخ الشمسي ضيعتنا. المتابعة عن بُعد توفّر لنا وقتاً ثميناً.",
        name: "الهادي ت.",
        org: "ضيعة فلاحية",
        city: "سوسة",
        type: "فلاحي · 120 كيلوواط",
      },
      {
        quote: "محاور واحد من البداية إلى النهاية، إجابات واضحة وورشة منظمة تماماً.",
        name: "نادية ك.",
        org: "مركز تجاري",
        city: "الحمامات",
        type: "تجاري · 250 كيلوواط",
      },
      {
        quote: "بعد سنة، تجاوز الإنتاج التوقعات بقليل. الصيانة الوقائية إضافة حقيقية.",
        name: "مهدي ج.",
        org: "مؤسسة صغرى غذائية",
        city: "نابل",
        type: "صناعي · 180 كيلوواط",
      },
    ],
  },
  cta: {
    title: "مستعد للانتقال إلى الطاقة الشمسية؟",
    body: "لنتحدث عن مشروعك ونبني معاً حلاً طاقياً ملائماً لاحتياجاتك.",
    primary: "اطلب دراسة",
    secondary: "اتصل بنا",
  },
  contact: {
    title: "لنتحدث عن مشروعك",
    sub: "صف لنا حاجتك: يجيبك فريقنا خلال 48 ساعة عمل بتحليل أولي.",
    fields: {
      firstName: "الاسم",
      lastName: "اللقب",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      companyName: "الشركة",
      projectType: "نوع المشروع",
      message: "الرسالة",
    },
    projectTypes: ["سكني", "صناعي", "فلاحي", "تجاري", "آخر"],
    optional: "اختياري",
    submit: "أرسل طلبي",
    sending: "جارٍ الإرسال…",
    success: "شكراً على طلبك. سيتصل بك فريقنا قريباً.",
    error: "حدث خطأ. تحقق من اتصالك وأعد المحاولة، أو راسلنا مباشرة.",
    validation: {
      required: "هذا الحقل مطلوب",
      email: "البريد الإلكتروني غير صالح",
      phone: "رقم الهاتف غير صالح",
    },
  },
  footer: {
    tagline: "طاقة الغد.",
    navTitle: "روابط",
    contactTitle: "اتصل بنا",
    copyright: "© 2026 فيرتوس تكنولوجي. جميع الحقوق محفوظة.",
  },
  a11y: {
    switchLang: "Passer au français",
    switchLangShort: "FR",
    openMenu: "افتح القائمة",
    closeMenu: "أغلق القائمة",
    prev: "السابق",
    next: "التالي",
    goToSlide: "الانتقال إلى الشهادة",
    themeToLight: "التبديل إلى الوضع الفاتح",
    themeToDark: "التبديل إلى الوضع الداكن",
  },
};

export function getDict(locale: Locale): Dict {
  return locale === "ar" ? ar : fr;
}
