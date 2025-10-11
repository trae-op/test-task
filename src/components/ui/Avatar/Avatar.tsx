import { SyntheticEvent, useState, useMemo, memo } from "react";
import Image from "next/image";
import clsx from "clsx";
import { AvatarPlaceholder } from "./AvatarPlaceholder";
import { AvatarError } from "./AvatarError";
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
    onError,
    onLoad,
    ...rest
  }: TAvatarProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
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
      if (onLoad) {
        onLoad(event);
      }
    };

    const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setHasError(true);
      if (onError) {
        onError(event);
      }
    };

    const iconSize = useMemo(() => Math.floor(sizeMap[size] * 0.3), [size]);

    if (!src || (typeof src === "string" && src.trim() === "")) {
      return null;
    }

    return (
      <div className={containerClassName}>
        <AvatarPlaceholder isLoading={isLoading} />
        <AvatarError hasError={hasError} size={iconSize} />
        <Image
          src={src}
          alt={alt}
          className={imageClassName}
          onLoad={handleLoad}
          onError={handleError}
          {...imageSize}
          {...rest}
        />
      </div>
    );
  }
);

Avatar.displayName = "Avatar";
