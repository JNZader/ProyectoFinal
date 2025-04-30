import { supabase } from '../supabase/config';

export interface Cliente {
    cliente_id: number;
    usuario_id: number;
    fecha_nacimiento?: string;
    fecha_registro: string;
    acepta_email: boolean;
    acepta_sms: boolean;
    preferencias_comunicacion?: string;
    puntos_acumulados: number;
    created_at?: string;
    usuarios?: {
        nombre: string;
        email: string;
        telefono?: string;
        rol: string;
        activo: boolean;
    };
}

export const getClientes = async (): Promise<Cliente[]> => {
    const { data, error } = await supabase
        .from('clientes')
        .select('*, usuarios(nombre, email, telefono, rol, activo)');
    if (error) throw error;
    return data;
};

export const createCliente = async (cliente: Omit<Cliente, 'cliente_id' | 'created_at'>): Promise<Cliente> => {
    const { data, error } = await supabase
        .from('clientes')
        .insert([cliente])
        .select('*, usuarios(nombre, email, telefono, rol, activo)');
    if (error) throw error;
    return data[0];
};

export const updateCliente = async (id: number, updates: Partial<Cliente>): Promise<Cliente> => {
    const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('cliente_id', id)
        .select('*, usuarios(nombre, email, telefono, rol, activo)');
    if (error) throw error;
    return data[0];
};

export const deleteCliente = async (id: number, deleted_by: number): Promise<void> => {
    // Primero obtenemos el usuario_id asociado al cliente
    const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('usuario_id')
        .eq('cliente_id', id)
        .single();
    
    if (clienteError) throw clienteError;
    if (!clienteData) throw new Error('Cliente no encontrado');

    // Actualizamos el usuario para marcarlo como inactivo
    const { error: usuarioError } = await supabase
        .from('usuarios')
        .update({ 
            activo: false, 
            deleted_at: new Date().toISOString(), 
            deleted_by 
        })
        .eq('usuario_id', clienteData.usuario_id);

    if (usuarioError) throw usuarioError;
};