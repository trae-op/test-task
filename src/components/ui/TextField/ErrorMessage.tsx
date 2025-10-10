import type { TErrorMessageProps } from "./types";

export const ErrorMessage = ({ text }: TErrorMessageProps) => {
  if (text === undefined) {
    return null;
  }

  return <span>{text}</span>;
};
