'use client';

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { createAppError, ErrorType, handleError } from '@/utils/error-handlers';

/**
 * Configuration options for APIClient
 */
export interface APIClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

/**
 * A wrapper around axios for making API requests
 */
export class APIClient {
  private client: AxiosInstance;

  constructor(config: APIClientConfig = {}) {
    // Default configuration
    const defaultConfig: APIClientConfig = {
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    };

    // Create axios instance with merged config
    this.client = axios.create({
      ...defaultConfig,
      ...config,
      headers: {
        ...defaultConfig.headers,
        ...config.headers,
      },
    });

    // Set up request interceptors
    this.setupInterceptors();
  }

  /**
   * Configure request/response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => this.handleRequestError(error)
    );
  }

  /**
   * Get the authentication token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Handle request errors and standardize them
   */
  private handleRequestError(error: AxiosError): Promise<never> {
    // Network error
    if (!error.response) {
      return Promise.reject(
        createAppError('Network error: Unable to connect to the server', ErrorType.NETWORK, {
          originalError: error as Error,
        })
      );
    }

    // Server errors based on status code
    const status = error.response.status;
    const data = error.response.data as any;
    const message = data?.message || error.message || 'An unknown error occurred';

    let errorType: ErrorType;

    switch (status) {
      case 401:
        errorType = ErrorType.AUTHENTICATION;
        break;
      case 403:
        errorType = ErrorType.AUTHORIZATION;
        break;
      case 404:
        errorType = ErrorType.NOT_FOUND;
        break;
      case 422:
        errorType = ErrorType.VALIDATION;
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorType = ErrorType.SERVER;
        break;
      default:
        errorType = ErrorType.UNKNOWN;
    }

    const appError = createAppError(message, errorType, {
      code: data?.code || `HTTP_${status}`,
      details: data?.errors || data?.details,
      originalError: error as Error,
    });

    return Promise.reject(appError);
  }

  /**
   * Make a GET request
   */
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw handleError(error, { silent: true, context: 'APIClient.get' });
    }
  }

  /**
   * Make a POST request
   */
  public async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw handleError(error, { silent: true, context: 'APIClient.post' });
    }
  }

  /**
   * Make a PUT request
   */
  public async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw handleError(error, { silent: true, context: 'APIClient.put' });
    }
  }

  /**
   * Make a PATCH request
   */
  public async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw handleError(error, { silent: true, context: 'APIClient.patch' });
    }
  }

  /**
   * Make a DELETE request
   */
  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw handleError(error, { silent: true, context: 'APIClient.delete' });
    }
  }
}

// Export a default instance
const apiClient = new APIClient();

// Export simplified API methods interface
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
};

export { apiClient };
