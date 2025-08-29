export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    username: string;
    role: 'admin';
  };
  message?: string;
}

// HTTP Status Codes untuk referensi
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// API Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Pagination (untuk future enhancement)
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}