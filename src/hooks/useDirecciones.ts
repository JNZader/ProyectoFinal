import { supabase } from '../supabase/config';
import { Direccion } from '../services/direccion';

export interface ClienteDireccion {
    cliente_direccion_id: number;
    cliente_id: number; 
    direccion_id: number;
    principal: boolean;
    created_at?: string;
    direccion?: Direccion;
  }

export const getClientesDirecciones = async (clienteId?: number): Promise<ClienteDireccion[]> => {
    let query = supabase
      .from('clientes_direcciones')
      .select('*, direccion(*, localidad(nombre, provincia(nombre)))');
    if (clienteId) {
      query = query.eq('cliente_id', clienteId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

export const createClienteDireccion = async (clienteDireccion: Omit<ClienteDireccion, 'cliente_direccion_id' | 'created_at'>): Promise<ClienteDireccion> => {
    const { data, error } = await supabase.from('clientes_direcciones').insert([clienteDireccion]).select();
    if (error) throw error;
    return data[0];
};

export const updateClienteDireccion = async (id: number, updates: Partial<ClienteDireccion>): Promise<ClienteDireccion> => {
    const { data, error } = await supabase.from('clientes_direcciones').update(updates).eq('cliente_direccion_id', id).select();
    if (error) throw error;
    return data[0];
};

export const deleteClienteDireccion = async (id: number): Promise<void> => {
    const { error } = await supabase.from('clientes_direcciones').delete().eq('cliente_direccion_id', id);
    if (error) throw error;
};