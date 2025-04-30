import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientes, createCliente, updateCliente, deleteCliente, Cliente } from '../services/cliente';

export const useClientes = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<Cliente[]>({
        queryKey: ['clientes'],
        queryFn: getClientes,
    });

    const createMutation = useMutation({
        mutationFn: createCliente,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
            queryClient.invalidateQueries({ queryKey: ['usuarios'] }); // Invalida también la caché de usuarios
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<Cliente> }) => 
            updateCliente(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: ({ id, deleted_by }: { id: number; deleted_by: number }) => 
            deleteCliente(id, deleted_by),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
        },
    });

    return {
        clientes: data || [],
        isLoading,
        error,
        createCliente: createMutation.mutate,
        updateCliente: updateMutation.mutate,
        deleteCliente: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};