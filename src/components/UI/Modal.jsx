
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from '@headlessui/react';
import { useState, Fragment } from 'react';
import clsx from 'clsx';

// Tamaños predefinidos para el modal
const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export default function Modal({
  title = '',
  trigger = null,
  size = 'md',
  actions = [],
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Elemento que dispara el modal */}
      {trigger && (
        <div onClick={handleOpen} className="">
          {trigger}
        </div>
      )}

      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            className={clsx(
              'w-full rounded-lg bg-white p-6 shadow-xl space-y-4 relative',
              SIZE_CLASSES[size] || SIZE_CLASSES.md
            )}
          >
            {/* Botón cerrar en la esquina */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
            >
              ✕
            </button>

            {title && (
              <DialogTitle className="text-lg font-bold text-gray-900">
                {title}
              </DialogTitle>
            )}

            <div className="text-sm text-gray-700">{children}</div>

            {/* Botones de acción */}
            {actions.length > 0 && (
              <div className="pt-4 flex justify-end gap-2">
                {actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      action.onClick?.();
                      if (action.closeOnClick !== false) handleClose();
                    }}
                    className={clsx(
                      'px-4 py-2 rounded cursor-pointer',
                      action.className ||
                        'bg-blue-600 text-white hover:bg-blue-700'
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
