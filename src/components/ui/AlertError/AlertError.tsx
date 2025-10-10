"use client";

import { useTranslations } from "next-intl";
import Card from "react-bootstrap/Card";
import clsx from "clsx";

import styles from "./AlertError.module.scss";
import type { Props } from "./types";

export const AlertError = ({ text }: Props) => {
  const t = useTranslations("App");
  return (
    <div className={clsx(styles["alert-error"])}>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{t("Something wrong with server")}!!!</Card.Title>
          <Card.Text>{text}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};
