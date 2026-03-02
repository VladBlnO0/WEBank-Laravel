import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { PropsWithChildren } from 'react';

export default function Modal({
  children,
  show = false,
  maxWidth = 'xl',
  closeable = true,
  onClose = () => {},
}: PropsWithChildren<{
  show: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  closeable?: boolean;
  onClose: CallableFunction;
}>) {
  const close = () => {
    if (closeable) {
      onClose();
    }
  };

  const maxWidthClass = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  }[maxWidth];

  return (
    <Transition show={show} leave="duration-100">
      <Dialog
        as="div"
        id="modal"
        className="fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
        onClose={close}
      >
        <div className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/75" />
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <DialogPanel
            className={`z-1 mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full dark:bg-gray-800 ${maxWidthClass}`}
          >
            {children}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}
