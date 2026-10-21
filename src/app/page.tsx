import { CtaBand } from "./_components/cta-band";
import { Hero } from "./_components/hero";
import { Pricing } from "./_components/pricing";
import { Process } from "./_components/process";
import { SoloServices } from "./_components/solo-services";
import { WorkRail } from "./_components/work-rail";
import { Why } from "./_components/why";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Why />
      <Pricing />
      <SoloServices />
      <Process />
      <WorkRail />
      <CtaBand />
    </>
  );
}
