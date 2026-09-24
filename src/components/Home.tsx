import { getDict, type Locale } from "@/content/site";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { Stats } from "./Stats";
import { Solutions } from "./Solutions";
import { EnergyFlow } from "./EnergyFlow";
import { WhyVertus } from "./WhyVertus";
import { About } from "./About";
import { Founder } from "./Founder";
import { Projects } from "./Projects";
import { Timeline } from "./Timeline";
import { Testimonials } from "./Testimonials";
import { CTA } from "./CTA";
import { ContactForm } from "./ContactForm";
import { Footer } from "./Footer";
import { Cursor } from "./Cursor";

export function Home({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <Cursor />
      <Navbar t={t} locale={locale} />
      <main>
        <Hero t={t} />
        <Intro t={t} />
        <Stats t={t} />
        <Solutions t={t} />
        <EnergyFlow t={t} />
        <WhyVertus t={t} />
        <About t={t} />
        <Founder t={t} />
        <Projects t={t} />
        <Timeline t={t} />
        <Testimonials t={t} />
        <CTA t={t} />
        <ContactForm t={t} />
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
