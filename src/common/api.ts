import { SirenAPIError } from './errors';

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

  // Handle 204 No Content response
  if (response.status === 204) {
    return {
      data: true as T,
      error: null,
      errors: null,
      meta: null
    };
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