import type { TodoPatch } from "@todo/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodoRequest, listTodosRequest, patchTodoRequest } from "./apiClient.js";

export const todosQueryKey = ["todos"] as const;

export function useTodosQuery() {
  return useQuery({
    queryKey: todosQueryKey,
    queryFn: listTodosRequest,
  });
}

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => createTodoRequest({ text }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}

export function usePatchTodoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: TodoPatch }) =>
      patchTodoRequest(id, patch),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}
