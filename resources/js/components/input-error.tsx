import { HTMLAttributes } from 'react';
import clsx from "clsx";
export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={clsx('text-sm text-red-600  ', className)}
        >
            {message}
        </p>
    ) : null;
}
