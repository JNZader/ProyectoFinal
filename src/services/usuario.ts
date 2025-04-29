import { supabase } from '../supabase/config';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  activo: boolean;
  created_at?: string;
}

export const getUsuarios = async (): Promise<Usuario[]> => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*, clientes(cliente_id, fecha_nacimiento, puntos_acumulados)')
    .eq('rol', 'CLIENTE')
    .eq('activo', true);
  if (error) throw error;
  return data;
};

export const createUsuario = async (usuario: Omit<Usuario, 'id' | 'created_at'>): Promise<Usuario> => {
  const { data, error } = await supabase.from('usuario').insert([usuario]).select();
  if (error) throw error;
  return data[0];
};

export const updateUsuario = async (id: number, updates: Partial<Usuario>): Promise<Usuario> => {
  const { data, error } = await supabase.from('usuario').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteUsuario = async (id: number): Promise<void> => {
  const { error } = await supabase.from('usuario').update({ activo: false }).eq('id', id);
  if (error) throw error;
};