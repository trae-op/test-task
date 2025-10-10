import { Alert } from "react-bootstrap";
import { ExclamationDiamondFill } from "react-bootstrap-icons";

import clsx from "clsx";
import Link from "next/link";

import styles from "./NotFound.module.scss";

const BLOCK = "base-alert";

export const NotFound = () => (
  <Alert variant="info" className={clsx(styles[BLOCK])}>
    <span className={clsx(styles[`${BLOCK}__icon-wrapper`])}>
      <ExclamationDiamondFill size={13} />
    </span>
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  </Alert>
);
