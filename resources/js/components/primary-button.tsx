import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";
export default function PrimaryButton({
  className = "",
  disabled,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        `inline-flex  items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-semibold tracking-widest text-white uppercase shadow-sm transition duration-150 ease-in-out hover:bg-green-800 focus:bg-green-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:bg-green-800 ${
          disabled && "opacity-25"
        } `,
        className,
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
