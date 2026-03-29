import clsx from 'clsx';

export default function GroupElement({ className = '', ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        'mt-6 rounded-2xl bg-white p-4 shadow sm:rounded-lg sm:p-8',
        className,
      )}
    />
  );
}
