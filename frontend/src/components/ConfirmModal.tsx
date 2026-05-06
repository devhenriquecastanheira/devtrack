type ConfirmModalProps = {
  title: string;
  message: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  title,
  message,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>

              <button
                className="btn-close"
                type="button"
                aria-label="Fechar"
                disabled={isLoading}
                onClick={onCancel}
              />
            </div>

            <div className="modal-body">
              <p className="mb-1">{message}</p>

              {description && (
                <p className="text-muted mb-0">
                  {description}
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-outline-secondary"
                type="button"
                disabled={isLoading}
                onClick={onCancel}
              >
                {cancelLabel}
              </button>

              <button
                className="btn btn-danger"
                type="button"
                disabled={isLoading}
                onClick={onConfirm}
              >
                {isLoading ? 'Processando...' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}