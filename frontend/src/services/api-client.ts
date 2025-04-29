'use client';

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';
import { toast } from 'react-toastify';
import { handleApiError, retryOperation } from '@/utils/error-handlers';

/**
 * 配置默认的API基础URL
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * API客户端类，用于管理与后端API的所有通信
 */
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private cancelTokens: CancelTokenSource[] = [];

  constructor(baseURL: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 为请求添加取消令牌
        const source = axios.CancelToken.source();
        this.cancelTokens.push(source);
        config.cancelToken = source.token;

        // 添加认证令牌（如果存在）
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 显示加载通知（可选）
        if (config.method !== 'get') {
          toast.info('正在处理请求...', { autoClose: false, toastId: 'loading' });
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // 关闭加载通知
        this.dismissLoadingToast();
        return response;
      },
      (error) => {
        this.dismissLoadingToast();

        // 处理未授权错误
        if (error?.response?.status === 401) {
          // 清除令牌并重定向到登录
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          return Promise.reject(new Error('未授权访问，请重新登录'));
        }

        // 处理请求被取消的情况
        if (axios.isCancel(error)) {
          return Promise.reject(new Error('请求被取消'));
        }

        // 显示错误通知
        const errorMessage = this.extractErrorMessage(error);
        toast.error(errorMessage);
        
        return Promise.reject(error);
      }
    );
  }

  /**
   * 发送GET请求
   * @param url API端点
   * @param params 查询参数
   * @param config Axios配置选项
   * @returns Promise
   */
  async get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, { ...config, params });
    return response.data;
  }

  /**
   * 发送POST请求
   * @param url API端点
   * @param data 请求体数据
   * @param config Axios配置选项
   * @returns Promise
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  /**
   * 发送PUT请求
   * @param url API端点
   * @param data 请求体数据
   * @param config Axios配置选项
   * @returns Promise
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  /**
   * 发送DELETE请求
   * @param url API端点
   * @param config Axios配置选项
   * @returns Promise
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  /**
   * 上传文件
   * @param url API端点
   * @param formData 包含文件的FormData
   * @param config Axios配置选项
   * @returns Promise
   */
  async uploadFile<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const uploadConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    };
    const response = await this.axiosInstance.post<T>(url, formData, uploadConfig);
    return response.data;
  }

  /**
   * 取消所有待处理的请求
   */
  cancelAllRequests(): void {
    this.cancelTokens.forEach((source) => {
      source.cancel('操作被用户取消');
    });
    this.cancelTokens = [];
  }

  /**
   * 关闭加载通知
   */
  private dismissLoadingToast(): void {
    toast.dismiss('loading');
  }

  /**
   * 从错误对象中提取错误消息
   */
  private extractErrorMessage(error: any): string {
    return error?.response?.data?.message 
      || error?.response?.data?.error 
      || error?.message 
      || '未知错误，请稍后再试';
  }
}

// 导出默认实例供应用使用
const apiClient = new ApiClient();
export default apiClient;

// 导出简化的API方法接口
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
  uploadFile: apiClient.uploadFile.bind(apiClient),
  cancelAllRequests: apiClient.cancelAllRequests.bind(apiClient),
}; 