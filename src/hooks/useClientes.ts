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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes'] }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<Cliente> }) => updateCliente(id, updates),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCliente,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes'] }),
    });

    return {
        clientes: data || [],
        isLoading,
        error,
        createCliente: createMutation.mutate,
        updateCliente: updateMutation.mutate,
        deleteCliente: deleteMutation.mutate,
    };
};