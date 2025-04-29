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
}

export const getClientes = async (): Promise<Cliente[]> => {
    const { data, error } = await supabase
        .from('clientes')
        .select('*, usuarios(nombre, email, telefono, rol, activo)');
    if (error) throw error;
    return data;
};

export const createCliente = async (cliente: Omit<Cliente, 'cliente_id' | 'created_at'>): Promise<Cliente> => {
    const { data, error } = await supabase.from('clientes').insert([cliente]).select();
    if (error) throw error;
    return data[0];
};

export const updateCliente = async (id: number, updates: Partial<Cliente>): Promise<Cliente> => {
    const { data, error } = await supabase.from('clientes').update(updates).eq('cliente_id', id).select();
    if (error) throw error;
    return data[0];
};

export const deleteCliente = async (id: number): Promise<void> => {
    const { error } = await supabase.from('clientes').delete().eq('cliente_id', id);
    if (error) throw error;
};