import { redirect } from "next/navigation";

const DEFAULT_SPU_ID = "2036106382770339842";

export default function OptionsDetailIndexRoute() {
  redirect(`/options/detail/${DEFAULT_SPU_ID}`);
}
