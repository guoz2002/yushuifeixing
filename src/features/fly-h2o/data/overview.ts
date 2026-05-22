import { media } from "./media";

export const modelSpecs = [
  ["MAX SPEED", "20 kn"],
  ["RANGE", "80+ km"],
  ["SEATS", "3 / 5"],
  ["MATERIAL", "Carbon Fiber"],
];

export const craftImages = [media.factory, media.manufacture, media.carbon, media.brand];

export const rangeCards = [
  { title: "Resort Route", text: "Short-distance premium water movement for waterfront resorts.", image: media.range1, href: "/tech/scenario" },
  { title: "City Waterfront", text: "Quiet electric hydrofoil movement through urban water.", image: media.range2, href: "/tech/scenario" },
  { title: "Leisure Cruise", text: "A floating cabin experience that stays close to the water.", image: media.range4, href: "/models/h2" },
  { title: "Test Ride", text: "Real operating scenes, splashes and long-range product proof.", image: media.range5, href: "/contact" },
];

export const galleryCards = [
  { title: "Smart Cockpit", image: media.app1 },
  { title: "Energy Screen", image: media.app2 },
  { title: "Owner App", image: media.app3 },
  { title: "Trip Status", image: media.app4 },
  { title: "Water Map", image: media.app5 },
];
