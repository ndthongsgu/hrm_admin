export interface PaginationDto<T> {
  skip: number;
  take: number;
  where: T;
}

export interface PaginationResponse<T> {
  content: T[];
  totalElements: number;
  message?: string;
}

export interface PaginationParams {
  skip: number;
  take: number;
  [key: string]: any;
}

export interface SuccessResponse {
  message?: string;
  data?: any;
}

export interface ErrorResponse {
  message: string;
  statusCode?: number;
}
