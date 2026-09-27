import type { Block, Locale, PageKey } from "@/content/types";
import type { Ui } from "@/content/ui";
import { getProjects } from "@/content/projects";
import { getArticles } from "@/content/articles";
import { CTA } from "../CTA";
import { EnergyFlow } from "../EnergyFlow";
import { ProjectsCarousel, ProjectsGrid } from "../Projects";
import { SectionHeader } from "../SectionHeader";
import { IntroBlock } from "./IntroBlock";
import { ListBlock } from "./ListBlock";
import { StepsBlock } from "./StepsBlock";
import { TableBlock } from "./TableBlock";
import { CalloutBlock } from "./CalloutBlock";
import { FaqBlock } from "./FaqBlock";
import { CeoBlock } from "./CeoBlock";
import { LegalBlock } from "./LegalBlock";
import { NewsList } from "./NewsList";
import { ContactBlock } from "./ContactBlock";
import { StudyForm } from "./StudyForm";
import { TextBlock } from "./TextBlock";
import { ValuesBlock } from "./ValuesBlock";
import { Section } from "./Section";

/** Renders a page's content blocks (the CMS-ready schema in content/types.ts). */
export function Blocks({ blocks, pageKey, ui, locale }: { blocks: Block[]; pageKey: PageKey; ui: Ui; locale: Locale }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "intro":
            return <IntroBlock key={i} title={b.title} text={b.text} image={b.image} />;
          case "list":
            return (
              <ListBlock
                key={i}
                title={b.title}
                lead={b.lead}
                items={b.items}
                variant={b.variant}
                locale={locale}
                moreLabel={ui.cta.more}
              />
            );
          case "steps":
            return <StepsBlock key={i} title={b.title} lead={b.lead} steps={b.steps} />;
          case "table":
            return <TableBlock key={i} title={b.title} head={b.head} rows={b.rows} />;
          case "callout":
            return <CalloutBlock key={i} label={b.label} text={b.text} />;
          case "faq":
            return <FaqBlock key={i} title={b.title} items={b.items} />;
          case "values":
            return <ValuesBlock key={i} title={b.title} lead={b.lead} items={b.items} />;
          case "text":
            return <TextBlock key={i} title={b.title} text={b.text} tags={b.tags} locale={locale} />;
          case "cta":
            return <CTA key={i} title={b.title} text={b.text} ui={ui} locale={locale} />;
          case "ceo":
            return <CeoBlock key={i} ui={ui} />;
          case "energyflow":
            return <EnergyFlow key={i} flow={ui.flow} />;
          case "projects": {
            const projects = getProjects(locale);
            if (pageKey === "projects") {
              return (
                <Section key={i}>
                  {b.title && <SectionHeader title={b.title} sub={b.lead} />}
                  <ProjectsGrid projects={projects} ui={ui} />
                </Section>
              );
            }
            return <ProjectsCarousel key={i} projects={projects} ui={ui} locale={locale} title={b.title} lead={b.lead} />;
          }
          case "news":
            return (
              <Section key={i}>
                {b.title && <SectionHeader title={b.title} />}
                <NewsList articles={getArticles(locale)} locale={locale} readMore={ui.cta.readMore} />
              </Section>
            );
          case "contact":
            return <ContactBlock key={i} ui={ui} locale={locale} />;
          case "studyForm":
            return <StudyForm key={i} ui={ui} locale={locale} />;
          case "legal":
            return <LegalBlock key={i} sections={b.sections} />;
        }
      })}
    </>
  );
}
