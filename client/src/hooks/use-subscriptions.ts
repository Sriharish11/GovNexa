import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertSubscription } from "@shared/schema";

export function useSubscriptions() {
  return useQuery({
    queryKey: [api.subscriptions.list.path],
    queryFn: async () => {
      const res = await fetch(api.subscriptions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      return api.subscriptions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<InsertSubscription, "userId">) => {
      const validated = api.subscriptions.create.input.parse(data);
      const res = await fetch(api.subscriptions.create.path, {
        method: api.subscriptions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create subscription");
      return api.subscriptions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.subscriptions.list.path] });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.subscriptions.delete.path, { id });
      const res = await fetch(url, {
        method: api.subscriptions.delete.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete subscription");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.subscriptions.list.path] });
    },
  });
}
