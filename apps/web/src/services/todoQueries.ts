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

export function useToggleTodoMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      patchTodoRequest(id, { completed }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}
