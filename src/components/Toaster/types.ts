import { type ToastOptions, type ToastType } from "react-hot-toast";

export type TControlToasterHook = {
  setToast: (message: string, type?: ToastType) => void;
  setOptions: (options: ToastOptions) => void;
};
