import { type ImageProps } from "next/image";

export type TAvatarProps = ImageProps & {
  size?: "sm" | "md" | "lg" | "xl";
};

export type TAvatarPlaceholderProps = {
  isLoading: boolean;
};
export type TAvatarErrorProps = {
  size?: string | number | undefined;
  hasError: boolean;
};
