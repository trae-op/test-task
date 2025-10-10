"use client";

import { AlertError } from "@/components/ui/AlertError";
import type { ErrorPageParams } from "@/components/ui/AlertError/types";

const ErrorPage = ({ error }: ErrorPageParams) => {
  return <AlertError text={error.message} />;
};

export default ErrorPage;
