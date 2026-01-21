import { z } from 'zod';
import { insertExamSchema, exams, subscriptions, insertSubscriptionSchema, notifications } from './schema';

// Shared error schemas
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  exams: {
    list: {
      method: 'GET' as const,
      path: '/api/exams',
      input: z.object({
        search: z.string().optional(),
        category: z.string().optional(),
        organization: z.string().optional(),
        status: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof exams.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/exams/:id',
      responses: {
        200: z.custom<typeof exams.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/exams',
      input: insertExamSchema,
      responses: {
        201: z.custom<typeof exams.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/exams/:id',
      input: insertExamSchema.partial(),
      responses: {
        200: z.custom<typeof exams.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  subscriptions: {
    list: {
      method: 'GET' as const,
      path: '/api/subscriptions',
      responses: {
        200: z.array(z.custom<typeof subscriptions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/subscriptions',
      input: insertSubscriptionSchema.omit({ userId: true }), // UserId inferred from session
      responses: {
        201: z.custom<typeof subscriptions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/subscriptions/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications',
      responses: {
        200: z.array(z.custom<typeof notifications.$inferSelect>()),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type Exam = typeof exams.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
