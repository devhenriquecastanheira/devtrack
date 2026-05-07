import { AxiosError } from 'axios';

type ApiErrorData = {
  detail?: string;
  non_field_errors?: string[];
  [key: string]: unknown;
};

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = 'Ocorreu um erro inesperado.',
) {
  if (!(error instanceof AxiosError)) {
    return fallbackMessage;
  }

  const data = error.response?.data as ApiErrorData | undefined;

  if (!data) {
    return fallbackMessage;
  }

  if (typeof data.detail === 'string') {
    return data.detail;
  }

  if (Array.isArray(data.non_field_errors)) {
    return data.non_field_errors.join(' ');
  }

  const fieldErrors = Object.entries(data)
    .filter(([, value]) => Array.isArray(value))
    .map(([field, value]) => {
      const messages = value as string[];

      return `${formatFieldName(field)}: ${messages.join(' ')}`;
    });

  if (fieldErrors.length > 0) {
    return fieldErrors.join(' ');
  }

  return fallbackMessage;
}

function formatFieldName(field: string) {
  const labels: Record<string, string> = {
    username: 'Usuário',
    email: 'E-mail',
    password: 'Senha',
    title: 'Título',
    description: 'Descrição',
    status: 'Status',
    track: 'Trilha',
    repository_url: 'URL do repositório',
    deploy_url: 'URL do deploy',
    technologies: 'Tecnologias',
    completed: 'Concluído',
    order: 'Ordem',
  };

  return labels[field] ?? field;
}