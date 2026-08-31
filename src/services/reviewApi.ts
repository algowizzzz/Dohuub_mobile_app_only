import { del, get, http, patch, post, type Page } from './http';

export type ApiReview = {
  id: string;
  bookingId: string;
  stars: number;
  comment?: string | null;
  reviewerName?: string;
  serviceId: string;
  vendorId: string;
  createdAt: string;
  author?: { id: string; fullName: string; image: string | null };
};

export type ReviewListParams = {
  vendorId?: string;
  serviceId?: string;
  page?: number;
  limit?: number;
};

export type StarBreakdown = Record<'1' | '2' | '3' | '4' | '5', number>;

export const reviewsApi = {
  list: async (
    params?: ReviewListParams,
  ): Promise<Page<ApiReview> & { starBreakdown: StarBreakdown | null }> => {
    const response = await http.request<{
      data?: ApiReview[];
      meta?: { pagination?: Page<ApiReview>['pagination']; starBreakdown?: StarBreakdown };
    }>({ method: 'get', url: '/reviews', skipAuth: true, params });
    const body = response.data;
    return {
      items: body?.data ?? [],
      pagination: body?.meta?.pagination ?? null,
      starBreakdown: body?.meta?.starBreakdown ?? null,
    };
  },

  get: (id: string) =>
    get<{ review: ApiReview }>(`/reviews/${id}`, { skipAuth: true }).then(r => r.review),

  listMine: (params?: { page?: number; limit?: number }) =>
    get<ApiReview[]>('/reviews/mine', { params }),

  create: (payload: { bookingId: string; stars: number; comment?: string }) =>
    post<{ review: ApiReview }>('/reviews', payload).then(r => r.review),

  update: (id: string, payload: { stars?: number; comment?: string }) =>
    patch<{ review: ApiReview }>(`/reviews/${id}`, payload).then(r => r.review),

  remove: (id: string) => del<void>(`/reviews/${id}`),
};
