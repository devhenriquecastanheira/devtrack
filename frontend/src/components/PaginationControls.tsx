type PaginationControlsProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
};

export function PaginationControls({
  currentPage,
  totalItems,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: PaginationControlsProps) {
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  if (totalItems <= pageSize) {
    return null;
  }

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mt-3">
      <span className="text-muted small">
        Página {currentPage} de {totalPages} — {totalItems} registros
      </span>

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </button>

        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}