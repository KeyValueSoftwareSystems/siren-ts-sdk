// Common Error Classes

export class SirenError extends Error {
  constructor(
    public errorCode: string,
    message: string
  ) {
    super(message);
    this.name = 'SirenError';
  }
}

export class SirenAPIError extends SirenError {
  constructor(
    errorCode: string,
    message: string,
    public statusCode: number,
    public response: any
  ) {
    super(errorCode, message);
    this.name = 'SirenAPIError';
  }
}

export class SirenValidationError extends SirenError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message);
    this.name = 'SirenValidationError';
  }
}

export class SirenAuthenticationError extends SirenError {
  constructor(message: string) {
    super('AUTHENTICATION_ERROR', message);
    this.name = 'SirenAuthenticationError';
  }
}

export interface APIResponse<T> {
  data: T | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
  errors: Array<{
    errorCode: string;
    message: string;
  }> | null;
  meta: any | null;
}

export async function handleAPIResponse<T>(response: Response): Promise<APIResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new SirenAPIError(
      errorData?.error?.errorCode || 'UNKNOWN_ERROR',
      errorData?.error?.message || response.statusText,
      response.status,
      errorData
    );
  }

  const data: APIResponse<T> = await response.json();
  
  if (data.error) {
    throw new SirenAPIError(
      data.error.errorCode,
      data.error.message,
      response.status,
      data
    );
  }

  if (data.errors && data.errors.length > 0) {
    throw new SirenAPIError(
      data.errors[0].errorCode,
      data.errors[0].message,
      response.status,
      data
    );
  }

  return data;
} 