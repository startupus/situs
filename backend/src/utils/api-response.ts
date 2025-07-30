export const formatResponse = (data: any, meta: any = {}) => ({
  data,
  meta: {
    ...meta,
  },
});

export const formatError = (error: Error) => ({
  error: {
    message: error.message,
    name: error.name,
    details: error.stack,
  },
});

export const formatPagination = (page: number, limit: number, total: number) => ({
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
}); 