import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import type { Exam, InsertExam } from "@shared/schema";

export function useExams(filters?: {
  search?: string;
  category?: string;
  organization?: string;
  status?: string;
}) {
  // Construct query string for filters
  const queryString = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryString.append(key, value);
    });
  }
  
  const path = `${api.exams.list.path}?${queryString.toString()}`;

  return useQuery({
    queryKey: [api.exams.list.path, filters],
    queryFn: async () => {
      const res = await fetch(path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch exams");
      return api.exams.list.responses[200].parse(await res.json());
    },
  });
}

export function useExam(id: number) {
  return useQuery({
    queryKey: [api.exams.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.exams.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch exam");
      return api.exams.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertExam) => {
      // Validate with input schema before sending
      const validated = api.exams.create.input.parse(data);
      const res = await fetch(api.exams.create.path, {
        method: api.exams.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create exam");
      return api.exams.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.exams.list.path] });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertExam>) => {
      const validated = api.exams.update.input.parse(data);
      const url = buildUrl(api.exams.update.path, { id });
      const res = await fetch(url, {
        method: api.exams.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update exam");
      return api.exams.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [api.exams.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.exams.get.path, id] });
    },
  });
}
