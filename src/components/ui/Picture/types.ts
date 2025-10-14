import { type ImageProps } from "next/image";

export type TPictureProps = ImageProps & {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  aspectRatio?: number | string; // used when size="full" to control container height
  fit?: "cover" | "contain" | "fill" | "none" | "scale-down"; // object-fit
};
