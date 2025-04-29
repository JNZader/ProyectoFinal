import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario, Usuario } from '../services/usuario';

export const useUsuarios = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<Usuario[]>({
        queryKey: ['usuarios'],
        queryFn: getUsuarios,
    });

    const createMutation = useMutation({
        mutationFn: createUsuario,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<Usuario> }) => updateUsuario(id, updates),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUsuario,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
    });

    return {
        usuarios: data || [],
        isLoading,
        error,
        createUsuario: createMutation.mutate,
        updateUsuario: updateMutation.mutate,
        deleteUsuario: deleteMutation.mutate,
    };
};