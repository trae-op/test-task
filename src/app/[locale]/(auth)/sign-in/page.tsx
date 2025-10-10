"use client";

import { useForm } from "react-hook-form";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import {
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
  validationMessages,
} from "@/utils/regExp";

interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    mode: "onBlur",
  });

  const onSubmit = (data: SignInFormData) => {
    console.log("Form data:", data);
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Card.Header as="h4" className="text-center">
              Sign In
            </Card.Header>
            <Card.Body>
              <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
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
                  <Form.Label>Password</Form.Label>
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

                <Button text="Sign In" type="submit" className="w-100" />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
