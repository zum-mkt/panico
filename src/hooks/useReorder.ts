import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

// Troca a posição de dois itens adjacentes — usado nas listas administráveis
// que precisam de ordenação manual (ver 03-ADMIN_CMS.md > Recursos obrigatórios).
export function useReorder<T extends { id: string; position: number }>(
  crud: { update: (id: string, payload: Partial<T>) => Promise<T> },
  queryKey: QueryKey,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ a, b }: { a: T; b: T }) => {
      await crud.update(a.id, { position: b.position } as Partial<T>);
      await crud.update(b.id, { position: a.position } as Partial<T>);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
