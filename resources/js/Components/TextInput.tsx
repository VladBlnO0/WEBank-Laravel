import clsx from 'clsx';
import React, {
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

export default function TextInput(
  { ref, type = 'text', className = '', isFocused = false, ...props },
): React.JSX.Element {
  const localRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => localRef.current?.focus(),
  }));

  useEffect(() => {
    if (isFocused) {
      localRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <input
      {...props}
      type={type}
      className={clsx(
        'input',
        className,
      )}
      ref={localRef}
    />
  );
};
