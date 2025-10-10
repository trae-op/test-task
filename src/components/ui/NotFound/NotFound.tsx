"use client";

import { useTranslations } from "next-intl";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import clsx from "clsx";

import styles from "./NotFound.module.scss";

export const NotFound = () => {
  const t = useTranslations("App");
  return (
    <div className={clsx(styles["not-found"])}>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{t("Not Found")}</Card.Title>
          <Card.Text>{t("Could not find requested resource")}</Card.Text>
          <Link href="/">{t("Return Home")}</Link>
        </Card.Body>
      </Card>
    </div>
  );
};
