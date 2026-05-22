"use client";

import { ProductsPage } from "@/components/pages/products-page";
import { detailPages } from "./data/detail-pages";
import { routeTitles } from "./data/routes";
import { detailKeyForPath } from "./utils/routes";
import { HomeReplica } from "./sections/home-sections";
import { AppExperienceSection, FullBleedStory, ProductMatrixSection, RangeSection } from "./sections/overview-sections";
import { ProductPage } from "./pages/product-page";
import { OptionsDetailPage } from "./pages/options-detail-page";
import { ModelPage } from "./pages/model-page";
import { CraftPage, DetailPage, InvestorPage, TechPage } from "./pages/craft-page";
import { ContactPage } from "./pages/contact-page";
import { SupportPage } from "./pages/support-page";
import { StorePage, AccessoryPage } from "./pages/store-page";
import { DealerPage, TeamPage, TestDrivePage } from "./pages/people-and-dealers-page";
import { AccountPage, AuthPage, HelpFlowPage, OrderPage } from "./pages/account-flow-pages";
import type { PageConfig } from "./types";

export function PageBody({ page, path, rawPath }: { page: PageConfig; path: string; rawPath: string }) {
  const detailPath = detailKeyForPath(path);

  if (page.kind === "home") return <HomeReplica />;
  if (path === "/products") return <ProductsPage />;
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
