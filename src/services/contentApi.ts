import { get } from './http';

export type ApiFaqRaw = {
  id: string;
  title: string;
  content: string;
  sortOrder: number;
};

export type ApiFaq = {
  id: string;
  question: string;
  answer: string;
};

function toFaq(raw: ApiFaqRaw): ApiFaq {
  return { id: raw.id, question: raw.title, answer: raw.content };
}

function mapFaqList(data: ApiFaqRaw[] | { items?: ApiFaqRaw[]; faqs?: ApiFaqRaw[] } | null | undefined): ApiFaq[] {
  const items = Array.isArray(data) ? data : data?.items ?? data?.faqs ?? [];
  return items.map(toFaq);
}

export type ContentDocumentKind = 'terms' | 'privacy' | 'about';

export type ApiContentDocumentRaw = {
  id: string;
  content: string;
  publishedByName: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiContentDocument = {
  kind: ContentDocumentKind;
  content: string;
  updatedAt: string;
};

export const contentApi = {
  listFaqs: async (params?: { page?: number; limit?: number }) => {
    const data = await get<ApiFaqRaw[] | { items?: ApiFaqRaw[]; faqs?: ApiFaqRaw[] }>('/content/faqs', {
      skipAuth: true,
      params: { page: 1, limit: 100, ...params },
    });
    return mapFaqList(data);
  },

  getFaq: (id: string) =>
    get<ApiFaqRaw>(`/content/faqs/${id}`, { skipAuth: true }).then(toFaq),

  getDocument: (kind: ContentDocumentKind) =>
    get<{ document: ApiContentDocumentRaw }>(`/content/${kind}`, { skipAuth: true }).then(
      ({ document }) => ({
        kind,
        content: document.content,
        updatedAt: document.updatedAt,
      }),
    ),
};
