import { useTranslations } from "next-intl";
import IndependentComponents from "./IndependentComponents";

export default function Home() {
  const t = useTranslations("App");
  return (
    <>
      <h1>home</h1>

      <IndependentComponents />
    </>
  );
}
