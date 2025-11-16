export type UnknownObject = Record<string, any>;

export type PaginationParam = {
  page?: string | number;
  size?: string | number;
};

export interface PaginationData {
  offset: number;
  limit: number;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    next?: {
      page: number;
      size: number;
    };
    previous?: {
      page: number;
      size: number;
    };
    current_page?: number;
    size: number;
    total: number;
  };
}

export interface RangeFilter {
  search?: string;
  from?: Date;
  to?: Date;
}

export function BuildPaginatedResponse<T>(
  data: T[],
  {
    page,
    size,
    total,
    totalPages,
  }: { page: number; size: number; total: number; totalPages: number },
): PaginationResponse<T> {
  return {
    data,
    pagination: {
      next: page < totalPages ? { page: page + 1, size } : undefined,
      previous: page > 1 ? { page: page - 1, size } : undefined,
      current_page: page,
      size,
      total: Number(total),
    },
  };
}
