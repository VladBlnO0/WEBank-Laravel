import clsx from "clsx";
import { HTMLAttributes, type JSX } from "react";
export default function InputError({
  message,
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  message?: string;
}): JSX.Element | null {
  return message ? (
    <p {...props} className={clsx("text-sm text-red-600", className)}>
      {message}
    </p>
  ) : null;
}
