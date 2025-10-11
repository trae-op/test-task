import { type ImageProps } from "next/image";

export type TAvatarProps = ImageProps & {
  size?: "sm" | "md" | "lg" | "xl";
};

export type TAvatarPlaceholderProps = {
  isLoading: boolean;
};
