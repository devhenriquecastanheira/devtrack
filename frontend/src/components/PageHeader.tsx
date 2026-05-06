import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 className="mb-1 fw-bold">{title}</h1>

        {description && (
          <p className="text-muted mb-0">
            {description}
          </p>
        )}
      </div>

      {action && <div className="page-header-actions">{action}</div>}
    </div>
  );
}