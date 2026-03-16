import clsx from 'clsx';
import React, {
  InputHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  isFocused?: boolean;
};

const TextInput = function TextInput(
  { ref, type = 'text', className = '', isFocused = false, ...props }: Props & { ref?: React.RefObject<HTMLInputElement | null> },
) {
  const localRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => localRef.current!);

  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <input
      {...props}
      type={type}
      className={clsx('input', className)}
      ref={localRef}
    />
  );
};

export default TextInput;
