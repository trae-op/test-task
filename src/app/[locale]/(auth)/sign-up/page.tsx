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

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
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
              Sign Up
            </Card.Header>
            <Card.Body>
              <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formName">
                  <RequiredLabel text="Name" />
                  <TextField
                    {...register("name", {
                      required: validationMessages.required,
                      pattern: {
                        value: NAME_PATTERN,
                        message: validationMessages.name,
                      },
                    })}
                    type="text"
                    placeholder="Enter your name"
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <RequiredLabel text="Email address" />
                  <TextField
                    {...register("email", {
                      required: validationMessages.required,
                      pattern: {
                        value: EMAIL_PATTERN,
                        message: validationMessages.email,
                      },
                    })}
                    type="email"
                    placeholder="Enter email"
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <RequiredLabel text="Password" />
                  <TextField
                    {...register("password", {
                      required: validationMessages.required,
                      pattern: {
                        value: PASSWORD_PATTERN,
                        message: validationMessages.password,
                      },
                    })}
                    type="password"
                    placeholder="Password"
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <RequiredLabel text="Confirm Password" />
                  <TextField
                    {...register("confirmPassword", {
                      required: validationMessages.required,
                      validate: (value) =>
                        value === password || validationMessages.passwordMatch,
                    })}
                    type="password"
                    placeholder="Confirm password"
                    isInvalid={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword?.message}
                  />
                </Form.Group>

                <Button
                  text="Sign Up"
                  type="submit"
                  variant="success"
                  className="w-100"
                />

                <div className="text-center mt-3">
                  Already have an account? <Link href="/sign-in">Sign In</Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
