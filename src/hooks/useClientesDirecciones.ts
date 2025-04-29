import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClientesDirecciones, createClienteDireccion, updateClienteDireccion, deleteClienteDireccion, ClienteDireccion } from '../services/clienteDireccion';

export const useClientesDirecciones = (clienteId?: number) => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<ClienteDireccion[]>({
        queryKey: ['clientes_direcciones', clienteId],
        queryFn: () => getClientesDirecciones(clienteId),
    });

    const createMutation = useMutation({
        mutationFn: createClienteDireccion,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes_direcciones'] }),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<ClienteDireccion> }) => updateClienteDireccion(id, updates),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes_direcciones'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteClienteDireccion,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clientes_direcciones'] }),
    });

    return {
        clientesDirecciones: data || [],
        isLoading,
        error,
        createClienteDireccion: createMutation.mutate,
        updateClienteDireccion: updateMutation.mutate,
        deleteClienteDireccion: deleteMutation.mutate,
    };
};
