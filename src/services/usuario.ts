import { supabase } from '../supabase/config';

export interface Usuario {
  usuario_id: number;
  clerk_user_id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: 'CLIENTE' | 'REPARTIDOR' | 'ADMIN';
  activo: boolean;
  avatar_url?: string;
  provedor_auth: string;
  ultima_actividad?: string;
  fecha_registro: string;
  deleted_at?: string;
  deleted_by?: number;
  clientes?: {
    cliente_id: number;
    fecha_nacimiento?: string;
    puntos_acumulados: number;
  };
}

export const getUsuarios = async (rol?: string): Promise<Usuario[]> => {
  let query = supabase
    .from('usuarios')
    .select('*, clientes(cliente_id, fecha_nacimiento, puntos_acumulados)')
    .eq('activo', true);
  if (rol) {
    query = query.eq('rol', rol);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createUsuario = async (usuario: Omit<Usuario, 'usuario_id' | 'fecha_registro'>): Promise<Usuario> => {
  const { data, error } = await supabase.from('usuarios').insert([usuario]).select();
  if (error) throw error;
  return data[0];
};

export const updateUsuario = async (id: number, updates: Partial<Usuario>): Promise<Usuario> => {
  const { data, error } = await supabase.from('usuarios').update(updates).eq('usuario_id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteUsuario = async (usuario_id: number, deleted_by: number): Promise<void> => {
  const { error } = await supabase
    .from('usuarios')
    .update({
      activo: false,
      deleted_at: new Date().toISOString(),
      deleted_by,
    })
    .eq('usuario_id', usuario_id);
  if (error) throw error;
};