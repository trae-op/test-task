"use client";

import { ExclamationDiamondFill } from "react-bootstrap-icons";
import { AlertError } from "@/components/ui/AlertError";

const ErrorPage = () => {
  return (
    <AlertError
      IconComponent={ExclamationDiamondFill}
      text="Something wrong with server!!!"
    />
  );
};

export default ErrorPage;
