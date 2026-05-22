import { media } from "./media";

export const detailPages: Record<
  string,
  {
    label: string;
    title: string;
    lead: string;
    media: string[];
    stats: [string, string][];
    bullets: [string, string][];
  }
> = {
  "/manufacturing/quality": {
    label: "QUALITY CONTROL",
    title: "PRECISION QUALITY CONTROL.",
    lead: "Inspection, assembly, testing and delivery checks are presented as one traceable manufacturing flow.",
    media: [media.quality1, media.quality2, media.quality3, media.quality4, media.quality6],
    stats: [
      ["CHECKPOINTS", "Multi-stage"],
      ["PROCESS", "Traceable"],
      ["DELIVERY", "Water tested"],
    ],
    bullets: [
      ["Incoming Inspection", "Composite, propulsion and cabin parts enter a controlled inspection flow."],
      ["Assembly Review", "Structural and electrical nodes are checked before final enclosure."],
      ["Water Validation", "The craft is validated under real operating posture before delivery."],
    ],
  },
  "/manufacturing/battery": {
    label: "BATTERY SYSTEM",
    title: "SAFE. INTELLIGENT. COMPREHENSIVE.",
    lead: "A black technical chapter for the high-voltage system, enclosure protection and managed energy signals.",
    media: [media.battery3, media.battery4, media.battery5, media.battery6],
    stats: [
      ["LAYOUT", "Modular"],
      ["PROTECTION", "Waterproof"],
      ["CONTROL", "BMS"],
    ],
    bullets: [
      ["Safety", "Independent protection logic and enclosure design for marine use."],
      ["Intelligence", "Battery status, discharge and thermal signals are presented as a managed system."],
      ["Lightweight", "Power is packaged for balance, range and serviceability."],
    ],
  },
  "/manufacturing/unmanned": {
    label: "UNMANNED PLATFORM",
    title: "AUTONOMOUS WATER PLATFORM.",
    lead: "Sensors, platform structure and usage scenes turn the unmanned system into a darker technical showcase.",
    media: [media.unmanned3, media.unmanned4, media.unmanned8, media.unmanned11],
    stats: [
      ["MODE", "Remote"],
      ["MISSION", "Patrol"],
      ["PLATFORM", "Hydrofoil"],
    ],
    bullets: [
      ["Remote Operation", "Support for operator-controlled water missions."],
      ["Scenario Expansion", "Patrol, inspection and resort operation scenes."],
      ["Hydrofoil Efficiency", "Low drag movement over water for longer use windows."],
    ],
  },
  "/manufacturing/carbonFiber": {
    label: "CARBON FIBER",
    title: "LIGHTWEIGHT COMPOSITE STRUCTURE.",
    lead: "Carbon fiber carries the strongest visual signal here: dark material, high gloss reflection and precision surfaces.",
    media: [media.carbon, media.carbon5, media.manufacture, media.factory],
    stats: [
      ["MATERIAL", "Carbon"],
      ["STRUCTURE", "Lightweight"],
      ["SURFACE", "Precision"],
    ],
    bullets: [
      ["Lightweight Shell", "Composite bodywork reduces weight while retaining stiffness."],
      ["Marine Finish", "Surface finishing is tuned for water, sun and repeated outdoor use."],
      ["Integrated Form", "Cabin, hull and foil structure read as one continuous product gesture."],
    ],
  },
  "/manufacturing/carbon-fiber-material": {
    label: "CARBON MATERIAL",
    title: "CARBON FIBER MATERIALS.",
    lead: "A material chapter built from the recovered carbon and manufacturing assets.",
    media: [media.carbon5, media.carbon, media.manufacture, media.quality2],
    stats: [
      ["FIBER", "Composite"],
      ["WEIGHT", "Reduced"],
      ["FINISH", "Gloss"],
    ],
    bullets: [
      ["Material Layer", "The visual layer emphasizes carbon texture and structural depth."],
      ["Process Control", "Material consistency is paired with controlled assembly."],
      ["Product Feel", "The final surface is part of the premium riding experience."],
    ],
  },
  "/manufacturing/brand": {
    label: "BRAND",
    title: "THE BRAND BUILT ABOVE WATER.",
    lead: "Atmospheric photography, product symbols and a quiet premium tone shape the water mobility story.",
    media: [media.brand, media.brand2, media.brand6, media.brand9, media.brand10],
    stats: [
      ["POSITION", "Premium"],
      ["LANGUAGE", "Water tech"],
      ["SIGNAL", "ALAQUA"],
    ],
    bullets: [
      ["Visual Identity", "A black, red and white system keeps product and brand as the first signal."],
      ["Product Theater", "Lighting, close-up form and cinematic motion replace ordinary brochure layout."],
      ["Water Mobility", "The brand reads as a new category between marine product and smart vehicle."],
    ],
  },
  "/serve": {
    label: "SERVICE",
    title: "OWNER AND OPERATION SERVICE.",
    lead: "Service pages are more practical: customer support, guide material and after-sales entry points.",
    media: [media.service1, media.service2, media.guide1, media.guide2],
    stats: [
      ["SUPPORT", "Owner"],
      ["GUIDE", "Operation"],
      ["CARE", "After-sales"],
    ],
    bullets: [
      ["Owner Guide", "Clear operation and maintenance guidance after delivery."],
      ["Service Entry", "A direct support path for customers and operators."],
      ["Field Feedback", "Practical service scenes inform the next product iteration."],
    ],
  },
  "/customerService": {
    label: "CUSTOMER SERVICE",
    title: "AFTER-SALES AND SUPPORT.",
    lead: "A support surface for service requests, account issues and customer communication.",
    media: [media.service2, media.contact2, media.contact3, media.guide2],
    stats: [
      ["RESPONSE", "Service"],
      ["ACCOUNT", "Support"],
      ["OWNER", "Care"],
    ],
    bullets: [
      ["Contact", "Collect service requests and direct them to the right team."],
      ["Account", "Provide account appeal, freeze and delete entry points."],
      ["Delivery", "Support handover, use and after-sales communication."],
    ],
  },
  "/investors": {
    label: "INVESTORS",
    title: "INDUSTRIAL CAPITAL AND GROWTH.",
    lead: "Investor presentation pages combine capital partners, technical category story and manufacturing proof.",
    media: [media.investor3, media.investor6, media.cooperation, media.factory],
    stats: [
      ["CAPITAL", "Industrial"],
      ["CATEGORY", "Water mobility"],
      ["BASE", "Zhuhai"],
    ],
    bullets: [
      ["Hard-tech Backing", "The page highlights an engineering-led product and manufacturing path."],
      ["Market Expansion", "Resort, urban water and operator scenes create multiple commercial routes."],
      ["Manufacturing Proof", "Factory and quality assets make the story more concrete."],
    ],
  },
  "/tech/scenario": {
    label: "SCENARIO",
    title: "URBAN WATER AND RESORT SCENARIOS.",
    lead: "Real water movement, resort operation and waterfront routes carry the scenario story.",
    media: [media.range1, media.range2, media.range4, media.range5],
    stats: [
      ["SCENE", "Resort"],
      ["WATER", "Urban"],
      ["MODE", "Leisure"],
    ],
    bullets: [
      ["Resort Operation", "Premium short-distance water movement for destination businesses."],
      ["Urban Water", "Quiet electric propulsion fits city waterfront use cases."],
      ["Experience", "The product is framed as both transport and memorable water activity."],
    ],
  },
};
