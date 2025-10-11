import { SyntheticEvent, useState, useMemo, memo } from "react";
import Image from "next/image";
import clsx from "clsx";
import { AvatarPlaceholder } from "./AvatarPlaceholder";
import styles from "./Avatar.module.scss";
import { TAvatarProps } from "./types";

const BLOCK = "avatar";

export const Avatar = memo(
  ({
    src,
    alt = "Avatar",
    size = "md",
    className,
    width,
    height,
    onLoad,
    ...rest
  }: TAvatarProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const sizeMap = {
      sm: 40,
      md: 80,
      lg: 120,
      xl: 160,
    };

    const imageSize = useMemo(
      () =>
        width && height
          ? { width, height }
          : { width: sizeMap[size], height: sizeMap[size] },
      [width, height, size]
    );

    const containerClassName = useMemo(
      () => clsx(styles[BLOCK], styles[`${BLOCK}__${size}`], className),
      [size, className]
    );

    const imageClassName = useMemo(
      () =>
        clsx(
          styles.avatar__image,
          isLoading && styles[`${BLOCK}__image--hidden`]
        ),
      [isLoading]
    );

    const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      console.log(111);
      if (onLoad) {
        onLoad(event);
      }
    };

    if (!src || (typeof src === "string" && src.trim() === "")) {
      return null;
    }

    return (
      <div className={containerClassName}>
        <AvatarPlaceholder isLoading={isLoading} />
        <Image
          src={src}
          alt={alt}
          className={imageClassName}
          onLoad={handleLoad}
          {...imageSize}
          {...rest}
        />
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
