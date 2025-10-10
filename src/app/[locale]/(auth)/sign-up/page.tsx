"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { RequiredLabel } from "@/components/ui/RequiredLabel";
import {
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
  NAME_PATTERN,
  validationMessages,
} from "@/utils/regExp";
import { useTranslations } from "next-intl";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const t = useTranslations("App.auth.signUp");
  const tp = useTranslations("App.auth.placeholders");
  const te = useTranslations("App.errors");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = (data: SignUpFormData) => {
    console.log("Form data:", data);
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Card.Header as="h4" className="text-center">
              {t("title")}
            </Card.Header>
            <Card.Body>
              <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formName">
                  <RequiredLabel text={t("name")} />
                  <TextField
                    {...register("name", {
                      required: te("required"),
                      pattern: {
                        value: NAME_PATTERN,
                        message: te("name"),
                      },
                    })}
                    type="text"
                    placeholder={tp("enterName")}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <RequiredLabel text={t("email")} />
                  <TextField
                    {...register("email", {
                      required: te("required"),
                      pattern: {
                        value: EMAIL_PATTERN,
                        message: te("email"),
                      },
                    })}
                    type="email"
                    placeholder={tp("enterEmail")}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <RequiredLabel text={t("password")} />
                  <TextField
                    {...register("password", {
                      required: te("required"),
                      pattern: {
                        value: PASSWORD_PATTERN,
                        message: te("password"),
                      },
                    })}
                    type="password"
                    placeholder={tp("enterPassword")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <RequiredLabel text={t("confirmPassword")} />
                  <TextField
                    {...register("confirmPassword", {
                      required: te("required"),
                      validate: (value) =>
                        value === password || te("passwordMatch"),
                    })}
                    type="password"
                    placeholder={tp("confirmPassword")}
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword?.message}
                  />
                </Form.Group>

                <Button
                  text={t("submitButton")}
                  type="submit"
                  variant="success"
                  className="w-100"
                />

                <div className="text-center mt-3">
                  {t("haveAccount")}{" "}
                  <Link href="/sign-in">{t("signInLink")}</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
