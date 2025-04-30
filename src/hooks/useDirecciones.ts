import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDirecciones, createDireccion, updateDireccion, deleteDireccion, Direccion } from '../services/direccion';

export const useDirecciones = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Direccion[]>({
    queryKey: ['direcciones'],
    queryFn: getDirecciones,
  });

  const createMutation = useMutation({
    mutationFn: createDireccion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direcciones'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Direccion> }) => updateDireccion(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direcciones'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDireccion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['direcciones'] }),
  });

  return {
    direcciones: data || [],
    isLoading,
    error,
    createDireccion: createMutation.mutate,
    updateDireccion: updateMutation.mutate,
    deleteDireccion: deleteMutation.mutate,
  };
};