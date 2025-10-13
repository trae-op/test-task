"use client";

import { memo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { HeaderInfo } from "./HeaderInfo";
import { DateTimeDisplay } from "./DateTimeDisplay";
import styles from "./styles/TopHeader.module.scss";

export const TopHeader = memo(() => {
  const [currentDate] = useState(new Date());

  return (
    <div className={styles["top-header"]}>
      <Container>
        <Row className={styles["top-header__row"]}>
          <Col xs="auto" className={styles["top-header__col"]}>
            <HeaderInfo title="INVENTORY" />
          </Col>
          <Col xs="auto" className={styles["top-header__col"]}>
            <DateTimeDisplay date={currentDate} />
          </Col>
        </Row>
      </Container>
    </div>
  );
});
