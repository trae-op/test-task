export type TTopHeaderProps = {
  onSearch?: (value: string) => void;
};

export type TLogoProps = {
  className?: string;
};

export type TSearchBarProps = {
  placeholder?: string;
  onSearch?: (value: string) => void;
};

export type TDateTimeDisplayProps = {
  date: Date;
};

export type THeaderInfoProps = {
  title: string;
  icon?: string;
};
