import type { Article, Locale } from "./types";

/**
 * Actualités — articles structurés (titre, extrait, sections) prêts à être
 * migrés vers un CMS. Ajouter un article = ajouter une entrée (même `slug`
 * en français et en arabe).
 */
const fr: Article[] = [
  {
    slug: "dimensionner-installation-photovoltaique",
    date: "2026-09-22",
    category: "Conseils photovoltaïques",
    title: "Comment dimensionner une installation photovoltaïque ?",
    excerpt:
      "La bonne puissance ne se devine pas : elle se calcule à partir de votre consommation, de votre profil énergétique et de vos objectifs.",
    sections: [
      {
        body: [
          "Choisir la puissance d’une installation photovoltaïque « au jugé » conduit souvent à une centrale sous-dimensionnée, qui ne couvre pas le besoin, ou surdimensionnée, dont une partie de la production est mal valorisée.",
        ],
      },
      {
        title: "1. Partir de la consommation réelle",
        body: [
          "Les factures des douze derniers mois donnent la consommation annuelle. Elles permettent aussi de repérer les variations saisonnières, par exemple la climatisation en été.",
        ],
      },
      {
        title: "2. Comprendre le profil énergétique",
        body: [
          "Une installation en autoconsommation est d’autant plus pertinente que l’énergie est consommée pendant les heures de production. Un bureau, un atelier ou une exploitation agricole n’ont pas le même profil qu’un logement.",
        ],
      },
      {
        title: "3. Étudier le site",
        body: [
          "Orientation, inclinaison, ombrages, surface disponible et nature de la toiture conditionnent la puissance installable et le choix des structures.",
        ],
      },
      {
        title: "4. Fixer l’objectif et comparer les scénarios",
        body: [
          "Réduire la facture, gagner en autonomie ou sécuriser l’alimentation : chaque objectif conduit à un dimensionnement différent. L’étude économique compare plusieurs scénarios avant de retenir la solution la plus cohérente.",
        ],
      },
    ],
  },
  {
    slug: "pompage-solaire-parametres",
    date: "2026-09-15",
    category: "Pompage solaire",
    title: "Pompage solaire : les paramètres à étudier avant de choisir sa pompe",
    excerpt:
      "Débit, hauteur manométrique, profondeur du forage : un système de pompage solaire se dimensionne à partir de données hydrauliques précises.",
    sections: [
      {
        body: [
          "Un système de pompage solaire associe une pompe, un générateur photovoltaïque et un système de commande. Sa performance dépend de la cohérence entre ces trois éléments.",
        ],
      },
      {
        title: "Les données hydrauliques",
        body: [
          "Le débit recherché, la hauteur manométrique totale, la profondeur du forage et la distance jusqu’au point d’utilisation déterminent la puissance hydraulique nécessaire.",
        ],
      },
      {
        title: "Le profil d’utilisation",
        body: [
          "Les besoins varient selon les cultures et les saisons. Le dimensionnement tient compte du volume d’eau quotidien et des périodes de pointe.",
        ],
      },
      {
        title: "Du besoin à la solution",
        body: [
          "Une fois le besoin calculé, on choisit le type de pompe, puis on dimensionne la puissance photovoltaïque et le système de commande adaptés, avant l’installation et la mise en service.",
        ],
      },
    ],
  },
  {
    slug: "stockage-batteries-quand-est-ce-pertinent",
    date: "2026-09-08",
    category: "Stockage",
    title: "Batteries : quand le stockage d’énergie est-il pertinent ?",
    excerpt:
      "Augmenter l’autoconsommation, sécuriser l’alimentation, gérer les surplus : le stockage répond à des objectifs précis qu’il faut définir avant de dimensionner.",
    sections: [
      {
        body: [
          "Ajouter des batteries à une installation photovoltaïque n’est pas systématiquement nécessaire. C’est l’analyse de la consommation, de la production et des objectifs qui permet de trancher.",
        ],
      },
      {
        title: "Les cas d’usage",
        body: [
          "Stocker les surplus pour les consommer plus tard, disposer d’un secours en cas de coupure, ou piloter la consommation dans une solution hybride.",
        ],
      },
      {
        title: "Définir le besoin d’autonomie",
        body: [
          "Combien d’heures d’autonomie ? Pour quels équipements ? La réponse détermine la capacité et l’architecture du système.",
        ],
      },
      {
        title: "Simuler avant d’investir",
        body: [
          "Une simulation économique permet de vérifier que la solution retenue est cohérente avec le besoin et le budget, avant l’installation.",
        ],
      },
    ],
  },
];

const ar: Article[] = [
  {
    slug: "dimensionner-installation-photovoltaique",
    date: "2026-09-22",
    category: "نصائح كهروضوئية",
    title: "كيف تحدّد أبعاد منظومة كهروضوئية؟",
    excerpt: "القدرة المناسبة لا تُخمَّن، بل تُحسب انطلاقاً من استهلاكك وملفك الطاقي وأهدافك.",
    sections: [
      {
        body: [
          "اختيار قدرة المنظومة الكهروضوئية بالتقدير يؤدي غالباً إلى محطة أصغر من الحاجة لا تغطيها، أو أكبر منها فلا يُثمَّن جزء من إنتاجها بشكل جيد.",
        ],
      },
      {
        title: "1. الانطلاق من الاستهلاك الحقيقي",
        body: ["تُحدّد فواتير الأشهر الاثني عشر الأخيرة الاستهلاك السنوي، وتسمح أيضاً برصد التغيرات الموسمية، كالتكييف في الصيف."],
      },
      {
        title: "2. فهم الملف الطاقي",
        body: [
          "تكون منظومة الاستهلاك الذاتي أكثر جدوى كلما استُهلكت الطاقة خلال ساعات الإنتاج. فالمكتب أو الورشة أو الضيعة الفلاحية لا تملك نفس الملف الطاقي للمسكن.",
        ],
      },
      {
        title: "3. دراسة الموقع",
        body: ["الاتجاه والميل والظلال والمساحة المتاحة ونوع السطح تحدّد القدرة القابلة للتركيب واختيار الهياكل."],
      },
      {
        title: "4. تحديد الهدف ومقارنة السيناريوهات",
        body: [
          "تخفيض الفاتورة أو كسب الاستقلالية أو تأمين التزويد: لكل هدف تحديد أبعاد مختلف. وتقارن الدراسة الاقتصادية عدة سيناريوهات قبل اعتماد الحل الأكثر تناسقاً.",
        ],
      },
    ],
  },
  {
    slug: "pompage-solaire-parametres",
    date: "2026-09-15",
    category: "الضخ الشمسي",
    title: "الضخ الشمسي: المعايير الواجب دراستها قبل اختيار المضخة",
    excerpt: "التدفق والارتفاع المانومتري وعمق البئر: يُحدَّد نظام الضخ الشمسي انطلاقاً من معطيات هيدروليكية دقيقة.",
    sections: [
      {
        body: ["يجمع نظام الضخ الشمسي بين مضخة ومولّد كهروضوئي ونظام تحكم، ويتوقف أداؤه على تناسق هذه العناصر الثلاثة."],
      },
      {
        title: "المعطيات الهيدروليكية",
        body: ["يحدّد التدفق المطلوب والارتفاع المانومتري الكلي وعمق البئر والمسافة إلى نقطة الاستعمال القدرةَ الهيدروليكية اللازمة."],
      },
      {
        title: "نمط الاستعمال",
        body: ["تختلف الاحتياجات حسب الزراعات والفصول، ويأخذ تحديد الأبعاد بعين الاعتبار حجم الماء اليومي وفترات الذروة."],
      },
      {
        title: "من الحاجة إلى الحل",
        body: ["بعد حساب الحاجة، يتم اختيار نوع المضخة ثم تحديد القدرة الكهروضوئية ونظام التحكم الملائمين، قبل التركيب والتشغيل."],
      },
    ],
  },
  {
    slug: "stockage-batteries-quand-est-ce-pertinent",
    date: "2026-09-08",
    category: "التخزين",
    title: "البطاريات: متى يكون تخزين الطاقة مجدياً؟",
    excerpt: "رفع الاستهلاك الذاتي، تأمين التزويد، إدارة الفائض: يستجيب التخزين لأهداف دقيقة يجب تحديدها قبل تحديد الأبعاد.",
    sections: [
      {
        body: ["إضافة بطاريات إلى منظومة كهروضوئية ليست ضرورية دائماً. تحليل الاستهلاك والإنتاج والأهداف هو الذي يحسم الأمر."],
      },
      {
        title: "حالات الاستعمال",
        body: ["تخزين الفائض لاستهلاكه لاحقاً، أو توفير تزويد احتياطي عند الانقطاع، أو التحكم في الاستهلاك ضمن حل هجين."],
      },
      {
        title: "تحديد الحاجة إلى الاستقلالية",
        body: ["كم ساعة من الاستقلالية؟ ولأي معدات؟ تحدّد الإجابة سعة النظام وبنيته."],
      },
      {
        title: "المحاكاة قبل الاستثمار",
        body: ["تسمح المحاكاة الاقتصادية بالتأكد من تناسق الحل المعتمد مع الحاجة والميزانية، قبل التركيب."],
      },
    ],
  },
];

export function getArticles(locale: Locale): Article[] {
  return (locale === "ar" ? ar : fr).slice().sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(locale: Locale, slug: string): Article | undefined {
  return getArticles(locale).find((a) => a.slug === slug);
}
