import type { Page, PageKey } from "./types";

/** Contenu français — conforme au Cahier des charges Web V2.1. */
export const pagesFr: Record<PageKey, Page> = {
  home: {
    key: "home",
    seo: {
      title: "Panneaux solaires & énergie solaire en Tunisie | VERTUS",
      description:
        "Installation de panneaux solaires en Tunisie : étude, onduleur, batterie solaire, pompage solaire et bornes de recharge. Réduisez votre facture STEG avec VERTUS.",
    },
    hero: {
      eyebrow: "VERTUS Technology",
      h1: "L’énergie solaire pensée pour la performance.",
      lead: "Nous concevons, dimensionnons et réalisons des solutions énergétiques adaptées aux besoins résidentiels, professionnels, agricoles et industriels.",
      message: "Étude • Ingénierie • Installation • Performance",
    },
    blocks: [
      {
        type: "intro",
        title: "Construire aujourd’hui l’énergie de demain.",
        text: [
          "Chez VERTUS Technology, chaque projet énergétique est considéré comme une problématique technique et économique à optimiser.",
          "Nous accompagnons nos clients depuis l’analyse du besoin jusqu’à la mise en service de leurs projets, avec une approche intégrée combinant ingénierie, optimisation et réalisation.",
        ],
        image: {
          src: "/about/solar-construction-site.jpg",
          alt: "Techniciens installant des panneaux solaires sur un chantier de centrale photovoltaïque",
        },
      },
      { type: "callout", label: "Positionnement", text: "Analyser. Concevoir. Optimiser. Réaliser." },
      {
        type: "list",
        title: "Nos solutions",
        lead: "Des solutions énergétiques conçues pour la performance, de l’étude à la réalisation.",
        variant: "cards",
        items: [
          { title: "Photovoltaïque", desc: "Production d’énergie solaire.", icon: "panel", href: "pv" },
          { title: "Pompage solaire", desc: "Solutions de pompage photovoltaïque.", icon: "pump", href: "pumping" },
          { title: "Stockage", desc: "Batteries et gestion de l’énergie.", icon: "battery", href: "storage" },
          { title: "Mobilité électrique", desc: "Solutions de recharge.", icon: "charger", href: "mobility" },
          { title: "Ingénierie", desc: "Études et optimisation.", icon: "study", href: "engineering" },
          { title: "METAFORM", desc: "Solutions métalliques industrielles.", icon: "profile", href: "metaform" },
        ],
      },
      {
        type: "text",
        title: "Panneaux solaires et énergie solaire en Tunisie",
        text: ["Avec un ensoleillement parmi les plus élevés de la Méditerranée, la Tunisie se prête particulièrement bien à l’énergie solaire. Une installation de panneaux solaires bien dimensionnée permet de produire sur place une partie de l’électricité consommée et de réduire la facture STEG.", "En autoconsommation, l’énergie produite par les panneaux photovoltaïques est convertie par l’onduleur puis utilisée directement dans le bâtiment. L’installation peut rester raccordée au réseau STEG, et des batteries solaires peuvent stocker une partie de la production pour la consommer le soir ou en cas de coupure.", "Chaque projet commence par l’analyse de votre consommation en kWh et de vos factures, puis par le dimensionnement de la puissance en kWc, le choix des panneaux, de l’onduleur et, si besoin, de la batterie. Pour l’agriculture, le pompage solaire alimente directement les pompes d’irrigation à partir de l’énergie du soleil."],
        tags: [{"label": "Panneaux solaires", "href": "pv"}, {"label": "Énergie solaire", "href": "solutions"}, {"label": "Installation photovoltaïque", "href": "pv"}, {"label": "Batterie solaire", "href": "storage"}, {"label": "Onduleur", "href": "pv"}, {"label": "Autoconsommation", "href": "pv"}, {"label": "Facture STEG", "href": "faq"}, {"label": "kWc / kWh", "href": "faq"}, {"label": "Pompage solaire", "href": "pumping"}, {"label": "Borne de recharge", "href": "mobility"}, {"label": "Bureau d’études", "href": "engineering"}],
      },
      {
        type: "steps",
        title: "Notre méthode",
        steps: [
          "Analyser le besoin.",
          "Étudier les contraintes.",
          "Concevoir la solution.",
          "Optimiser.",
          "Réaliser.",
          "Mettre en service.",
          "Accompagner.",
        ],
      },
      {
        type: "list",
        title: "Pourquoi VERTUS ?",
        lead: "Une approche d’ingénierie qui part de votre besoin réel et vous accompagne jusqu’à la mise en service.",
        variant: "checks",
        items: [
          "Approche orientée ingénierie.",
          "Solutions adaptées au besoin réel.",
          "Optimisation technico-économique.",
          "Accompagnement de l’étude à la réalisation.",
          "Vision énergétique et industrielle.",
          "Recherche de performance et de fiabilité.",
        ],
      },
      { type: "projects", title: "Réalisations", lead: "La preuve par les projets." },
      { type: "ceo" },
      { type: "cta", title: "Vous avez un projet énergétique ? Parlons-en." },
    ],
  },

  company: {
    key: "company",
    seo: {
      title: "VERTUS Technology | Entreprise, mission et vision",
      description:
        "VERTUS Technology, bureau d’études et intégrateur en énergie solaire à Ariana : notre mission, notre vision et notre méthode, de l’analyse à la réalisation.",
    },
    hero: {
      eyebrow: "Entreprise et vision",
      h1: "Une vision technique de l’énergie.",
      lead: "VERTUS Technology développe des solutions énergétiques et technologiques destinées à améliorer la performance et l’efficacité énergétique.",
    },
    blocks: [
      {
        type: "list",
        title: "Mission et vision",
        variant: "cards",
        items: [
          { title: "Mission", desc: "Transformer les besoins énergétiques en solutions techniques concrètes, mesurables et durables." },
          { title: "Vision", desc: "Construire une entreprise technologique intégrant énergie, ingénierie, industrie et innovation." },
        ],
      },
      {
        type: "values",
        title: "Nos valeurs",
        lead: "Six principes qui guident chaque projet, de l’étude à la mise en service.",
        items: [
          { title: "Exigence", desc: "Qualité technique et opérationnelle.", icon: "gear" },
          { title: "Innovation", desc: "Technologies pertinentes.", icon: "bulb" },
          { title: "Performance", desc: "Résultats mesurables.", icon: "bolt" },
          { title: "Responsabilité", desc: "Solutions durables.", icon: "sun" },
          { title: "Transparence", desc: "Communication claire.", icon: "bubble" },
          { title: "Engagement", desc: "Accompagnement dans la durée.", icon: "shield" },
        ],
      },
      { type: "callout", label: "Signature de marque", text: "VERTUS Technology — Engineering Energy. Building the Future." },
      { type: "ceo" },
      { type: "cta", title: "Vous avez un projet énergétique ? Parlons-en." },
    ],
  },

  solutions: {
    key: "solutions",
    seo: {
      title: "Solutions énergétiques en Tunisie | VERTUS Technology",
      description:
        "Photovoltaïque, pompage solaire, stockage, mobilité électrique, ingénierie et METAFORM : des solutions énergétiques intégrées, de l’étude à la réalisation.",
    },
    hero: {
      eyebrow: "Vue globale",
      h1: "Des solutions énergétiques conçues pour la performance.",
      lead: "Chaque solution est dimensionnée à partir de votre besoin réel, puis optimisée sur le plan technique et économique.",
    },
    blocks: [
      {
        type: "list",
        title: "Nos solutions",
        variant: "cards",
        items: [
          { title: "Photovoltaïque", desc: "Centrales solaires résidentielles, commerciales, agricoles et industrielles, en autoconsommation.", icon: "panel", href: "pv" },
          { title: "Pompage solaire", desc: "Systèmes de pompage dimensionnés à partir des données hydrauliques et électriques.", icon: "pump", href: "pumping" },
          { title: "Stockage", desc: "Batteries, secours énergétique et gestion de la consommation.", icon: "battery", href: "storage" },
          { title: "Mobilité électrique", desc: "Bornes de recharge et recharge optimisée par le solaire.", icon: "charger", href: "mobility" },
          { title: "Ingénierie & bureau d’études", desc: "Études, dimensionnement, simulations et dossiers techniques.", icon: "study", href: "engineering" },
          { title: "METAFORM", desc: "Profilage et solutions métalliques pour l’industrie et l’énergie.", icon: "profile", href: "metaform" },
        ],
      },
      { type: "steps", title: "Notre méthode", steps: ["Analyser le besoin.", "Étudier les contraintes.", "Concevoir la solution.", "Optimiser.", "Réaliser.", "Mettre en service.", "Accompagner."] },
      { type: "cta", title: "Vous avez un projet énergétique ? Parlons-en." },
    ],
  },

  pv: {
    key: "pv",
    seo: {
      title: "Installation panneaux solaires Tunisie | VERTUS Technology",
      description:
        "Panneaux solaires et installation photovoltaïque en Tunisie : étude en kWc/kWh, onduleur, autoconsommation raccordée au réseau STEG, pose et suivi.",
    },
    hero: {
      eyebrow: "Photovoltaïque",
      h1: "Produire votre propre énergie. Maîtriser votre avenir énergétique.",
      lead: "VERTUS Technology accompagne ses clients dans la conception et la réalisation de centrales photovoltaïques adaptées à leurs consommations et objectifs.",
    },
    blocks: [
      {
        type: "list",
        title: "Types de projets",
        variant: "checks",
        items: ["Résidentiel.", "Commercial.", "Agricole.", "Industriel.", "Bâtiments professionnels.", "Autoconsommation.", "Stockage.", "Solutions évolutives."],
      },
      { type: "energyflow" },
      {
        type: "steps",
        title: "Processus",
        steps: [
          "Analyse de la consommation.",
          "Analyse du profil énergétique.",
          "Étude du site.",
          "Dimensionnement.",
          "Sélection des équipements.",
          "Étude économique.",
          "Préparation technique.",
          "Installation.",
          "Mise en service.",
          "Suivi.",
        ],
      },
      { type: "cta", title: "Vous avez un projet photovoltaïque ? Parlons-en." },
    ],
  },

  pumping: {
    key: "pumping",
    seo: {
      title: "Pompage solaire Tunisie | VERTUS Technology",
      description:
        "Pompage solaire pour l’irrigation et l’eau en Tunisie : dimensionnement selon débit, profondeur et hauteur manométrique, installation et mise en service.",
    },
    hero: {
      eyebrow: "Agriculture et alimentation en eau",
      h1: "Le pompage solaire adapté à votre besoin hydraulique.",
      lead: "Nous concevons des systèmes de pompage solaire en tenant compte des caractéristiques hydrauliques et électriques.",
    },
    blocks: [
      {
        type: "list",
        title: "Paramètres étudiés",
        variant: "checks",
        items: ["Débit.", "Hauteur manométrique.", "Profondeur du forage.", "Distance.", "Profil d’utilisation.", "Type de pompe.", "Puissance photovoltaïque.", "Système de commande."],
      },
      {
        type: "steps",
        title: "Processus",
        steps: [
          "Collecte des données.",
          "Calcul du besoin.",
          "Dimensionnement de la pompe.",
          "Dimensionnement photovoltaïque.",
          "Choix de la commande.",
          "Installation.",
          "Mise en service.",
        ],
      },
      { type: "cta", title: "Un besoin en pompage solaire ? Parlons-en." },
    ],
  },

  storage: {
    key: "storage",
    seo: {
      title: "Batterie solaire & stockage d’énergie Tunisie | VERTUS",
      description:
        "Batteries solaires et stockage d’énergie en Tunisie : autoconsommation, secours en cas de coupure et solutions hybrides, dimensionnés après analyse de vos besoins.",
    },
    hero: {
      eyebrow: "Batteries et gestion énergétique",
      h1: "Stocker l’énergie. Gagner en flexibilité.",
      lead: "Le stockage permet de mieux valoriser votre production solaire et de sécuriser votre alimentation, selon l’architecture du système et vos objectifs.",
    },
    blocks: [
      {
        type: "list",
        title: "Ce que permet le stockage",
        variant: "checks",
        items: [
          "Augmentation de l’autoconsommation.",
          "Stockage des surplus.",
          "Secours énergétique.",
          "Gestion de la consommation.",
          "Optimisation énergétique.",
          "Solutions hybrides.",
        ],
      },
      {
        type: "steps",
        title: "Étude",
        steps: [
          "Analyse de la consommation.",
          "Analyse de la production.",
          "Définition du besoin d’autonomie.",
          "Dimensionnement.",
          "Choix de l’architecture.",
          "Simulation économique.",
          "Installation.",
        ],
      },
      { type: "cta", title: "Un projet de stockage ? Parlons-en." },
    ],
  },

  mobility: {
    key: "mobility",
    seo: {
      title: "Borne de recharge Tunisie | Mobilité électrique | VERTUS",
      description:
        "Bornes de recharge pour véhicules électriques en Tunisie : résidentiel, entreprises et flottes, avec étude de puissance et intégration photovoltaïque.",
    },
    hero: {
      eyebrow: "Recharge et intégration solaire",
      h1: "Recharger votre mobilité avec une énergie mieux maîtrisée.",
      lead: "Nous étudions et installons des solutions de recharge adaptées à vos usages, avec la possibilité de les coupler à une production photovoltaïque.",
    },
    blocks: [
      {
        type: "table",
        title: "Solutions de recharge",
        head: ["Type", "Application"],
        rows: [
          ["7,4 kW", "Résidentiel et petits usages professionnels."],
          ["AC professionnel", "Bureaux, hôtels et commerces."],
          ["Puissances supérieures", "Applications professionnelles selon configuration."],
          ["Intégration PV", "Recharge optimisée par le solaire."],
          ["Flottes", "Gestion de plusieurs véhicules."],
        ],
      },
      { type: "cta", title: "Un projet de recharge ? Parlons-en." },
    ],
  },

  engineering: {
    key: "engineering",
    seo: {
      title: "Bureau d’études photovoltaïque Tunisie | VERTUS",
      description:
        "Bureau d’études photovoltaïque en Tunisie : audit énergétique, dimensionnement, simulations, études techniques et économiques et suivi de projets énergétiques.",
    },
    hero: {
      eyebrow: "Le cœur technique de VERTUS",
      h1: "L’ingénierie avant l’installation.",
      lead: "Une bonne installation commence par une bonne étude. Notre bureau d’études transforme les besoins du client en solutions techniques dimensionnées et optimisées.",
    },
    blocks: [
      {
        type: "list",
        title: "Nos prestations",
        variant: "checks",
        items: [
          "Études de faisabilité.",
          "Études photovoltaïques.",
          "Dimensionnement.",
          "Études électriques.",
          "Simulation énergétique.",
          "Optimisation technico-économique.",
          "Plans et schémas.",
          "Dossiers techniques.",
          "Dossiers administratifs.",
          "Assistance technique.",
        ],
      },
      {
        type: "steps",
        title: "Notre démarche",
        steps: ["Collecter les données.", "Analyser les contraintes.", "Construire les scénarios.", "Comparer les solutions.", "Optimiser.", "Valider.", "Présenter."],
      },
      {
        type: "callout",
        label: "Positionnement",
        text: "Notre objectif n’est pas de vendre uniquement une puissance installée. Notre objectif est de concevoir une solution cohérente avec le besoin réel.",
      },
      { type: "cta", title: "Besoin d’une étude ? Parlons-en." },
    ],
  },

  metaform: {
    key: "metaform",
    seo: {
      title: "METAFORM | Profilage métallique Tunisie | VERTUS",
      description:
        "METAFORM, l’activité métallique de VERTUS Technology : profilage, structures et fabrication industrielle sur mesure, dont les supports pour installations solaires.",
    },
    hero: {
      eyebrow: "Pôle industriel",
      h1: "METAFORM — L’ingénierie métallique au service de l’industrie et de l’énergie.",
      lead: "METAFORM constitue le pôle industriel dédié au profilage et aux solutions métalliques pour les applications industrielles, énergétiques et de construction.",
    },
    blocks: [
      {
        type: "list",
        title: "Expertise",
        variant: "cards",
        items: [
          { title: "Structures métalliques photovoltaïques", icon: "panel" },
          { title: "Supports métalliques", icon: "profile" },
          { title: "Chemins de câbles", icon: "bolt" },
          { title: "Solutions métalliques sur mesure", icon: "gear" },
          { title: "Fabrication selon plans", icon: "industry" },
        ],
      },
      {
        type: "steps",
        title: "Processus industriel",
        steps: [
          "Analyse du besoin.",
          "Conception.",
          "Étude technique.",
          "Conception des outillages.",
          "Préparation matière.",
          "Profilage.",
          "Contrôle dimensionnel.",
          "Finition.",
          "Conditionnement.",
          "Livraison.",
        ],
      },
      {
        type: "callout",
        label: "METAFORM",
        text: "Concevoir et fabriquer des solutions métalliques adaptées aux exigences de l’industrie et de l’énergie.",
      },
      { type: "cta", title: "Un besoin en solutions métalliques ? Parlons-en." },
    ],
  },

  projects: {
    key: "projects",
    seo: {
      title: "Réalisations photovoltaïques et industrielles | VERTUS",
      description:
        "Projets réalisés par VERTUS Technology et METAFORM en Tunisie : installations photovoltaïques, pompage solaire et solutions industrielles, du besoin au résultat.",
    },
    hero: {
      eyebrow: "La preuve par les projets",
      h1: "Nos réalisations.",
      lead: "Cette page présentera progressivement les projets réalisés par VERTUS Technology et METAFORM.",
    },
    blocks: [{ type: "projects" }, { type: "cta", title: "Vous avez un projet énergétique ? Parlons-en." }],
  },

  expertise: {
    key: "expertise",
    seo: {
      title: "Expertise énergie, électricité et hydraulique | VERTUS",
      description:
        "Énergie solaire, électricité, hydraulique, stockage, mobilité électrique, industrie et ingénierie : les domaines de compétence de VERTUS Technology en Tunisie.",
    },
    hero: {
      eyebrow: "Domaines de compétence",
      h1: "Une expertise technique pluridisciplinaire.",
      lead: "Énergie, électricité, hydraulique et industrie : des compétences complémentaires au service de solutions cohérentes.",
    },
    blocks: [
      {
        type: "table",
        title: "Domaines de compétence",
        head: ["Domaine", "Compétences"],
        rows: [
          ["Énergie solaire", "PV, autoconsommation, dimensionnement."],
          ["Électricité", "Études, schémas et dimensionnement."],
          ["Hydraulique", "Pompage et dimensionnement."],
          ["Stockage", "Batteries et autonomie."],
          ["Mobilité", "Recharge VE."],
          ["Industrie", "Profilage et solutions métalliques."],
          ["Ingénierie", "Études techniques et économiques."],
        ],
      },
      { type: "cta", title: "Vous avez un projet énergétique ? Parlons-en." },
    ],
  },

  news: {
    key: "news",
    seo: {
      title: "Actualités et conseils photovoltaïques | VERTUS",
      description:
        "Conseils photovoltaïques, pompage solaire, stockage et mobilité électrique : guides pratiques et actualités du bureau d’études VERTUS Technology en Tunisie.",
    },
    hero: {
      eyebrow: "Actualités",
      h1: "Actualités et conseils énergétiques.",
      lead: "Nouveaux projets, explications techniques et conseils pour mieux comprendre vos solutions énergétiques.",
    },
    blocks: [{ type: "news" }],
  },

  faq: {
    key: "faq",
    seo: {
      title: "FAQ panneaux solaires, kWh, batterie, STEG | VERTUS",
      description:
        "Production en kWh d’un panneau solaire, facture STEG, raccordement, batterie, kWc et kWh : les réponses aux questions fréquentes sur l’énergie solaire en Tunisie.",
    },
    hero: { eyebrow: "FAQ", h1: "Questions fréquentes." },
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Combien coûte une installation photovoltaïque ?",
            a: "Le coût dépend de la puissance, de la consommation, de la configuration du site et des équipements.",
          },
          {
            q: "Quelle puissance photovoltaïque me faut-il ?",
            a: "La puissance doit être déterminée à partir de la consommation, du profil énergétique et des objectifs.",
          },
          { q: "Peut-on ajouter des batteries ?", a: "Oui, selon l’architecture du système et les objectifs." },
          {
            q: "Proposez-vous le pompage solaire ?",
            a: "Oui. Le dimensionnement est réalisé à partir des données hydrauliques et énergétiques.",
          },
          {
            q: "Proposez-vous des solutions pour les entreprises ?",
            a: "Oui. Les solutions peuvent être adaptées aux bâtiments professionnels, agricoles et industriels.",
          },
          { q: "Combien de kWh produit un panneau solaire en Tunisie ?", a: "À titre indicatif, 1 kWc de panneaux solaires produit environ 1 500 à 1 700 kWh par an en Tunisie. La production réelle dépend de la région, de l’orientation, de l’inclinaison et des ombrages : l’étude du site permet de l’estimer précisément." },
          { q: "Comment réduire ma facture STEG avec des panneaux solaires ?", a: "En autoconsommation, l’électricité produite par vos panneaux solaires est consommée directement sur place, ce qui réduit l’énergie achetée au réseau STEG. Le gain dépend de votre consommation en kWh, de vos horaires de consommation et de la puissance installée : nous l’estimons lors de l’étude." },
          { q: "Une installation solaire peut-elle rester raccordée au réseau STEG ?", a: "Oui. Une installation photovoltaïque peut fonctionner raccordée au réseau électrique de la STEG, selon les procédures et conditions en vigueur. Les démarches applicables à votre projet sont précisées lors de l’étude." },
          { q: "Quelle batterie choisir pour une installation solaire ?", a: "Le choix de la batterie (technologie, capacité en kWh, puissance) dépend de l’autonomie recherchée, des équipements à alimenter et de l’objectif : augmenter l’autoconsommation ou disposer d’un secours en cas de coupure." },
          { q: "Quelle est la différence entre kW, kWc et kWh ?", a: "Le kWc (kilowatt-crête) exprime la puissance maximale des panneaux solaires. Le kW mesure une puissance instantanée, et le kWh une quantité d’énergie produite ou consommée : c’est l’unité utilisée sur la facture STEG." },
          { q: "Combien de panneaux solaires faut-il pour une maison ?", a: "Cela dépend de la consommation annuelle en kWh, de la surface disponible et de la puissance des panneaux choisis. Une étude à partir de vos factures STEG permet de déterminer la puissance en kWc et le nombre de panneaux adaptés." },
          {
            q: "METAFORM propose-t-elle des solutions sur mesure ?",
            a: "Oui. METAFORM développe des solutions métalliques adaptées aux spécifications des projets.",
          },
        ],
      },
      { type: "cta", title: "Vous ne trouvez pas votre réponse ? Parlons-en." },
    ],
  },

  contact: {
    key: "contact",
    seo: {
      title: "Contact | VERTUS Technology, Ariana, Tunisie",
      description:
        "Contactez VERTUS Technology par téléphone (93 666 300), WhatsApp ou e-mail, ou rendez-nous visite au Centre Urbain Nord, Ariana. Réponse de notre équipe technique.",
    },
    hero: {
      eyebrow: "Contact",
      h1: "Parlons de votre projet.",
      lead: "Vous avez un projet photovoltaïque, énergétique ou industriel ? Notre équipe peut analyser votre besoin et vous proposer une première orientation technique.",
    },
    blocks: [{ type: "contact" }],
  },

  study: {
    key: "study",
    seo: {
      title: "Demander une étude photovoltaïque | VERTUS Technology",
      description:
        "Décrivez votre projet photovoltaïque, de pompage, de stockage ou industriel : notre bureau d’études l’analyse et vous répond avec une première orientation technique.",
    },
    hero: {
      eyebrow: "Formulaire d’étude",
      h1: "Demander une étude.",
      lead: "Plus vos informations sont précises, plus notre première analyse sera pertinente. Les champs techniques sont facultatifs.",
    },
    blocks: [{ type: "studyForm" }],
  },

  legal: {
    key: "legal",
    seo: {
      title: "Mentions légales | VERTUS Technology",
      description:
        "Mentions légales du site VERTUS Technology : éditeur, siège au Centre Urbain Nord à Ariana, propriété intellectuelle, responsabilité et conditions d’utilisation.",
    },
    hero: { h1: "Mentions légales." },
    blocks: [
      {
        type: "legal",
        sections: [
          {
            title: "Éditeur du site",
            body: [
              "VERTUS Technology — siège social : Centre Urbain Nord, Ariana, Tunisie.",
              "Forme juridique, capital, identifiant unique (RNE) et matricule fiscal : [à compléter].",
              "Téléphone : 93 666 300 / 93 57 57 00 — E-mail : dg.vertus@gmail.com / vertustechnology@gmail.com.",
              "Directeur de la publication : le représentant légal de VERTUS Technology.",
            ],
          },
          {
            title: "Propriété intellectuelle",
            body: [
              "L’ensemble des contenus de ce site (textes, visuels, logos, marques VERTUS Technology et METAFORM) est protégé. Toute reproduction sans autorisation écrite préalable est interdite.",
            ],
          },
          {
            title: "Responsabilité",
            body: [
              "Les informations publiées sur ce site sont fournies à titre indicatif. Elles ne constituent pas une offre commerciale ni un engagement de performance, qui ne peuvent résulter que d’une étude et d’une proposition écrite.",
            ],
          },
          {
            title: "Données personnelles et cookies",
            body: ["Le traitement des données personnelles et l’usage des cookies sont décrits dans la politique de confidentialité."],
          },
        ],
      },
    ],
  },

  privacy: {
    key: "privacy",
    seo: {
      title: "Politique de confidentialité | VERTUS Technology",
      description:
        "Comment VERTUS Technology collecte, utilise et protège vos données personnelles, conformément à la loi organique n° 2004-63, et comment exercer vos droits.",
    },
    hero: { h1: "Politique de confidentialité." },
    blocks: [
      {
        type: "legal",
        sections: [
          {
            title: "Responsable du traitement",
            body: ["VERTUS Technology, Centre Urbain Nord, Ariana, Tunisie — dg.vertus@gmail.com."],
          },
          {
            title: "Données collectées",
            body: [
              "Via le formulaire « Demander une étude » : nom et prénom, entreprise, téléphone, e-mail, ville, type de projet, informations techniques facultatives (puissance, consommation, facture, surface, toiture, besoins en stockage, pompage ou recharge), message et pièces jointes.",
              "Via la mesure d’audience, uniquement avec votre accord : pages consultées, source de visite, type d’appareil et interactions (clics sur les boutons de contact).",
            ],
          },
          {
            title: "Finalités",
            body: [
              "Répondre à votre demande, réaliser l’étude, vous adresser une proposition et assurer le suivi commercial de votre projet.",
              "Mesurer l’audience du site afin de l’améliorer.",
            ],
          },
          {
            title: "Destinataires et hébergement",
            body: [
              "Les données sont destinées aux équipes de VERTUS Technology. Les demandes sont enregistrées dans des outils Google (Google Sheets et Google Drive) ; la mesure d’audience, lorsqu’elle est acceptée, utilise Google Analytics.",
            ],
          },
          {
            title: "Durée de conservation",
            body: ["Les données sont conservées pendant la durée nécessaire au traitement de la demande et au suivi de la relation commerciale : [durée à préciser]."],
          },
          {
            title: "Vos droits",
            body: [
              "Conformément à la loi organique n° 2004-63 du 27 juillet 2004 portant sur la protection des données à caractère personnel, vous disposez d’un droit d’accès, de rectification et d’opposition. Pour l’exercer, écrivez à dg.vertus@gmail.com.",
            ],
          },
          {
            title: "Cookies",
            body: [
              "Les cookies de mesure d’audience ne sont déposés qu’après votre accord via le bandeau dédié. Vous pouvez modifier votre choix à tout moment avec le lien « Gérer les cookies » en bas de page.",
            ],
          },
        ],
      },
    ],
  },
};
