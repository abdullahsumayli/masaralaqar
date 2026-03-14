"use client";

import SaqrFeatures from "./components/Features";
import SaqrCTA from "./components/FinalCTA";
import SaqrHero from "./components/Hero";
import SaqrJourney from "./components/Journey";
import SaqrProblem from "./components/Problem";
import SaqrResults from "./components/Results";
import SaqrSolution from "./components/Solution";
import StickyWhatsApp from "./components/StickyWhatsApp";
import SaqrTrust from "./components/Trust";

export default function SaqrLanding() {
  return (
    <div className="min-h-screen bg-white font-ibm-arabic">
      <SaqrHero />
      <SaqrProblem />
      <SaqrSolution />
      <SaqrFeatures />
      <SaqrJourney />
      <SaqrResults />
      <SaqrTrust />
      <SaqrCTA />
      <StickyWhatsApp />
    </div>
  );
}
