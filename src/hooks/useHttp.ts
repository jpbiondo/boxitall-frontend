import { useCallback, useState } from "react";

// Custom error class for HTTP errors
class HttpError extends Error {
  status: number;
  statusText: string;
  url: string;

  constructor(
    message: string,
    status: number,
    statusText: string,
    url: string
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }
}

// Central error handler - customize this based on your needs
const handleHttpError = (error: HttpError) => {
  // Log to your error tracking service
  console.error("HTTP Error:", {
    message: error.message,
    status: error.status,
    statusText: error.statusText,
    url: error.url,
  });

  // You could also show toast notifications, dispatch to error store, etc.
  // Example: toast.error(error.message);
};

export function useHttp() {
  const [error, setError] = useState<HttpError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const request = useCallback(
    async (url: string, options: RequestInit = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          const httpError = new HttpError(
            errorMessage,
            response.status,
            response.statusText,
            url
          );

          // Centralized error handling (logging, etc.)
          handleHttpError(httpError);

          // Set error state for component to handle
          setError(httpError);
          throw httpError;
        }

        // Handle empty responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await response.json();
        }

        return await response.text();
      } catch (error) {
        // If it's already an HttpError, re-throw it
        if (error instanceof HttpError) {
          throw error;
        }

        // Handle network errors, timeouts, etc.
        const networkError = new HttpError(
          `Network error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          0,
          "Network Error",
          url
        );

        // Centralized error handling
        handleHttpError(networkError);

        // Set error state for component to handle
        setError(networkError);
        throw networkError;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const get = useCallback(
    async (url: string, options?: RequestInit) => {
      return request(url, { ...options, method: "GET" });
    },
    [request]
  );

  const post = useCallback(
    async (url: string, data?: any, options?: RequestInit) => {
      return request(url, {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [request]
  );

  const put = useCallback(
    async (url: string, data?: any, options?: RequestInit) => {
      return request(url, {
        ...options,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [request]
  );

  const del = useCallback(
    async (url: string, options?: RequestInit) => {
      return request(url, { ...options, method: "DELETE" });
    },
    [request]
  );

  return {
    // HTTP methods
    request,
    get,
    post,
    put,
    del,

    // State management
    error,
    isLoading,
    clearError,
  };
}
