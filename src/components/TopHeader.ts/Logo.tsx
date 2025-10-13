import { TLogoProps } from "./types";
import clsx from "clsx";
import styles from "./styles/Logo.module.scss";

const BLOCK = "logo";

export const Logo = ({ className }: TLogoProps) => (
  <svg
    className={clsx(styles[BLOCK], className)}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#8BC34A", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#689F38", stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    <path
      fill="url(#shieldGradient)"
      d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"
    />

    <path
      fill="#689F38"
      d="M12 2.08L19.95 5.5v5.5c0 4.52-3.11 8.8-7.95 9.92V2.08z"
    />

    <circle cx="12" cy="11" r="5" fill="#A5D6A7" opacity="0.6" />

    <circle cx="12" cy="11" r="4" fill="#E8F5E9" />

    <circle cx="12" cy="10" r="1.5" fill="#CFD8DC" />
  </svg>
);
