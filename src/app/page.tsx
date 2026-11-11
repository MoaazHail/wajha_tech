import { getLanding } from "@/shared/lib/apis/landing.api";

import { CtaBand } from "./_components/cta-band";
import { Hero } from "./_components/hero";
import { Pricing } from "./_components/pricing";
import { Process } from "./_components/process";
import { SoloServices } from "./_components/solo-services";
import { WorkRail } from "./_components/work-rail";
import { Why } from "./_components/why";
import { buildLandingSections } from "./_lib/constants/landing.constant";
import { findSection } from "./_lib/utils/landing.util";

export default async function HomePage() {
  const { settings, projects } = await getLanding();
  const sections = buildLandingSections(settings?.whatsapp ?? "");

  const hero = findSection(sections, "hero");
  const proof = findSection(sections, "proof");
  const features = findSection(sections, "features");
  const pkg = findSection(sections, "package");
  const services = findSection(sections, "services");
  const steps = findSection(sections, "process");
  const portfolio = findSection(sections, "portfolio");
  const cta = findSection(sections, "cta");

  return (
    <>
      {hero && <Hero section={hero} proof={proof} />}
      {features && <Why section={features} />}
      {pkg && <Pricing section={pkg} />}
      {services && <SoloServices section={services} />}
      {steps && <Process section={steps} />}
      {portfolio && <WorkRail section={portfolio} projects={projects} />}
      {cta && <CtaBand section={cta} />}
    </>
  );
}
