
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
  classModal = '',
  bg = '',
  shadow = true,
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
              'w-full rounded-lg p-6 space-y-4 relative',
              bg ? bg : 'bg-white',
              shadow ? "shadow-xl" : "",
              SIZE_CLASSES[size] || SIZE_CLASSES.md,
              classModal
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
              <>
                <style>{`
      .modal-action-btn {
        background: linear-gradient(94deg, #e5bc5e 60%, #b18b39 100%);
        color: #442b01;
        border: 2px solid #a0802a;
        border-radius: 14px;
        padding: 10px 26px;
        font-family: inherit;
        font-weight: 800;
        font-size: 1.07rem;
        letter-spacing: 1px;
        box-shadow: 1.5px 2px #cab06e, 1px 2px 7px #e4cf93;
        transition: background 0.18s, color 0.13s, box-shadow 0.16s;
        outline: none;
        cursor: pointer;
        margin-left: 7px;
      }
      .modal-action-btn:focus, .modal-action-btn:hover {
        background: linear-gradient(96deg, #f1cd72 60%, #a67c1e 100%);
        color: #664e17;
        box-shadow: 0 3px 16px #d4b87a99;
      }
      .modal-action-btn.secondary {
        background: linear-gradient(95deg, #ece1b5 70%, #a98f3d 100%);
        color: #715f3a;
        border: 2px solid #bca974;
      }
      .modal-action-btn.secondary:hover, .modal-action-btn.secondary:focus {
        background: linear-gradient(97deg, #dfd4a3 75%, #c2a65d 100%);
        color: #b18b39;
      }
      .modal-action-btn.danger {
        background: linear-gradient(94deg, #e45c5c 60%, #a11f1f 100%);
        color: #fff9ea;
        border: 2px solid #a23e2a;
      }
      .modal-action-btn.danger:hover, .modal-action-btn.danger:focus {
        background: linear-gradient(97deg, #ed7878 60%, #7c1b1b 100%);
        color: #fff2cc;
      }
    `}</style>
                <div className="pt-5 flex justify-end gap-2">
                  {actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        action.onClick?.();
                        if (action.closeOnClick !== false) handleClose();
                      }}
                      className={
                        "modal-action-btn " +
                        (action.danger
                          ? "danger"
                          : action.secondary
                            ? "secondary"
                            : "")
                      }
                      style={{
                        minWidth: 120,
                        boxShadow: "0 2px 6px #cbb47d44",
                      }}
                      type={action.type || "button"}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </>
            )}

          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
