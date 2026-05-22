import { media } from "./media";

export const storeFeatures = [
  {
    path: "/store/hydrofoil",
    title: "Hydrofoil",
    label: "Y series craft",
    image: media.hydrofoilStore,
    lead: "Hydrofoil products are presented as a showroom-style product matrix with local inquiry actions.",
    specs: [
      ["SERIES", "Y-3 / Y-5"],
      ["PROPULSION", "Electric"],
      ["SERVICE", "Inquiry"],
    ] as [string, string][],
  },
  {
    path: "/store/hmi",
    title: "HMI",
    label: "Shipboard cockpit",
    image: media.hmiStore,
    lead: "The cockpit interface, steering wheel and cabin controls are rebuilt as a local product introduction page.",
    specs: [
      ["DISPLAY", "Cabin"],
      ["CONTROL", "Steering"],
      ["MODE", "Smart"],
    ] as [string, string][],
  },
  {
    path: "/store/design",
    title: "Ship Design",
    label: "Exterior and cabin design",
    image: media.designStore,
    lead: "Design services combine hull form, cabin layout and product identity in one dark technical layout.",
    specs: [
      ["SCOPE", "Design"],
      ["OUTPUT", "Scheme"],
      ["STYLE", "Premium"],
    ] as [string, string][],
  },
  {
    path: "/store/design/HullDesignBuild",
    title: "Hull Design Build",
    label: "Hull engineering",
    image: media.hullBuild,
    lead: "A focused hull design and build chapter for structure, production and delivery consultation.",
    specs: [
      ["BODY", "Hull"],
      ["MATERIAL", "Composite"],
      ["PROCESS", "Build"],
    ] as [string, string][],
  },
  {
    path: "/store/accessories",
    title: "Accessories",
    label: "Equipment and kits",
    image: media.accessoryStore,
    lead: "Accessories use a local cart-like experience, with inquiry buttons disabled from production checkout.",
    specs: [
      ["TYPE", "Accessory"],
      ["ORDER", "Local demo"],
      ["PAYMENT", "Disabled"],
    ] as [string, string][],
  },
  {
    path: "/store/development",
    title: "Software Development",
    label: "Digital water systems",
    image: media.developmentStore,
    lead: "Software pages cover cockpit, owner app, operating data and digital service flows.",
    specs: [
      ["APP", "Owner"],
      ["HMI", "Cabin"],
      ["DATA", "Local"],
    ] as [string, string][],
  },
  {
    path: "/store/distribution",
    title: "Distribution",
    label: "Dealer cooperation",
    image: media.distributionStore,
    lead: "Distribution pages introduce cooperation paths, store construction and regional operating support.",
    specs: [
      ["NETWORK", "Dealer"],
      ["REGION", "Global"],
      ["MODEL", "Cooperation"],
    ] as [string, string][],
  },
];

export const accessoryItems = [
  {
    id: "steering-wheel",
    title: "Smart Steering Wheel",
    label: "HMI accessory",
    price: "Inquiry",
    image: media.accessoryStore,
    description: "Integrated cabin control with steering, status information and quick operation entry points.",
  },
  {
    id: "flame-red-kit",
    title: "Flame Red Exterior Kit",
    label: "Color package",
    price: "Inquiry",
    image: media.accessory1,
    description: "A red visual kit matching the official product color language and local configurator surface.",
  },
  {
    id: "ocean-blue-kit",
    title: "Ocean Blue Exterior Kit",
    label: "Color package",
    price: "Inquiry",
    image: media.accessory2,
    description: "A blue exterior kit for a cooler marine presentation across product and option pages.",
  },
  {
    id: "sunset-yellow-kit",
    title: "Sunset Yellow Exterior Kit",
    label: "Color package",
    price: "Inquiry",
    image: media.accessory3,
    description: "A high-visibility yellow kit used for display, demo and branded operating scenes.",
  },
];

export const dealerItems = [
  {
    id: "shenzhen",
    title: "Shenzhen Experience Center",
    region: "Greater Bay Area",
    image: media.dealer1,
    address: "Shenzhen waterfront test-drive reception",
  },
  {
    id: "zhuhai",
    title: "Zhuhai Factory Store",
    region: "Manufacturing base",
    image: media.dealer2,
    address: "Zhuhai intelligent manufacturing and delivery center",
  },
  {
    id: "sanya",
    title: "Sanya Resort Partner",
    region: "Resort operation",
    image: media.dealer3,
    address: "Island resort operating and demo cooperation",
  },
];
