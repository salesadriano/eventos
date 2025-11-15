export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  meta: PaginationMeta;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const parsePaginationParams = (
  page?: string,
  limit?: string
): PaginationParams => {
  const parsedPage = Number.parseInt(page || String(DEFAULT_PAGE), 10);
  const parsedLimit = Number.parseInt(limit || String(DEFAULT_LIMIT), 10);

  const validPage = Number.isNaN(parsedPage) || parsedPage < 1 ? DEFAULT_PAGE : parsedPage;
  const validLimit =
    Number.isNaN(parsedLimit) || parsedLimit < 1
      ? DEFAULT_LIMIT
      : Math.min(parsedLimit, MAX_LIMIT);

  return {
    page: validPage,
    limit: validLimit,
  };
};

export const createPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const paginateArray = <T>(
  array: T[],
  page: number,
  limit: number
): { results: T[]; meta: PaginationMeta } => {
  const total = array.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const results = array.slice(startIndex, endIndex);
  const meta = createPaginationMeta(total, page, limit);

  return { results, meta };
};

