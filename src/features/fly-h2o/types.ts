export type PageKind =
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

export type PageConfig = {
  label: string;
  title: string;
  kicker: string;
  kind: PageKind;
};
