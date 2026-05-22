import { assetBaseUrl as A, media } from "./media";

export const productCards = [
  { title: "Y-3", label: "Three-Seat Edition", image: media.productY3Menu, href: "/models/h1" },
  { title: "Y-5", label: "Five-Seat Edition", image: media.productY5, href: "/models/h2" },
];

export const menuPanels = {
  products: productCards,
  manufacturing: [
    { title: "Battery", label: "Marine Battery System", image: media.productY3, href: "/manufacturing/battery" },
    { title: "Outboard Motor", label: "Electric Outboard", image: `${A}/img/menu-5-DYt1kATd.jpg`, href: "/manufacturing/outboard-motor" },
    { title: "Carbon Fiber", label: "Carbon Fiber Material", image: `${A}/img/menu-4-ChL-za_i.jpg`, href: "/manufacturing/carbon-fiber-material" },
  ],
  core: [
    { title: "Hydrofoil Advantages", label: "Speed, Stability, Comfort", image: media.y5Menu, href: "/tech/advantages" },
    { title: "Use Scenarios", label: "Passenger, Leisure, Transport", image: `${A}/img/menu-7-fAyGQjop.jpg`, href: "/tech/scenario" },
    { title: "BP Introduction", label: "Detailed Data Display", image: `${A}/img/menu-3-US3duFh-.jpg`, href: "https://bp.fly-h2o.cn/" },
  ],
  introduction: [
    { title: "Company", label: "About Fly H2O", image: media.brand, href: "/company-intro" },
    { title: "Team", label: "Product Engineering", image: media.team1, href: "/team" },
    { title: "Investors", label: "Industrial Investment Partner", image: media.investor3, href: "/investors" },
  ],
  service: [
    { title: "Service Guarantee", label: "Owner Service", image: media.service1, href: "/serve" },
    { title: "Charging Energy", label: "Charging and Energy Service", image: media.chargingHero, href: "/contact/charging" },
    { title: "Finance Test", label: "Purchase and Finance Service", image: media.financeHero, href: "/contact/finance" },
  ],
  contact: [
    { title: "Dealers", label: "Global Dealer Network", image: media.dealer1, href: "/contact/dealers" },
    { title: "Store Query", label: "Experience Center", image: media.dealer2, href: "/dealers" },
    { title: "Customer Service", label: "After-sales and Support", image: media.service2, href: "/customerService" },
  ],
  legal: [
    { title: "User Agreement", label: "Legal Terms", image: media.brand9, href: "/auth-agreement.html" },
    { title: "Privacy Policy", label: "Legal Terms", image: media.brand10, href: "/privacy.html" },
    { title: "After-sales Service Agreement", label: "Service Terms", image: media.guide1, href: "/afterservice-commitment.html" },
  ],
} satisfies Record<string, { title: string; label: string; image: string; href: string }[]>;

export type MenuPanelKey = keyof typeof menuPanels;

export type MenuLinkItem = { label: string; href: string; spaced?: boolean };
export type MenuPanelItem = { label: string; panel: MenuPanelKey; spaced?: boolean };

export const menuItems: (MenuLinkItem | MenuPanelItem)[] = [
  { label: "Hydrofoil Boat", href: "/" },
  { label: "Product Series", panel: "products" },
  { label: "Hydrofoil Craft", href: "/products", spaced: true },
  { label: "Manufacturing Process", panel: "manufacturing" },
  { label: "Core Introduction", panel: "core" },
  { label: "Investors", href: "/investors", spaced: true },
  { label: "Introduction", panel: "introduction" },
  { label: "About Us", href: "/contact", spaced: true },
  { label: "Service Introduction", panel: "service" },
  { label: "Contact Us", panel: "contact" },
  { label: "Legal Terms", panel: "legal" },
];
