import { useTranslations } from "next-intl";
import Button from "./Button";

export default function Home() {
  const t = useTranslations("App");
  return (
    <>
      <h1>home</h1>

      <Button />
    </>
  );
}
