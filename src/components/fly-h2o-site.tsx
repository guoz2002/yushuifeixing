/* eslint-disable @next/next/no-img-element */
"use client";

import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { Center, Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { I18nProvider, localeOptions, useI18n, type Locale } from "@/i18n";
import {
  BatteryCharging,
  CalendarDays,
  ChevronRight,
  CreditCard,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Menu,
  Package,
  ShieldCheck,
  SlidersHorizontal,
  ShoppingBag,
  Users,
  Waves,
  X,
} from "lucide-react";

const A = "/fly-h2o-official-assets";
const O = "https://oss.fly-h2o.cn";
const dracoDecoder = "/draco/";
const dragClickThreshold = 14;

const media = {
  heroVideo: `${O}/20260416/video-1_1776316264376.mp4`,
  heroTitle: `${O}/20260416/icon-5_1776316217321.png`,
  showVideo: `${O}/20260416/video-1-1_1776316303115.mp4`,
  cityVideo: `${A}/video/2-4_compressed-BcENpFZu.mp4`,
  detailVideo: `${A}/video/video-8-1-Byl5yOJ_.mp4`,
  steeringVideo: `${A}/video/Streering_Wheel_CN2-DGfd0mx7.mp4`,
  steeringImage: `${A}/img/Streering_Wheel_CN-CfLKcyIg.png`,
  steeringHomeVideo: `${O}/20260416/video-18_1776316344879.mp4`,
  galleryVideo: `${A}/video/video1-CYUhbQt2.mp4`,
  productY3: `${A}/img/home-1-min-MsnRtAf0.png`,
  productY5: `${O}/20260402/%E4%BA%A7%E5%93%81%E5%9B%BE-%E8%B0%83%E6%95%B4%E5%90%8E_1775116758993.png`,
  modelHeroY3: `${O}/20260416/video-1_1776316264376.mp4`,
  modelHeroY5: `/fly-h2o-assets/video/video4-D5ZbAae6.mp4`,
  modelWind: `/fly-h2o-assets/video/video-6-AtzAgeQ_.mp4`,
  modelGalleryVideo1: `/fly-h2o-assets/video/video-8-Bb23Zg5n.mp4`,
  modelGalleryVideo2: `/fly-h2o-assets/video/video-9-DmbFQGAn.mp4`,
  modelGalleryVideo3: `/fly-h2o-assets/video/video-15-DcPpPQBk.mp4`,
  modelGalleryVideo4: `/fly-h2o-assets/video/video-16-BjZGx8eO.mp4`,
  modelFx: `/fly-h2o-assets/video/fx2-_gVVP_0A.mp4`,
  modelDetail1: `/fly-h2o-assets/img/home-14-CND4eG8p.png`,
  modelDetail2: `/fly-h2o-assets/img/home-16-CbRBFIkA.jpeg`,
  modelDetail3: `/fly-h2o-assets/img/home-17-DPKq4dg8.jpeg`,
  modelDetail4: `/fly-h2o-assets/img/home-19-CHGE51nU.png`,
  modelTech: `/fly-h2o-assets/img/home-22-D7wNgnzW.jpg`,
  modelColor1: `/fly-h2o-assets/img/color-1-2-BQB6vVqC.jpg`,
  modelColor2: `/fly-h2o-assets/img/color-2-2-C-mgED4P.jpg`,
  modelColor3: `/fly-h2o-assets/img/color-3-2-Cn7Ze_Dr.jpg`,
  modelColor4: `/fly-h2o-assets/img/color-4-2-CYnH8ylk.jpg`,
  modelColor5: `/fly-h2o-assets/img/color-5-2-CqDHJS_c.jpg`,
  modelColorVideo1: `/fly-h2o-assets/video/color-1-BhR7XKs6.mp4`,
  modelColorVideo2: `/fly-h2o-assets/video/color-2-DrA8Is9L.mp4`,
  modelColorVideo3: `/fly-h2o-assets/video/color-3-BBzJIa-R.mp4`,
  modelColorVideo4: `/fly-h2o-assets/video/color-4-D15prm-W.mp4`,
  modelColorVideo5: `/fly-h2o-assets/video/color-5-D_rmAOOX.mp4`,
  hydrofoilStore: `${A}/img/home-1-UxQgHjXv.png`,
  hmiStore: `${A}/img/driver_wheel-DKI-LnCU.png`,
  designStore: `${A}/img/pd1-CGn_fQpt.png`,
  hullBuild: `${A}/img/pd1.2-Dnloddzr.png`,
  accessoryStore: `${O}/20260324/driver_wheel_1774281733841.png`,
  developmentStore: `${A}/img/home-6-BW98mbEk.png`,
  distributionStore: `${A}/img/%E6%97%97%E8%88%B0%E5%B7%A5%E5%8E%82%E5%BA%97-p4n_Q3j_.jpg`,
  accessory1: `${A}/img/red-BrELFyf9.png`,
  accessory2: `${A}/img/blue-BozKTT79.png`,
  accessory3: `${A}/img/yellow_car-saCRJeZp.png`,
  team1: `${A}/img/investors-2-Ch_xVfwQ.png`,
  team2: `${A}/img/investors-4-CMCb3uZW.png`,
  dealer1: `${A}/img/contact-6-CB56dRgK.jpg`,
  dealer2: `${A}/img/contact-7-ChG6M_ol.jpg`,
  dealer3: `${A}/img/contact-9-6T9Zuw-K.jpg`,
  financeHero: `${A}/img/contact-12-4aAXiGhN.png`,
  chargingHero: `${A}/img/contact-10-DwGLPb8Z.png`,
  y3Menu: `${O}/20260324/color-1-2_1774283129973.jpg`,
  y5Menu: `${A}/img/menu-6-zzGB0FEO.jpg`,
  color1: `${O}/20260324/color-1-2_1774283129973.jpg`,
  color2: `${O}/20260324/color-2-2_1774283231044.jpg`,
  color3: `${O}/20260324/color-3-2_1774283334838.jpg`,
  color4: `${O}/20260324/color-4-2_1774283183479.jpg`,
  color5: `${O}/20260324/color-5-2_1774283282643.jpg`,
  range1: `${A}/img/home-range-1-DKns9lk-.jpg`,
  range1b: `${A}/img/home-range-1-2-CWZ6yE4I.jpg`,
  range2: `${A}/img/home-range-2-DVwcIPyb.jpg`,
  range2b: `${A}/img/home-range-2-2-DkJnK2e7.jpg`,
  range3: `${A}/img/home-range-3-DIL_vbSj.JPG`,
  range4: `${A}/img/home-range-4-2-Lk8Mr61v.jpg`,
  range4b: `${A}/img/home-range-4-BmbaWEFC.jpg`,
  range5: `${O}/20260416/home-range-5_1776339817528.jpg`,
  range5b: `${O}/20260416/home-range-5-2_1776339835365.jpg`,
  gallery1: `${A}/img/img-1-2-nMoe9_-L.png`,
  gallery1Detail: `${A}/img/img-1-1-CJq6yH8v.png`,
  gallery2: `${A}/img/img-2-B8QLstkt.png`,
  gallery2Detail: `${A}/img/img-2-1-Dn4KCXV4.png`,
  gallery3: `${A}/img/img-3-2-CRk_ypsc.png`,
  gallery3Detail: `${A}/img/img-3-1-CZ9ZdyoI.png`,
  gallery4: `${A}/img/img-4-2-B4MUsF68.png`,
  gallery4Detail: `${A}/img/img-4-1-DiAvy9Sn.png`,
  gallery6: `${A}/img/img-6-2-DALfZQ87.png`,
  app1: `${A}/img/img-1-1-CJq6yH8v.png`,
  app2: `${A}/img/img-2-1-Dn4KCXV4.png`,
  app3: `${A}/img/img-4-2-B4MUsF68.png`,
  app4: `${A}/img/img-5-IT9i4wr3.png`,
  app5: `${A}/img/img-7-D4RGmwZK.png`,
  factory: `${A}/img/factory-banner-DanwpLnk.jpg`,
  manufacture: `${A}/img/manufacturing-1-w2cctAvA.png`,
  battery3: `${A}/img/manufacturing-3-COSEhbHP.png`,
  battery4: `${A}/img/manufacturing-4-Tx4IomZl.png`,
  battery5: `${A}/img/manufacturing-5-B2H1DP0J.png`,
  battery6: `${A}/img/manufacturing-6-CaeQ41GI.png`,
  quality1: `${A}/img/quality-1-CXGMzDBU.png`,
  quality2: `${A}/img/quality-2-BkSzUUPJ.png`,
  quality3: `${A}/img/quality-3-CUdkT1Nu.png`,
  quality4: `${A}/img/quality-4-C3-6yC-H.png`,
  quality6: `${A}/img/quality-6-Bzi7iRnD.png`,
  brand: `${A}/img/brand-1-DaCR1NQO.png`,
  brand2: `${A}/img/brand-2-agCBLd9Q.png`,
  brand6: `${A}/img/brand-6-DHyv0LST.png`,
  brand9: `${A}/img/brand-9-B7MFiSmN.png`,
  brand10: `${A}/img/brand-10-DG_KrJsE.png`,
  carbon: `${A}/img/carbonFiber-1-CLgPLfJ1.png`,
  carbon5: `${A}/img/carbonFiber-5-DWkU_i_r.png`,
  unmanned3: `${A}/img/unmanned-3-CDz18UlR.png`,
  unmanned4: `${A}/img/unmanned-4-BeULDxo7.png`,
  unmanned8: `${A}/img/unmanned-8-DcyZ5gVo.png`,
  unmanned11: `${A}/img/unmanned-11-BECOelu1.png`,
  contact: `${A}/img/contact-1-Cv7nPYbB.jpg`,
  contact2: `${A}/img/contact-2-CRzEF7VU.jpg`,
  contact3: `${A}/img/contact-3-Bz4N4laA.jpg`,
  service1: `${A}/img/fuwujieshao_02_2-DY3vlJWM.jpg`,
  service2: `${A}/img/fuwujieshao_05_01-1-WJX6L1Z9.png`,
  guide1: `${A}/img/guide-1-CIn8RwyX.png`,
  guide2: `${A}/img/guide-2-Lrql3x89.png`,
  investor3: `${A}/img/investors-3-DYn_7eZd.png`,
  investor6: `${O}/20260324/investors-6_1774283377704.jpg`,
  cooperation: `${A}/img/copration-BqhAJkcD.jpg`,
  logo: `${A}/img/logo-D5s-fn5f.png`,
  modelY3: `/fly-h2o-oss/20260408/model_1775638905967.glb`,
  modelH1: `${A}/models/model_h1-Bc4HsqGF.glb`,
};

const routeTitles: Record<string, { label: string; title: string; kicker: string; kind: PageKind }> = {
  "/": { label: "ALAQUA", title: "POWERED BY SCIENCE. ELEVATED BY WATER.", kicker: "EXPLORE Y-3", kind: "home" },
  "/preview/:id": { label: "PREVIEW", title: "POWERED BY SCIENCE. ELEVATED BY WATER.", kicker: "EXPLORE Y-3", kind: "home" },
  "/2d": { label: "CUSTOM", title: "CONFIGURE YOUR HYDROFOIL.", kicker: "Y-3 COLOR STUDIO", kind: "product" },
  "/models": { label: "MODEL SERIES", title: "Y-3 AND Y-5 MODEL SERIES.", kicker: "HYDROFOIL", kind: "product" },
  "/models/h1": { label: "Y-3", title: "THREE-SEAT SMART HYDROFOIL.", kicker: "MODEL SERIES", kind: "model" },
  "/models/h2": { label: "Y-5", title: "FIVE-SEAT FLAGSHIP HYDROFOIL.", kicker: "MODEL SERIES", kind: "model" },
  "/options": { label: "OPTIONS", title: "COLOR, MATERIAL AND EQUIPMENT.", kicker: "CUSTOM", kind: "product" },
  "/options/detail": { label: "OPTIONS DETAIL", title: "Y-3 CONFIGURATION STUDIO.", kicker: "CUSTOM", kind: "product" },
  "/options/detail/:id": { label: "OPTIONS DETAIL", title: "Y-3 CONFIGURATION STUDIO.", kicker: "CUSTOM", kind: "product" },
  "/products": { label: "PRODUCTS", title: "HYDROFOIL PRODUCT MATRIX.", kicker: "Y SERIES", kind: "product" },
  "/store": { label: "STORE", title: "ALAQUA STORE EXPERIENCE.", kicker: "COMING ONLINE", kind: "store" },
  "/store/hydrofoil": { label: "HYDROFOIL", title: "BROWSE HYDROFOIL PRODUCTS.", kicker: "STORE", kind: "store" },
  "/store/hmi": { label: "HMI", title: "SHIPBOARD HMI.", kicker: "STORE", kind: "store" },
  "/store/design": { label: "DESIGN", title: "SHIP DESIGN.", kicker: "STORE", kind: "store" },
  "/store/design/HullDesignBuild": { label: "HULL DESIGN", title: "HULL DESIGN AND BUILD.", kicker: "STORE", kind: "store" },
  "/store/accessories": { label: "ACCESSORIES", title: "EQUIPMENT AND ACCESSORIES.", kicker: "STORE", kind: "store" },
  "/store/accessories/:id": { label: "ACCESSORY DETAIL", title: "ACCESSORY DETAIL.", kicker: "STORE", kind: "accessory" },
  "/store/development": { label: "SOFTWARE", title: "SOFTWARE DEVELOPMENT.", kicker: "STORE", kind: "store" },
  "/store/distribution": { label: "DISTRIBUTION", title: "DISTRIBUTION NETWORK.", kicker: "STORE", kind: "store" },
  "/manufacturing": { label: "CRAFTSMANSHIP", title: "MANUFACTURING PROCESS.", kicker: "FACTORY", kind: "craft" },
  "/manufacturing/quality": { label: "QUALITY", title: "PRECISION QUALITY CONTROL.", kicker: "CRAFTSMANSHIP", kind: "craft" },
  "/manufacturing/brand": { label: "BRAND", title: "THE BRAND BUILT ABOVE WATER.", kicker: "ALAQUA", kind: "brand" },
  "/manufacturing/carbonFiber": { label: "CARBON FIBER", title: "LIGHTWEIGHT COMPOSITE STRUCTURE.", kicker: "MATERIAL", kind: "craft" },
  "/manufacturing/unmanned": { label: "UNMANNED", title: "AUTONOMOUS WATER PLATFORM.", kicker: "TECHNOLOGY", kind: "tech" },
  "/manufacturing/threeModes": { label: "THREE MODES", title: "ADAPTIVE RIDING MODES.", kicker: "CONTROL", kind: "tech" },
  "/manufacturing/battery": { label: "BATTERY", title: "HIGH VOLTAGE ENERGY SYSTEM.", kicker: "POWER", kind: "tech" },
  "/manufacturing/outboard-motor": { label: "OUTBOARD MOTOR", title: "ELECTRIC PROPULSION SYSTEM.", kicker: "POWER", kind: "tech" },
  "/manufacturing/carbon-fiber-material": { label: "CARBON MATERIAL", title: "CARBON FIBER MATERIALS.", kicker: "MATERIAL", kind: "craft" },
  "/tech": { label: "TECH", title: "HYDROFOIL CONTROL ARCHITECTURE.", kicker: "INNOVATION", kind: "tech" },
  "/tech/advantages": { label: "ADVANTAGES", title: "STABILITY, RANGE AND SPEED.", kicker: "TECH", kind: "tech" },
  "/tech/scenario": { label: "SCENARIO", title: "URBAN WATER AND RESORT SCENARIOS.", kicker: "USE CASES", kind: "scenario" },
  "/features": { label: "FEATURES", title: "INTELLIGENT WATER MOBILITY.", kicker: "PRODUCT", kind: "tech" },
  "/investors": { label: "INVESTORS", title: "INDUSTRIAL CAPITAL AND GROWTH.", kicker: "INTRODUCTION", kind: "investor" },
  "/team": { label: "TEAM", title: "ENGINEERING, DESIGN AND OPERATIONS.", kicker: "TEAM", kind: "team" },
  "/test-drive": { label: "TEST DRIVE", title: "BOOK YOUR WATER EXPERIENCE.", kicker: "BOOK EXPERIENCE", kind: "testDrive" },
  "/contact": { label: "CONTACT US", title: "CONNECT WITH ALAQUA.", kicker: "BUSINESS", kind: "contact" },
  "/contact/charging": { label: "CHARGING", title: "CHARGING AND ENERGY SERVICE.", kicker: "SERVICE", kind: "contact" },
  "/contact/finance": { label: "FINANCE", title: "PURCHASE AND FINANCE SERVICE.", kicker: "SERVICE", kind: "contact" },
  "/contact/serve": { label: "SERVICE", title: "SERVICE GUARANTEE.", kicker: "SUPPORT", kind: "contact" },
  "/contact/dealers": { label: "DEALERS", title: "GLOBAL DEALER NETWORK.", kicker: "NETWORK", kind: "dealer" },
  "/contact/dealers/:id": { label: "DEALER DETAIL", title: "DEALER EXPERIENCE CENTER.", kicker: "NETWORK", kind: "dealer" },
  "/contact/customerService": { label: "CUSTOMER SERVICE", title: "SUPPORT AND HELP.", kicker: "SUPPORT", kind: "contact" },
  "/contact/customerService/:id": { label: "SERVICE DETAIL", title: "SERVICE DETAIL.", kicker: "SUPPORT", kind: "contact" },
  "/serve": { label: "SERVICES", title: "OWNER AND OPERATION SERVICE.", kicker: "SERVICE", kind: "contact" },
  "/dealers": { label: "DEALERS", title: "GLOBAL DEALER NETWORK.", kicker: "NETWORK", kind: "dealer" },
  "/dealers/:id": { label: "DEALER DETAIL", title: "DEALER EXPERIENCE CENTER.", kicker: "NETWORK", kind: "dealer" },
  "/customerService": { label: "CUSTOMER SERVICE", title: "AFTER-SALES AND SUPPORT.", kicker: "SUPPORT", kind: "contact" },
  "/customerService/:id": { label: "SERVICE DETAIL", title: "SERVICE DETAIL.", kicker: "SUPPORT", kind: "contact" },
  "/help-center": { label: "HELP CENTER", title: "ACCOUNT AND SERVICE HELP.", kicker: "SUPPORT", kind: "support" },
  "/help-center/account-appeal": { label: "ACCOUNT APPEAL", title: "ACCOUNT RECOVERY.", kicker: "SUPPORT", kind: "helpFlow" },
  "/help-center/delete-account": { label: "DELETE ACCOUNT", title: "ACCOUNT DELETION REQUEST.", kicker: "SUPPORT", kind: "helpFlow" },
  "/help-center/freeze-account": { label: "FREEZE ACCOUNT", title: "TEMPORARILY FREEZE ACCOUNT.", kicker: "SUPPORT", kind: "helpFlow" },
  "/help-center/reset-password": { label: "RESET PASSWORD", title: "RECOVER YOUR PASSWORD.", kicker: "SUPPORT", kind: "helpFlow" },
  "/help-center/unblock-account": { label: "UNBLOCK ACCOUNT", title: "REQUEST ACCOUNT UNBLOCK.", kicker: "SUPPORT", kind: "helpFlow" },
  "/help-center/unfreeze-account": { label: "UNFREEZE ACCOUNT", title: "RESTORE ACCOUNT ACCESS.", kicker: "SUPPORT", kind: "helpFlow" },
  "/about-me": { label: "SUPPORT", title: "OWNER SUPPORT SURFACE.", kicker: "SERVICE", kind: "support" },
  "/company-intro": { label: "COMPANY", title: "ABOUT FLY H2O.", kicker: "ABOUT US", kind: "company" },
  "/factory": { label: "FACTORY", title: "ZHUHAI INTELLIGENT MANUFACTURING BASE.", kicker: "FACTORY", kind: "craft" },
  "/profile": { label: "MY ACCOUNT", title: "LOCAL ACCOUNT CENTER.", kicker: "ACCOUNT", kind: "account" },
  "/login": { label: "SIGN IN", title: "ALAQUA ACCOUNT SIGN IN.", kicker: "LOCAL DEMO", kind: "auth" },
  "/auth/wechat": { label: "WECHAT AUTH", title: "AUTHORIZATION CALLBACK.", kicker: "LOCAL DEMO", kind: "auth" },
  "/auth/google": { label: "GOOGLE AUTH", title: "AUTHORIZATION CALLBACK.", kicker: "LOCAL DEMO", kind: "auth" },
  "/auth/line": { label: "LINE AUTH", title: "AUTHORIZATION CALLBACK.", kicker: "LOCAL DEMO", kind: "auth" },
  "/auth/linkedin": { label: "LINKEDIN AUTH", title: "AUTHORIZATION CALLBACK.", kicker: "LOCAL DEMO", kind: "auth" },
  "/auth/twitter": { label: "TWITTER AUTH", title: "AUTHORIZATION CALLBACK.", kicker: "LOCAL DEMO", kind: "auth" },
  "/auth/alipay": { label: "ALIPAY AUTH", title: "AUTHORIZATION CALLBACK.", kicker: "LOCAL DEMO", kind: "auth" },
  "/auth/bind": { label: "BIND ACCOUNT", title: "BIND ACCOUNT.", kicker: "LOCAL DEMO", kind: "auth" },
  "/orders/:orderId": { label: "ORDER DETAIL", title: "ORDER DETAIL.", kicker: "LOCAL DEMO", kind: "order" },
  "/order-confirmation/:orderId": { label: "ORDER CONFIRMATION", title: "ORDER CONFIRMATION.", kicker: "LOCAL DEMO", kind: "order" },
};

type PageKind =
  | "home"
  | "product"
  | "model"
  | "store"
  | "craft"
  | "brand"
  | "tech"
  | "scenario"
  | "investor"
  | "team"
  | "contact"
  | "company"
  | "support"
  | "testDrive"
  | "dealer"
  | "accessory"
  | "helpFlow"
  | "auth"
  | "account"
  | "order";

const menuGroups = [
  {
    title: "HYDROFOIL",
    items: [
      ["Products", "/products"],
      ["Model Series", "/models"],
      ["Y-3 Configurator", "/2d"],
      ["Options", "/options"],
    ],
  },
  {
    title: "STORE",
    items: [
      ["Hydrofoil", "/store/hydrofoil"],
      ["HMI", "/store/hmi"],
      ["Design", "/store/design"],
      ["Accessories", "/store/accessories"],
      ["Development", "/store/development"],
      ["Distribution", "/store/distribution"],
    ],
  },
  {
    title: "CRAFTSMANSHIP",
    items: [
      ["Manufacturing Process", "/manufacturing"],
      ["Core Introduction", "/manufacturing/carbonFiber"],
      ["Technology", "/tech/advantages"],
    ],
  },
  {
    title: "SERVICE",
    items: [
      ["Test Drive", "/test-drive"],
      ["Dealers", "/contact/dealers"],
      ["Charging", "/contact/charging"],
      ["Finance", "/contact/finance"],
    ],
  },
  {
    title: "ABOUT US",
    items: [
      ["Investors", "/investors"],
      ["Team", "/team"],
      ["Company", "/company-intro"],
      ["Services", "/serve"],
      ["Contact Us", "/contact"],
      ["Legal Terms", "/help-center"],
    ],
  },
];

const productCards = [
  { title: "Y-3", label: "Three-Seat Version", image: media.productY3, href: "/models/h1" },
  { title: "Y-5", label: "Five-Seat Version", image: media.productY5, href: "/models/h2" },
];

const storeFeatures = [
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

const accessoryItems = [
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

const dealerItems = [
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

const modelSpecs = [
  ["MAX SPEED", "20 kn"],
  ["RANGE", "80+ km"],
  ["SEATS", "3 / 5"],
  ["MATERIAL", "Carbon Fiber"],
];

const craftImages = [media.factory, media.manufacture, media.carbon, media.brand];

const rangeCards = [
  { title: "Resort Route", text: "Short-distance premium water movement for waterfront resorts.", image: media.range1, href: "/tech/scenario" },
  { title: "City Waterfront", text: "Quiet electric hydrofoil movement through urban water.", image: media.range2, href: "/tech/scenario" },
  { title: "Leisure Cruise", text: "A floating cabin experience that stays close to the water.", image: media.range4, href: "/models/h2" },
  { title: "Test Ride", text: "Real operating scenes, splashes and long-range product proof.", image: media.range5, href: "/contact" },
];

const galleryCards = [
  { title: "Smart Cockpit", image: media.app1 },
  { title: "Energy Screen", image: media.app2 },
  { title: "Owner App", image: media.app3 },
  { title: "Trip Status", image: media.app4 },
  { title: "Water Map", image: media.app5 },
];

const modelSequenceFrames = [
  "/fly-h2o-assets/img/Y-3hongse5.0000-BfPYcBjM.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0001-B_pOvHOj.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0002-BFP7apfq.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0003-D7-CFCUZ.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0004-DsIss1MY.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0005-CWTaIta1.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0006-ChsntFQk.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0007-DgYxFiXb.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0008-DZvwibHF.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0009-CLFPb5HZ.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0010-B13fxtUA.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0011-DR8sS-CE.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0012-iRF7xoOc.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0013-oczIVFum.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0014-BNWVSveD.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0015-4caGzhHL.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0016-BBCwq0sM.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0017-COTB8zRd.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0018-PobCIaqc.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0019-HVyBy-Q0.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0020-CgfZ48UT.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0021-Cg6PC7dC.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0022-cTtuJa7Y.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0023-BOucQIIr.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0024-DkO3gbm5.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0025-BmUqQ91e.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0026-DQd3sRk9.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0027-h6j-lYtq.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0028-DAALQb32.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0029-lTdHU-fF.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0030-DkrgG19R.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0031-CAT2x9lx.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0032-B4IYddGN.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0033-D58FruDS.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0034-Cnayu-3t.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0035-dtcu6_C6.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0036-CvsZm4-T.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0037-BEzvzNax.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0038-DR97N-JB.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0039-D2TXrWS1.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0040-mpSUHlLQ.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0041-Bx6DjWkJ.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0042-tL3U7A5d.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0043-DZElCUo7.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0044-CnugEg2x.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0045-D3aZfxEB.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0046-BkyAwB67.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0047-Vk1u4mis.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0048-B23TRuNF.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0049-BW8LaScs.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0050-Dhv_zyem.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0051-CCTHmnN9.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0052-P0-aybEi.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0053-C8fmORmk.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0054-QD8vQJaE.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0055-rVtwKwW0.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0056-DwLX1l_s.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0057-NiuQhHII.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0058--eT3JjeI.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0059-DKcUBZyE.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0060-Bigg4ugL.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0061-BRtKDPNa.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0062-CqzmFwpq.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0063-N4-XkUfu.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0064-8H2Qv_oq.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0065-DszSjvNw.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0066-7RFJfAYu.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0067-CilVyxro.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0068-Bvh343Qt.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0069-0iEwHDyN.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0070-BSzKqIfk.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0071-Wkdbatzl.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0072-h6KMfuf6.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0073-BtoYcUBM.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0074-BcilzLub.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0075-DTiQBf5n.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0076-UTNFXUdL.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0077-C5pEnCtT.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0078-CMPo2XGY.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0079-CJ288pmO.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0080-BFjVu5GH.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0081-Ypd_Iqhd.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0082-Lf8u5-eP.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0083-t8MSn_vy.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0084-B7XMpfvs.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0085-CFgCZaUA.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0086-DswU5GgD.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0087-D5T5RuxE.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0088-BoOMYBtr.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0089-B61kaMTU.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0090-CC7wlj36.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0091-DubUtgoU.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0092-DIEBj1vH.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0093-B-FQXlWO.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0094-DBAS-j2O.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0095-CnAk1sGr.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0096-Dep77rlo.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0097-B1qJUXKm.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0098-DGrQsSno.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0099-xIu_LZBk.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0100-BjULGCFx.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0101-gcNmdaHm.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0102-RqSjvDdL.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0103-DLClnuIs.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0104-DhNU-vFc.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0105-B1f5Xv-w.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0106-ilEGLvkL.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0107-Ds7WsY8l.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0108-RtnExtah.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0109-1x1SvQsM.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0110-DdWKRjRW.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0111-CYVy88nP.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0112-BOF5kZ56.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0113-0BmveB86.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0114-C6ZbQjTN.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0115-l7cZ8grq.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0116-Cz45zKDO.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0117-CPr_va0E.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0118-DszeVXqN.jpeg",
  "/fly-h2o-assets/img/Y-3hongse5.0119-DBQzx6vV.jpeg",
];

const modelColorStories = [
  {
    name: "烈焰红",
    description: "灵感源自炽热火焰的耀眼光芒，象征着热情与力量，展现勇往直前的澎湃气势。",
    color: "#e02925",
    image: media.modelColor1,
    video: media.modelColorVideo1,
  },
  {
    name: "钛金属色",
    description: "取自航空钛合金的独特光泽，展现科技与工艺的结合，彰显现代工业美学。",
    color: "#ababab",
    image: media.modelColor2,
    video: media.modelColorVideo2,
  },
  {
    name: "深海蓝",
    description: "取自深海的神秘蓝色，如夜空中的繁星倒影，呈现深邃与宁静的高级质感。",
    color: "#0088ff",
    image: media.modelColor3,
    video: media.modelColorVideo3,
  },
  {
    name: "宝石绿",
    description: "来自翡翠宝石的深邃绿色，像森林深处的生命力，散发自然与奢华的融合。",
    color: "#afc873",
    image: media.modelColor4,
    video: media.modelColorVideo4,
  },
  {
    name: "熔岩橙",
    description: "源自火山熔岩的炽热光芒，象征激情与活力，表现无畏前行的动感精神。",
    color: "#ffd245",
    image: media.modelColor5,
    video: media.modelColorVideo5,
  },
];

const modelPageCopy = {
  h1: {
    series: "Y-3 三座版",
    heroVideo: media.modelHeroY3,
    sequenceLines: [
      "Y-3 智能水翼艇是一款集智能科技、",
      "舒适体验与高效性能于一体的水上交通工具。",
      "采用先进的水翼设计，",
      "有效降低航行阻力，提升航速与稳定性，",
      "适合家庭出游、休闲娱乐及短途运输。",
    ],
    aestheticsTitle: "船体美学",
    aestheticsText:
      "全球首款面向水上交通与文旅场景的智能电动水翼艇，以高性能与低能耗重构水上出行方式。",
    windTitle: "破浪而行",
    windText: "水翼技术通过平衡流体与空气的动力学特性，降低航行阻力，提升航行效率。",
    specs: [
      ["主尺度", [["总长度", "4.5 m"], ["总宽度", "3.0 m"], ["吃水深度", "1.0 m"], ["乘员人数", "3"]]],
      ["充电", [["充电方式", "配备专用充电桩"], ["充电桩", "380V 60A"], ["充电时间", "1.5 h"], ["充电功率", "≤20 kW"]]],
      ["动力、速度和续航里程", [["巡航速度", "15/30 kt"], ["最高速度", "18/33 kt"], ["续航时间", "2.5 h"], ["推进功率", "20 kW / 40 kW"]]],
    ],
  },
  h2: {
    series: "Y-5 五座版",
    heroVideo: media.modelHeroY5,
    sequenceLines: [
      "更大空间，同样凌厉。",
      "Y-5 以五座布局重新定义水翼艇的边界，",
      "全新升级的外观设计，",
      "将高性能与舒适体验完美融合，",
      "开启属于你的御水飞行。",
    ],
    aestheticsTitle: "五座旗舰，美学新章",
    aestheticsText:
      "Y-5 以全新设计语言重塑水翼艇的视觉边界。流线型船身承载五人舒适空间，呈现水上座驾的旗舰风范。",
    windTitle: "驭浪前行，不止于速",
    windText: "即便承载五人，Y-5 依然以水翼技术实现船体脱水飞行，大幅降低航行阻力。",
    specs: [
      ["主尺度", [["总长度", "4.9 m"], ["总宽度", "3.4 m"], ["吃水深度", "1.2 m"], ["乘员人数", "5"]]],
      ["充电", [["充电方式", "配备专用充电桩"], ["充电桩", "380V 60A"], ["充电时间", "1.5 h"], ["充电功率", "≤20 kW"]]],
      ["动力、速度和续航里程", [["巡航速度", "15/30 kt"], ["最高速度", "18/33 kt"], ["续航时间", "2.5 h"], ["推进功率", "20 kW / 40 kW"]]],
    ],
  },
} as const;

const modelDetailCards = [
  ["流光速影", "极致流线型船身，划破水面如光掠影。", media.modelDetail1],
  ["一体式翼架结构", "航空级碳纤维骨架，轻量化与高强度的平衡。", media.modelDetail4],
  ["沉浸式驾舱", "环抱式座舱设计，让驾驶姿态和信息视线自然合一。", media.modelDetail2],
  ["智能矩阵灯组", "贯穿式 LED 光带，点亮水上新风尚。", media.modelDetail3],
] as const;

const modelGalleryItems = [
  { type: "video", src: media.modelGalleryVideo3 },
  { type: "video", src: media.modelFx, brand: true },
  { type: "video", src: media.modelGalleryVideo4 },
  { type: "image", src: media.modelDetail1 },
  { type: "image", src: media.modelDetail4 },
  { type: "image", src: media.modelDetail2, brand: true },
  { type: "video", src: media.modelGalleryVideo1 },
  { type: "video", src: media.modelGalleryVideo2 },
] as const;

const homeRangeItems = [
  {
    title: "Shenzhen · Dameisha Real Shot",
    text: "Real shot recording of the hydrofoil lifting and running nearshore under real sea conditions.",
    image: media.range3,
  },
  {
    title: "Shenzhen · Dasha River Real Shot",
    text: "Urban inland waterway footage showing controllability and a stable running posture.",
    image: media.range4,
  },
  {
    title: "Shenzhen · Dasha River Multi-Angle",
    text: "Side tracking and multi-angle views capture the product details in motion.",
    image: media.range4b,
  },
  {
    title: "Dongguan · Songshan Lake",
    text: "Aerial views show the lift-up navigation attitude over calm lake water.",
    image: media.range2,
  },
  {
    title: "Zhuhai · Pearl River Estuary",
    text: "Field testing in complex water validates stability, endurance and seaworthiness.",
    image: media.range1,
  },
];

const homeGalleryItems = [
  { type: "image", image: media.gallery1, detail: media.gallery1Detail },
  { type: "image", image: media.gallery2, detail: media.gallery2Detail },
  { type: "image", image: media.gallery3, detail: media.gallery3Detail },
  { type: "video", image: media.galleryVideo },
  { type: "image", image: media.gallery4, detail: media.gallery4Detail },
  { type: "image", image: media.app5 },
  { type: "image", image: media.gallery6 },
  { type: "image", image: media.app4 },
] as const;

const detailPages: Record<
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

function normalizedPath(pathname: string | null, slug?: string[]) {
  if (slug?.length) return `/${slug.join("/")}`;
  const path = pathname || "/";
  return path === "" ? "/" : path;
}

function routeKeyForPath(path: string) {
  const segments = path.split("/").filter(Boolean);

  if (segments[0] === "preview" && segments[1]) return "/preview/:id";
  if (segments[0] === "options" && segments[1] === "detail" && segments[2]) return "/options/detail/:id";
  if (segments[0] === "store" && segments[1] === "accessories" && segments[2]) return "/store/accessories/:id";
  if (segments[0] === "store" && segments[1] === "design" && segments[2]?.toLowerCase() === "hulldesignbuild") {
    return "/store/design/HullDesignBuild";
  }
  if (segments[0] === "contact" && segments[1] === "dealers" && segments[2]) return "/contact/dealers/:id";
  if (segments[0] === "dealers" && segments[1]) return "/dealers/:id";
  if (segments[0] === "contact" && segments[1] === "customerService" && segments[2]) return "/contact/customerService/:id";
  if (segments[0] === "customerService" && segments[1]) return "/customerService/:id";
  if (segments[0] === "orders" && segments[1]) return "/orders/:orderId";
  if (segments[0] === "order-confirmation" && segments[1]) return "/order-confirmation/:orderId";

  return path;
}

function pathParam(path: string) {
  const value = path.split("/").filter(Boolean).at(-1) || "";
  return decodeURIComponent(value);
}

function detailKeyForPath(path: string) {
  if (path === "/contact/serve") return "/serve";
  if (path === "/contact/customerService") return "/customerService";
  return path;
}

function useDragScroll<T extends HTMLElement>(ref: RefObject<T | null>) {
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const blockClickRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  function onPointerDown(event: ReactPointerEvent<T>) {
    if (event.button !== 0) return;
    const element = ref.current;
    if (!element) return;

    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    };
    element.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<T>) {
    const element = ref.current;
    const drag = dragRef.current;
    if (!element || !drag.active) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > dragClickThreshold || Math.abs(dy) > dragClickThreshold) {
      drag.moved = true;
      blockClickRef.current = true;
      setDragging(true);
    }

    element.scrollLeft = drag.scrollLeft - dx;
    element.scrollTop = drag.scrollTop - dy;
    if (drag.moved) event.preventDefault();
  }

  function finishDrag(event: ReactPointerEvent<T>) {
    const element = ref.current;
    const moved = dragRef.current.moved;
    if (element?.hasPointerCapture?.(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
    dragRef.current.active = false;
    setDragging(false);
    if (moved) {
      window.setTimeout(() => {
        blockClickRef.current = false;
      }, 120);
    }
  }

  function onClickCapture(event: ReactMouseEvent<T>) {
    if (!blockClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    blockClickRef.current = false;
  }

  return {
    dragging,
    dragProps: {
      onClickCapture,
      onPointerCancel: finishDrag,
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onLostPointerCapture: finishDrag,
    },
  };
}

function ModelObject({ src, variant }: { src: string; variant: "y3" | "h1" }) {
  const { scene } = useGLTF(src, dracoDecoder);
  const cloned = useMemo(() => scene.clone(), [scene]);
  const scale = variant === "h1" ? 0.34 : 0.00095;

  return (
    <group rotation={[-0.12, -0.72, 0]} scale={scale} position={[0, -0.42, 0]}>
      <Center>
        <primitive object={cloned} />
      </Center>
    </group>
  );
}

function ModelStage({ variant = "y3" }: { variant?: "y3" | "h1" }) {
  const { t } = useI18n();
  const src = variant === "h1" ? media.modelH1 : media.modelY3;
  const poster = variant === "h1" ? media.y5Menu : media.y3Menu;

  return (
    <div className="modelStage" style={{ "--model-poster": `url(${poster})` } as CSSProperties} aria-label={t("3D hydrofoil model preview")}>
      <Canvas
        camera={{ position: [0, 0.55, 7.6], fov: 38 }}
        dpr={[1, 1.75]}
        fallback={<img className="modelFallback" src={poster} alt="" />}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={1.25} />
        <directionalLight position={[4, 4, 5]} intensity={3.2} color="#ffffff" />
        <directionalLight position={[-4, 1.5, -3]} intensity={1.4} color="#00fff7" />
        <Suspense
          fallback={
            <Html center>
              <span className="modelLoading">{t("LOADING")}</span>
            </Html>
          }
        >
          <ModelObject src={src} variant={variant} />
          <Environment files={`${A}/t_env_light-r6ZBsESp.hdr`} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.55} />
      </Canvas>
    </div>
  );
}

function TopNav({ onMenu }: { onMenu: () => void }) {
  const { t } = useI18n();

  return (
    <header className="topNav">
      <button className="navMenuButton" onClick={onMenu} type="button" aria-label={t("Open menu")}>
        <Menu size={24} strokeWidth={1.6} />
        <span>{t("MENU")}</span>
      </button>
      <Link className="brandMark" href="/">
        ALAQUA
      </Link>
      <div className="navRight">
        <Link href="/store">{t("STORE")}</Link>
        <Link href="/contact">{t("CONTACT")}</Link>
      </div>
    </header>
  );
}

function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale, setLocale, t } = useI18n();
  const railRef = useRef<HTMLElement | null>(null);
  const productsRef = useRef<HTMLDivElement | null>(null);
  const { dragging: railDragging, dragProps: railDragProps } = useDragScroll<HTMLElement>(railRef);
  const { dragging: productsDragging, dragProps: productsDragProps } = useDragScroll<HTMLDivElement>(productsRef);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className={`siteMenu ${open ? "isOpen" : ""}`} aria-hidden={!open}>
      <button className="menuClose" onClick={onClose} type="button" aria-label={t("Close menu")}>
        <X size={26} strokeWidth={1.4} />
      </button>
      <aside className={`menuRail ${railDragging ? "isDragging" : ""}`} ref={railRef} {...railDragProps}>
        {menuGroups.map((group) => (
          <div className="menuGroup" key={group.title}>
            <h2>{t(group.title)}</h2>
            {group.items.map(([label, href]) => (
              <a href={href} key={href} onClick={onClose}>
                {t(label)}
                <ChevronRight size={14} strokeWidth={1.4} />
              </a>
            ))}
          </div>
        ))}
        <div className="languageRow">
          {localeOptions.map((option) => (
            <button
              aria-pressed={locale === option.value}
              className={locale === option.value ? "active" : ""}
              key={option.value}
              onClick={() => setLocale(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </aside>
      <div className={`menuProducts ${productsDragging ? "isDragging" : ""}`} ref={productsRef} {...productsDragProps}>
        {productCards.map((card) => (
          <a href={card.href} className="menuProductCard" key={card.title} onClick={onClose}>
            <img src={card.image} alt={card.title} />
            <span className="menuProductLabel">{t(card.label)}</span>
            <strong>{card.title}</strong>
          </a>
        ))}
      </div>
    </div>
  );
}

function Hero({ page }: { page: (typeof routeTitles)[string] }) {
  const { t } = useI18n();

  return (
    <section className="heroSection">
      <video className="heroVideo" src={media.heroVideo} autoPlay muted loop playsInline poster={media.y3Menu} />
      <div className="heroShade" />
      <div className="heroCenter">
        <h1>Alaqua</h1>
        <p>{t(page.title)}</p>
        <a href="#main-content">{t(page.kicker)}</a>
      </div>
      <div className="scrollNeedle" />
    </section>
  );
}

function HomeHero() {
  const { t } = useI18n();

  return (
    <section className="homeHero">
      <video className="homeHeroVideo" src={media.heroVideo} autoPlay muted loop playsInline poster={media.productY3} preload="metadata" />
      <div className="homeHeroContent">
        <img src={media.heroTitle} alt="Alaqua" />
        <p>{t("POWERED BY SCIENCE. ELEVATED BY WATER.")}</p>
        <Link href="/models/h1">{t("EXPLORE Y-3")}</Link>
      </div>
    </section>
  );
}

function HomeY5Banner() {
  const { t } = useI18n();

  return (
    <section className="homeVideoBanner" id="main-content">
      <div className="homeSectionBlend top" />
      <video src={media.showVideo} autoPlay muted loop playsInline preload="metadata" poster={media.y5Menu} />
      <div className="homeBannerCopy">
        <h2>{t("Y-5 FIVE-SEAT FLAGSHIP")}</h2>
        <p>{t("NEXT-GEN FLAGSHIP. LUXURY FLIGHT ON WATER.")}</p>
        <Link href="/models/h2">{t("DISCOVER THE ALL-NEW Y-5")}</Link>
      </div>
      <div className="homeSectionBlend bottom" />
    </section>
  );
}

function HomeSteering() {
  const { t } = useI18n();

  return (
    <section className="homeSteering">
      <div className="homeSteeringMedia">
        <video src={media.steeringHomeVideo} autoPlay muted loop playsInline preload="metadata" poster={media.steeringImage} />
      </div>
      <div className="homeSteeringCopy">
        <h2>{t("NAVIGATE THE FUTURE, STEER WITH INTELLIGENCE")}</h2>
        <p>
          {t(
            "The smart tri-mode steering wheel integrates critical controls and core data into a single interaction terminal, improving maneuverability and navigation safety for high-performance hydrofoil operation.",
          )}
        </p>
        <Link href="/manufacturing/threeModes">{t("LEARN MORE")}</Link>
      </div>
    </section>
  );
}

function HomeRangeSection() {
  const { t } = useI18n();

  return (
    <section className="homeRange">
      <div className="homeSectionTitle">
        <h2>{t("Real sailing footage")}</h2>
        <p>
          {t(
            "Filmed live in real waters, this documentary-style section shows range, seakeeping and stability from lift-off to high-speed cruising.",
          )}
        </p>
      </div>
      <div className="homeRangeTrack">
        {homeRangeItems.map((item) => (
          <article className="homeRangeCard" key={item.title}>
            <div>
              <img src={item.image} alt={item.title} loading="lazy" />
              <span aria-hidden="true">+</span>
            </div>
            <h3>{t(item.title)}</h3>
            <p>{t(item.text)}</p>
          </article>
        ))}
      </div>
      <div className="homeRangeDots" aria-hidden="true">
        {homeRangeItems.map((item, index) => (
          <span className={index === 0 ? "active" : ""} key={item.title} />
        ))}
      </div>
    </section>
  );
}

function HomeProductsSection() {
  const { t } = useI18n();

  return (
    <section className="homeProducts">
      <h2>{t("FLY-H2O HOME")}</h2>
      <div className="homeProductGrid">
        {productCards.map((card) => (
          <article className="homeProductCard" key={card.title}>
            <Link href={card.href}>
              <img src={card.image} alt={card.title} loading="lazy" />
            </Link>
            <h3>
              {card.title} <span>{t(card.label)}</span>
            </h3>
            {card.title !== "Y-5" ? (
              <Link className="homeTextLink" href={card.href}>
                {t("Learn More")}
              </Link>
            ) : (
              <span className="homeTextLink muted">{t("Coming Soon")}</span>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function HomeGallerySection() {
  const { t } = useI18n();

  return (
    <section className="homeGallery">
      <div className="homeGalleryTitle">
        <h2>{t("Hydrofoil Smart App")}</h2>
      </div>
      <div className="homeGalleryTrack">
        {homeGalleryItems.map((item, index) => (
          <article className="homeGalleryCard" key={`${item.type}-${index}`}>
            {item.type === "video" ? (
              <video src={item.image} autoPlay muted loop playsInline preload="metadata" />
            ) : (
              <img src={item.image} alt={`Hydrofoil gallery ${index + 1}`} loading="lazy" />
            )}
            <span aria-hidden="true">{item.type === "video" ? "PLAY" : "+"}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function HomeReplica() {
  return (
    <div className="officialHome">
      <HomeHero />
      <HomeY5Banner />
      <HomeSteering />
      <HomeRangeSection />
      <HomeProductsSection />
      <HomeGallerySection />
    </div>
  );
}

function FullBleedStory() {
  const { t } = useI18n();

  return (
    <section className="storyStack" id="main-content">
      <article className="mediaPanel">
        <video src={media.showVideo} autoPlay muted loop playsInline />
        <div>
          <span>01</span>
          <h2>{t("Powered by science.")}</h2>
          <p>{t("Black stage, red light, centered product, restrained text: the page lets motion and water technology carry the brand tone.")}</p>
        </div>
      </article>
      <article className="mediaPanel split">
        <video src={media.cityVideo} autoPlay muted loop playsInline />
        <div>
          <span>02</span>
          <h2>{t("Elevated by water.")}</h2>
          <p>{t("Real water scenes, top-view movement and long cinematic sections create a quiet product-led scroll rhythm.")}</p>
        </div>
      </article>
    </section>
  );
}

function RangeSection() {
  const { t } = useI18n();

  return (
    <section className="rangeSection">
      <div className="sectionHeader">
        <p>{t("RANGE OF USE")}</p>
        <h2>{t("Hydrofoil scenes built from real water.")}</h2>
        <span>{t("Resort routes, city waterfronts, leisure cruising and test rides share one quiet electric platform.")}</span>
      </div>
      <div className="rangeRail">
        {rangeCards.map((card, index) => (
          <Link className="rangeCard" href={card.href} key={card.title}>
            <img src={card.image} alt={card.title} />
            <div>
              <span>{`0${index + 1}`}</span>
              <h3>{t(card.title)}</h3>
              <p>{t(card.text)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductMatrixSection() {
  const { t } = useI18n();

  return (
    <section className="productMatrix">
      <div className="sectionHeader compactCenter">
        <p>{t("MODEL SERIES")}</p>
        <h2>{t("Y series product family.")}</h2>
      </div>
      <div className="productMatrixGrid">
        {productCards.map((card) => (
          <Link href={card.href} className="productTile" key={card.title}>
            <img src={card.image} alt={card.title} />
            <span>{t(card.label)}</span>
            <h3>{card.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AppExperienceSection() {
  const { t } = useI18n();

  return (
    <section className="appExperience">
      <div className="sectionHeader">
        <p>{t("DIGITAL EXPERIENCE")}</p>
        <h2>{t("Owner app, cabin screen and product status surfaces.")}</h2>
      </div>
      <div className="galleryStrip">
        {galleryCards.map((card) => (
          <article key={card.title}>
            <img src={card.image} alt={card.title} />
            <h3>{t(card.title)}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductPage({ page }: { page: (typeof routeTitles)[string] }) {
  const { t } = useI18n();

  return (
    <>
      <section className="pageIntro" id="main-content">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
        <div className="specGrid">
          {modelSpecs.map(([label, value]) => (
            <div key={label}>
              <span>{t(label)}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="configurator">
        <div className="configVisual">
          <img src={media.color1} alt="Y-3 color option" />
        </div>
        <div className="configCopy">
          <p>{t("CUSTOM")}</p>
          <h2>Y-3</h2>
          <div className="swatches">
            {["#e02925", "#537320", "#9b9b99", "#ffb713", "#162964"].map((color) => (
              <span style={{ background: color }} key={color} />
            ))}
          </div>
          <Link href="/contact">{t("BOOK TEST RIDE")}</Link>
        </div>
      </section>
      <section className="modelBand">
        <ModelStage />
      </section>
    </>
  );
}

function OptionsDetailPage({ page, rawPath }: { page: (typeof routeTitles)[string]; rawPath: string }) {
  const { t } = useI18n();
  const options = [
    { name: "Flame Red", color: "#e02925", image: media.color1 },
    { name: "Olive Green", color: "#537320", image: media.color2 },
    { name: "Titanium Silver", color: "#9b9b99", image: media.color3 },
    { name: "Solar Yellow", color: "#ffb713", image: media.color4 },
    { name: "Deep Blue", color: "#162964", image: media.color5 },
  ];
  const preset = Number(pathParam(rawPath));
  const [active, setActive] = useState(Number.isFinite(preset) && preset > 0 ? Math.min(preset - 1, options.length - 1) : 0);
  const current = options[active];

  return (
    <section className="optionsStudio" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="optionsStudioPanel">
        <div className="optionsVisual">
          <img src={current.image} alt={current.name} />
        </div>
        <aside className="optionsControl">
          <SlidersHorizontal size={24} strokeWidth={1.5} />
          <span>{t("LOCAL CONFIGURATOR")}</span>
          <h3>Y-3 {t(current.name)}</h3>
          <p>{t("Color, exterior package and inquiry actions are rebuilt locally. Checkout and production pricing are not connected.")}</p>
          <div className="swatches labeled">
            {options.map((option, index) => (
              <button
                aria-label={t(option.name)}
                className={active === index ? "active" : ""}
                key={option.name}
                onClick={() => setActive(index)}
                style={{ background: option.color }}
                type="button"
              />
            ))}
          </div>
          <div className="optionRows">
            <span>
              <Package size={16} /> {t("Exterior color kit")}
            </span>
            <span>
              <CalendarDays size={16} /> {t("Test-drive inquiry only")}
            </span>
          </div>
          <Link href="/test-drive">{t("BOOK TEST DRIVE")}</Link>
        </aside>
      </div>
      <div className="modelBand embedded">
        <ModelStage />
      </div>
    </section>
  );
}

function ProductSequenceCanvas({ lines }: { lines: readonly string[] }) {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const [loaded, setLoaded] = useState(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const frame = framesRef.current[index];
    const holder = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !holder || !context || !frame?.complete || !frame.naturalWidth) return;

    const width = Math.max(1, holder.clientWidth);
    const height = Math.max(1, holder.clientHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const bitmapWidth = Math.floor(width * dpr);
    const bitmapHeight = Math.floor(height * dpr);

    if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
      canvas.width = bitmapWidth;
      canvas.height = bitmapHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    const scale = Math.max(width / frame.naturalWidth, height / frame.naturalHeight);
    const x = (width - frame.naturalWidth * scale) / 2;
    const y = (height - frame.naturalHeight * scale) / 2;
    context.drawImage(frame, x, y, frame.naturalWidth * scale, frame.naturalHeight * scale);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const frames = modelSequenceFrames.map((src, index) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      image.onload = () => {
        if (cancelled) return;
        if (index === 0) {
          setLoaded(true);
        }
        if (index === frameIndexRef.current) drawFrame(index);
      };
      return image;
    });

    framesRef.current = frames;
    return () => {
      cancelled = true;
      framesRef.current = [];
    };
  }, [drawFrame]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const index = Math.round(progress * (modelSequenceFrames.length - 1));
      frameIndexRef.current = index;
      drawFrame(index);
    };

    const schedule = () => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [drawFrame]);

  return (
    <section className="productSequence" ref={sectionRef}>
      <div className="productSequenceSticky">
        <canvas aria-label={t("Hydrofoil scroll sequence")} ref={canvasRef} />
        {!loaded ? <span className="productSequenceLoading">{t("LOADING")}</span> : null}
        <div className="productSequenceCopy">
          {lines.map((line) => (
            <p key={line}>{t(line)}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductColorTheater() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const current = modelColorStories[active];

  return (
    <section className="productColorTheater">
      <div className="productColorMedia">
        <img src={current.image} alt={t(current.name)} />
        <video key={current.video} src={current.video} muted playsInline autoPlay preload="metadata" />
      </div>
      <div className="productColorCopy">
        <div>
          <span>{t("富有生命力的色彩")}</span>
          <h2>{t(current.name)}</h2>
          <i />
        </div>
        <p>{t(current.description)}</p>
      </div>
      <div className="productColorSwatches">
        {modelColorStories.map((item, index) => (
          <button
            aria-label={t(item.name)}
            className={active === index ? "active" : ""}
            key={item.name}
            onClick={() => setActive(index)}
            style={{ "--swatch": item.color } as CSSProperties}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

function ModelPage({ page }: { page: (typeof routeTitles)[string] }) {
  const { t } = useI18n();
  const modelKey = page.label === "Y-5" ? "h2" : "h1";
  const copy = modelPageCopy[modelKey];

  return (
    <div className="officialModelPage" id="main-content">
      <section className="productHeroReplica">
        <video src={copy.heroVideo} autoPlay muted loop playsInline preload="metadata" />
        <div>
          <p>{t(copy.series)}</p>
        </div>
      </section>

      <ProductSequenceCanvas lines={copy.sequenceLines} />

      <section className="productDetailReplica">
        <div className="productSectionTitle">
          <h2>{t(copy.aestheticsTitle)}</h2>
          <p>{t(copy.aestheticsText)}</p>
        </div>
        <div className="productDetailGrid">
          {modelDetailCards.map(([title, text, image]) => (
            <article key={title}>
              <img src={image} alt={t(title)} loading="lazy" />
              <div>
                <h3>{t(title)}</h3>
                <p>{t(text)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="productWindSection">
        <video src={media.modelWind} muted loop playsInline autoPlay preload="metadata" />
        <div>
          <h2>{t(copy.windTitle)}</h2>
          <p>{t(copy.windText)}</p>
        </div>
      </section>

      <ProductColorTheater />

      <section className="productModelCanvas">
        <div className="productModelCanvasCopy">
          <span>{t("3D MODEL")}</span>
          <h2>{t("旋转模型")}</h2>
          <p>{t("官方 GLB 资源已接入本地画布，可拖拽查看船体比例与水翼结构。")}</p>
        </div>
        <ModelStage variant={modelKey === "h1" ? "h1" : "y3"} />
      </section>

      <section className="productTechnicalSection">
        <img src={media.modelTech} alt={t("Technical data background")} />
        <div className="productTechnicalInner">
          <h2>{t("技术参数")}</h2>
          <div className="productTechnicalCard">
            {copy.specs.map(([group, rows]) => (
              <div key={group}>
                <h3>{t(group)}</h3>
                {rows.map(([label, value]) => (
                  <p key={label}>
                    <span>{t(label)}</span>
                    <strong>{t(value)}</strong>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="productGalleryReplica">
        <div className="productSectionTitle">
          <h2>{t("画廊 水翼艇")}</h2>
          <p>
            {t("探索")} {t(copy.series.replace("版", ""))} {t("的每一个精致细节，感受水上飞行的优雅之美。")}
          </p>
        </div>
        <div className="productGalleryTrack">
          {modelGalleryItems.map((item, index) => {
            const branded = "brand" in item && item.brand === true;

            return (
              <article key={`${item.src}-${index}`} className={branded ? "brand" : ""}>
                {item.type === "video" ? (
                  <video src={item.src} muted loop playsInline autoPlay preload="metadata" />
                ) : (
                  <img src={item.src} alt={`${t("画廊 水翼艇")} ${index + 1}`} loading="lazy" />
                )}
                {branded ? (
                  <div>
                    <img src={media.heroTitle} alt="Alaqua" />
                    <p>{t("释放无限动力")}</p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CraftPage({ page }: { page: (typeof routeTitles)[string] }) {
  const { t } = useI18n();

  return (
    <section className="craftPage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="craftGrid">
        {craftImages.map((image, index) => (
          <article key={image}>
            <img src={image} alt={`Craft ${index + 1}`} />
            <span>0{index + 1}</span>
            <h3>{t(["Factory", "Manufacturing", "Carbon Fiber", "Brand"][index])}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function DetailPage({ page, detail }: { page: (typeof routeTitles)[string]; detail: (typeof detailPages)[string] }) {
  const { t } = useI18n();

  return (
    <section className="detailPage" id="main-content">
      <div className="detailIntro">
        <p>{t(detail.label)}</p>
        <h2>{t(detail.title)}</h2>
        <span>{t(detail.lead)}</span>
      </div>
      <div className="detailShowcase">
        <article className="detailHeroBlock">
          <img src={detail.media[0]} alt={detail.label} />
          <div>
            <p>{t(page.kicker)}</p>
            <h3>{t(page.title)}</h3>
          </div>
        </article>
        <div className="detailStats">
          {detail.stats.map(([label, value]) => (
            <div key={label}>
              <span>{t(label)}</span>
              <strong>{t(value)}</strong>
            </div>
          ))}
        </div>
      </div>
      <div className="detailGrid">
        {detail.bullets.map(([title, text], index) => (
          <article key={title}>
            <img src={detail.media[(index + 1) % detail.media.length]} alt="" />
            <span>{`0${index + 1}`}</span>
            <h3>{t(title)}</h3>
            <p>{t(text)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TechPage({ page }: { page: (typeof routeTitles)[string] }) {
  const { t } = useI18n();
  const items = [
    [Waves, "Hydrofoil Control", "Active foils reduce resistance and lift the craft above the waterline."],
    [BatteryCharging, "Electric Power", "Quiet propulsion, high voltage energy, clean operation."],
    [ShieldCheck, "Stability", "Sensor fusion and software keep the riding posture stable."],
  ] as const;

  return (
    <section className="techPage" id="main-content">
      <video src={media.detailVideo} autoPlay muted loop playsInline />
      <div className="techOverlay">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
        <div className="techCards">
          {items.map(([Icon, title, text]) => (
            <article key={title}>
              <Icon size={24} strokeWidth={1.65} />
              <h3>{t(title)}</h3>
              <span>{t(text)}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestorPage({ page }: { page: (typeof routeTitles)[string] }) {
  const { t } = useI18n();

  return (
    <section className="investorPage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="investorCards">
        {[
          ["Songhe Capital", "Industrial investment partner"],
          ["XBOTPARK", "Hard-tech incubation network"],
          ["Professor Li Zexiang", "Technology and industry mentor"],
        ].map(([name, role]) => (
          <article key={name}>
            <Users size={24} strokeWidth={1.5} />
            <h3>{t(name)}</h3>
            <p>{t(role)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactPage({ page, path, rawPath }: { page: (typeof routeTitles)[string]; path: string; rawPath: string }) {
  const { t } = useI18n();
  const isCharging = path === "/contact/charging";
  const isFinance = path === "/contact/finance";
  const isCustomerService = path.includes("customerService") || path === "/customerService";
  const image = isCharging ? media.chargingHero : isFinance ? media.financeHero : isCustomerService ? media.service2 : media.contact;
  const requestId = path.endsWith("/:id") ? pathParam(rawPath) : "";

  return (
    <section className="contactPage" id="main-content">
      <img src={image} alt={page.label} />
      <div className="contactCard">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
        <div className="contactRows">
          <span>
            <MapPin size={16} /> {t("Shenzhen / Zhuhai")}
          </span>
          <span>
            <ShoppingBag size={16} />{" "}
            {isCharging
              ? t("Charging, energy and operating service")
              : isFinance
                ? t("Purchase, leasing and finance consultation")
                : t("Test drive, dealer and business cooperation")}
          </span>
          <span>
            <Mail size={16} /> {requestId ? `${t("Local request reference")}: ${requestId}` : t("Local form only, production API disabled")}
          </span>
        </div>
        <form>
          <input placeholder={t("Full Name")} />
          <input placeholder={t("Email or Phone")} />
          <textarea placeholder={isCustomerService ? t("Describe service request") : t("Message")} />
          <button type="button">{t("SEND MESSAGE")}</button>
        </form>
        <div className="localNotice">{t("This page keeps the visible workflow local and does not submit to the official backend.")}</div>
      </div>
    </section>
  );
}

function SupportPage({ page }: { page: (typeof routeTitles)[string] }) {
  const { t } = useI18n();

  return (
    <section className="supportPage" id="main-content">
      <div>
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      {["Operation Guide", "Maintenance", "Battery Recycling", "Safety Terms", "Customer Service"].map((item) => (
        <Link href="/help-center" key={item}>
          {t(item)}
          <ChevronRight size={16} />
        </Link>
      ))}
    </section>
  );
}

function StorePage({ page, path }: { page: (typeof routeTitles)[string]; path: string }) {
  const { t } = useI18n();
  const feature = storeFeatures.find((item) => item.path === path);

  if (path === "/store/accessories") {
    return (
      <section className="storePage" id="main-content">
        <div className="pageIntro compact">
          <p>{t(page.label)}</p>
          <h2>{t(page.title)}</h2>
        </div>
        <div className="accessoryGrid">
          {accessoryItems.map((item) => (
            <Link className="accessoryCard" href={`/store/accessories/${item.id}`} key={item.id}>
              <img src={item.image} alt={item.title} />
              <span>{t(item.label)}</span>
              <h3>{t(item.title)}</h3>
              <p>{t(item.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  }

  if (feature && path !== "/store") {
    return (
      <section className="storePage" id="main-content">
        <div className="storeDetail">
          <div className="storeDetailMedia">
            <img src={feature.image} alt={feature.title} />
          </div>
          <div className="storeDetailCopy">
            <Package size={24} strokeWidth={1.5} />
            <span>{t(feature.label)}</span>
            <h2>{t(feature.title)}</h2>
            <p>{t(feature.lead)}</p>
            <div className="detailStats compactStats">
              {feature.specs.map(([label, value]) => (
                <div key={label}>
                  <span>{t(label)}</span>
                  <strong>{t(value)}</strong>
                </div>
              ))}
            </div>
            <div className="storeActions">
              <Link href="/contact">{t("INQUIRE")}</Link>
              <Link href="/test-drive">{t("TEST DRIVE")}</Link>
            </div>
            <div className="localNotice">{t("Checkout and business APIs are intentionally disabled in this local rebuild.")}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="storePage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="storeFeatureGrid">
        {storeFeatures.map((item) => (
          <Link className="storeFeatureCard" href={item.path} key={item.path}>
            <img src={item.image} alt={item.title} />
            <span>{t(item.label)}</span>
            <h3>{t(item.title)}</h3>
            <p>{t(item.lead)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AccessoryPage({ page, rawPath }: { page: (typeof routeTitles)[string]; rawPath: string }) {
  const { t } = useI18n();
  const id = pathParam(rawPath);
  const item = accessoryItems.find((accessory, index) => accessory.id === id || String(index + 1) === id) || accessoryItems[0];

  return (
    <section className="accessoryDetail" id="main-content">
      <div className="accessoryMedia">
        <img src={item.image} alt={item.title} />
      </div>
      <div className="accessoryCopy">
        <p>{t(page.kicker)}</p>
        <h2>{t(item.title)}</h2>
        <span>{t(item.description)}</span>
        <div className="optionRows">
          <span>
            <Package size={16} /> {t(item.label)}
          </span>
          <span>
            <CreditCard size={16} /> {t("Production payment disabled")}
          </span>
          <span>
            <SlidersHorizontal size={16} /> {t("Local inquiry flow")}
          </span>
        </div>
        <div className="storeActions">
          <Link href="/contact">{t("INQUIRE")}</Link>
          <Link href="/store/accessories">{t("BACK TO ACCESSORIES")}</Link>
        </div>
        <div className="localNotice">{t("This is a local product detail page; it does not create a real cart or order.")}</div>
      </div>
    </section>
  );
}

function TeamPage({ page }: { page: (typeof routeTitles)[string] }) {
  const { t } = useI18n();
  const team = [
    ["Product Engineering", "Hydrofoil structure, propulsion and control architecture.", media.team1],
    ["Industrial Design", "Cabin, bodywork, materials and the premium water-mobility identity.", media.team2],
    ["Operations", "Test rides, delivery, dealer support and service workflows.", media.investor3],
  ];

  return (
    <section className="teamPage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="teamGrid">
        {team.map(([title, text, image]) => (
          <article key={title}>
            <img src={image} alt={title} />
            <h3>{t(title)}</h3>
            <p>{t(text)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TestDrivePage({ page }: { page: (typeof routeTitles)[string] }) {
  const { t } = useI18n();

  return (
    <section className="testDrivePage" id="main-content">
      <div className="testDriveMedia">
        <video src={media.showVideo} autoPlay muted loop playsInline poster={media.range1} />
      </div>
      <div className="testDriveForm">
        <CalendarDays size={24} strokeWidth={1.5} />
        <p>{t(page.kicker)}</p>
        <h2>{t(page.title)}</h2>
        <form>
          <input placeholder={t("Full Name")} />
          <input placeholder={t("Email or Phone")} />
          <input placeholder={t("City")} />
          <select defaultValue="Y-3">
            <option>Y-3</option>
            <option>Y-5</option>
          </select>
          <input type="date" />
          <textarea placeholder={t("Preferred water, route or message")} />
          <button type="button">{t("SUBMIT LOCAL REQUEST")}</button>
        </form>
        <div className="localNotice">{t("The booking form is present for the frontend replica only; no official appointment is created.")}</div>
      </div>
    </section>
  );
}

function DealerPage({ page, path, rawPath }: { page: (typeof routeTitles)[string]; path: string; rawPath: string }) {
  const { t } = useI18n();
  const isDetail = path.endsWith("/:id");
  const dealer = dealerItems.find((item, index) => item.id === pathParam(rawPath) || String(index + 1) === pathParam(rawPath)) || dealerItems[0];

  if (isDetail) {
    return (
      <section className="dealerPage" id="main-content">
        <div className="dealerDetail">
          <img src={dealer.image} alt={dealer.title} />
          <div>
            <MapPin size={24} strokeWidth={1.5} />
            <p>{t(dealer.region)}</p>
            <h2>{t(dealer.title)}</h2>
            <span>{t(dealer.address)}</span>
            <div className="storeActions">
              <Link href="/test-drive">{t("BOOK TEST DRIVE")}</Link>
              <Link href="/contact/dealers">{t("BACK TO NETWORK")}</Link>
            </div>
            <div className="localNotice">{t("Dealer data is local static content in this rebuild.")}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dealerPage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="dealerGrid">
        {dealerItems.map((item) => (
          <Link className="dealerCard" href={`/contact/dealers/${item.id}`} key={item.id}>
            <img src={item.image} alt={item.title} />
            <span>{t(item.region)}</span>
            <h3>{t(item.title)}</h3>
            <p>{t(item.address)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HelpFlowPage({ page, path }: { page: (typeof routeTitles)[string]; path: string }) {
  const { t } = useI18n();
  const flowData = {
    "/help-center/reset-password": {
      icon: KeyRound,
      title: "Reset Password",
      text: "Verify contact information, set a new password and return to the local sign-in surface.",
    },
    "/help-center/account-appeal": {
      icon: Mail,
      title: "Account Appeal",
      text: "Collect appeal information and supporting details without submitting to the official service.",
    },
    "/help-center/freeze-account": {
      icon: Lock,
      title: "Freeze Account",
      text: "A local account safety form for freezing access in the replica interface.",
    },
    "/help-center/unfreeze-account": {
      icon: KeyRound,
      title: "Unfreeze Account",
      text: "A local recovery workflow for restoring account access.",
    },
    "/help-center/unblock-account": {
      icon: ShieldCheck,
      title: "Unblock Account",
      text: "A support request flow for account restriction review.",
    },
    "/help-center/delete-account": {
      icon: Lock,
      title: "Delete Account",
      text: "A deletion request page with confirmation-style UI, kept local only.",
    },
  };
  const flow = flowData[path as keyof typeof flowData] || flowData["/help-center/reset-password"];
  const Icon = flow.icon;

  return (
    <section className="helpFlowPage" id="main-content">
      <div className="flowPanel">
        <Icon size={30} strokeWidth={1.5} />
        <p>{t(page.kicker)}</p>
        <h2>{t(flow.title)}</h2>
        <span>{t(flow.text)}</span>
        <form>
          <input placeholder={t("Email or Phone")} />
          <input placeholder={t("Verification Code")} />
          <textarea placeholder={t("Description")} />
          <button type="button">{t("SUBMIT LOCAL FORM")}</button>
        </form>
        <div className="localNotice">{t("All account help actions are frontend-only in this local version.")}</div>
      </div>
    </section>
  );
}

function AuthPage({ page, path, rawPath }: { page: (typeof routeTitles)[string]; path: string; rawPath: string }) {
  const { t } = useI18n();
  const isLogin = path === "/login";
  const provider = pathParam(rawPath) || "bind";

  if (!isLogin) {
    return (
      <section className="authPage" id="main-content">
        <div className="authCard">
          <KeyRound size={30} strokeWidth={1.5} />
          <p>{t(page.kicker)}</p>
          <h2>{t(page.title)}</h2>
          <span>
            {provider.toUpperCase()} {t("authorization is captured as a local callback page. No OAuth token is requested.")}
          </span>
          <div className="storeActions">
            <Link href="/login">{t("BACK TO SIGN IN")}</Link>
            <Link href="/profile">{t("LOCAL PROFILE")}</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="authPage" id="main-content">
      <div className="authCard">
        <Lock size={30} strokeWidth={1.5} />
        <p>{t(page.kicker)}</p>
        <h2>{t(page.title)}</h2>
        <form>
          <label>
            <Mail size={16} /> {t("Email or Phone")}
            <input placeholder="account@example.com" />
          </label>
          <label>
            <Lock size={16} /> {t("Password")}
            <input placeholder={t("Password")} type="password" />
          </label>
          <button type="button">{t("SIGN IN LOCALLY")}</button>
        </form>
        <div className="authProviders">
          {["wechat", "google", "line", "linkedin", "twitter", "alipay"].map((item) => (
            <Link href={`/auth/${item}`} key={item}>
              {item}
            </Link>
          ))}
        </div>
        <div className="localNotice">{t("Login UI is reproduced locally; it does not call the official login API.")}</div>
      </div>
    </section>
  );
}

function AccountPage({ page }: { page: (typeof routeTitles)[string] }) {
  const { t } = useI18n();
  const items = [
    [Users, "Profile", "Local identity details and contact preferences."],
    [Package, "Orders", "Static order entry points for the replica."],
    [CreditCard, "Payment", "Payment methods are intentionally unavailable."],
    [Lock, "Security", "Password and account safety flows point to local help pages."],
  ] as const;

  return (
    <section className="accountPage" id="main-content">
      <div className="pageIntro compact">
        <p>{t(page.label)}</p>
        <h2>{t(page.title)}</h2>
      </div>
      <div className="accountGrid">
        {items.map(([Icon, title, text]) => (
          <article key={title}>
            <Icon size={24} strokeWidth={1.5} />
            <h3>{t(title)}</h3>
            <p>{t(text)}</p>
          </article>
        ))}
      </div>
      <div className="localNotice wide">{t("This profile center is a local frontend shell with no authenticated session.")}</div>
    </section>
  );
}

function OrderPage({ page, path, rawPath }: { page: (typeof routeTitles)[string]; path: string; rawPath: string }) {
  const { t } = useI18n();
  const orderId = pathParam(rawPath) || "LOCAL-ORDER";
  const isConfirmation = path.startsWith("/order-confirmation");

  return (
    <section className="orderPage" id="main-content">
      <div className="orderSummary">
        <CreditCard size={28} strokeWidth={1.5} />
        <p>{t(page.kicker)}</p>
        <h2>{isConfirmation ? t("Order Confirmation") : t("Order Detail")}</h2>
        <span>
          {t("Order ID")}: {orderId}
        </span>
        <div className="orderGrid">
          <article>
            <Package size={20} />
            <h3>{t("Y-3 Inquiry Package")}</h3>
            <p>{t("Static product line item for local page coverage.")}</p>
          </article>
          <article>
            <CalendarDays size={20} />
            <h3>{t("Appointment Pending")}</h3>
            <p>{t("No production booking or payment has been created.")}</p>
          </article>
        </div>
        <div className="storeActions">
          <Link href="/store">{t("STORE")}</Link>
          <Link href="/profile">{t("PROFILE")}</Link>
        </div>
        <div className="localNotice">{t("Orders are local placeholders and do not read from the official order API.")}</div>
      </div>
    </section>
  );
}

function FlyFooter() {
  const { t } = useI18n();
  const companyLinks = ["Maintenance", "Environment", "Legal", "Sales Recruitment", "Service Recruitment", "Battery Recycling"];
  const productLinks = [
    ["Y-3 Series", "/models/h1"],
    ["Y-5 Series", "/models/h2"],
    ["Technology", "/tech/advantages"],
    ["Configure", "/2d"],
    ["Test Ride", "/contact"],
  ];

  return (
    <footer className="flyFooter">
      <div className="footerGrid">
        <div>
          <h3>{t("Company")}</h3>
          <nav>
            {companyLinks.map((item) => (
              <Link href="/help-center" key={item}>
                {t(item)}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h3>{t("Products")}</h3>
          <nav>
            {productLinks.map(([item, href]) => (
              <Link href={href} key={item}>
                {t(item)}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footerSocial">
          <h3>{t("Follow Us")}</h3>
          <div>
            <a href="mailto:business@fly-h2o.cn" aria-label="Email">
              @
            </a>
            <Link href="/company-intro" aria-label={t("Company introduction")}>
              H2O
            </Link>
            <Link href="/contact" aria-label={t("Contact")}>
              {t("Contact")}
            </Link>
          </div>
        </div>
        <div className="footerContact">
          <h3>{t("Contact Us")}</h3>
          <form>
            <input placeholder={t("Full Name")} />
            <input placeholder={t("Email or Phone")} />
            <textarea placeholder={t("Message")} />
            <button type="button">{t("SEND MESSAGE")}</button>
          </form>
        </div>
      </div>
      <div className="footerBrand">
        <img src={media.heroTitle} alt="Alaqua" />
      </div>
    </footer>
  );
}

function PageBody({ page, path, rawPath }: { page: (typeof routeTitles)[string]; path: string; rawPath: string }) {
  const detailPath = detailKeyForPath(path);

  if (page.kind === "home") return <HomeReplica />;
  if (detailPages[detailPath]) return <DetailPage page={page} detail={detailPages[detailPath]} />;
  if (path === "/options/detail" || path === "/options/detail/:id") return <OptionsDetailPage page={page} rawPath={rawPath} />;
  if (page.kind === "model") return <ModelPage page={page} />;
  if (page.kind === "product") return <ProductPage page={page} />;
  if (page.kind === "store") return <StorePage page={page} path={path} />;
  if (page.kind === "accessory") return <AccessoryPage page={page} rawPath={rawPath} />;
  if (page.kind === "craft" || page.kind === "brand" || page.kind === "company") return <CraftPage page={page} />;
  if (page.kind === "tech" || page.kind === "scenario") return <TechPage page={page} />;
  if (page.kind === "investor") return <InvestorPage page={page} />;
  if (page.kind === "team") return <TeamPage page={page} />;
  if (page.kind === "testDrive") return <TestDrivePage page={page} />;
  if (page.kind === "dealer") return <DealerPage page={page} path={path} rawPath={rawPath} />;
  if (page.kind === "contact") return <ContactPage page={page} path={path} rawPath={rawPath} />;
  if (page.kind === "support") return <SupportPage page={page} />;
  if (page.kind === "helpFlow") return <HelpFlowPage page={page} path={path} />;
  if (page.kind === "auth") return <AuthPage page={page} path={path} rawPath={rawPath} />;
  if (page.kind === "account") return <AccountPage page={page} />;
  if (page.kind === "order") return <OrderPage page={page} path={path} rawPath={rawPath} />;
  return (
    <>
      <FullBleedStory />
      <RangeSection />
      <ProductMatrixSection />
      <ProductPage page={routeTitles["/2d"]} />
      <AppExperienceSection />
      <CraftPage page={routeTitles["/manufacturing"]} />
      <InvestorPage page={routeTitles["/investors"]} />
      <ContactPage page={routeTitles["/contact"]} path="/contact" rawPath="/contact" />
    </>
  );
}

export function FlyH2OSite({ slug, initialLocale }: { slug?: string[]; initialLocale?: Locale }) {
  const pathname = usePathname();
  const rawPath = normalizedPath(pathname, slug);
  const path = routeKeyForPath(rawPath);
  const page = routeTitles[path] || routeTitles["/"];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <I18nProvider initialLocale={initialLocale}>
      <main className="flySite">
        <TopNav onMenu={() => setMenuOpen(true)} />
        <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
        {page.kind !== "home" && page.kind !== "model" ? <Hero page={page} /> : null}
        <PageBody page={page} path={path} rawPath={rawPath} />
        <FlyFooter />
      </main>
    </I18nProvider>
  );
}

if (typeof window !== "undefined") {
  useGLTF.preload(media.modelY3, dracoDecoder);
}
