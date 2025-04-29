import { supabase } from '../supabase/config';

export interface Localidad {
    id: number;
    nombre: string;
    provincia?: { nombre: string };
}

export interface Direccion {
    id: number;
    tipo: string;
    calle: string;
    numero: string;
    localidad_id: number;
    activa: boolean;
    localidad?: Localidad;
    created_at?: string;
}

export const getDirecciones = async (): Promise<Direccion[]> => {
    const { data, error } = await supabase
        .from('direccion')
        .select('*, localidad(nombre, provincia(nombre))')
        .eq('activa', true);
    if (error) throw error;
    return data;
};

export const createDireccion = async (direccion: Omit<Direccion, 'id' | 'created_at'>): Promise<Direccion> => {
    const { data, error } = await supabase.from('direccion').insert([direccion]).select();
    if (error) throw error;
    return data[0];
};

export const updateDireccion = async (id: number, updates: Partial<Direccion>): Promise<Direccion> => {
    const { data, error } = await supabase.from('direccion').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
};

export const deleteDireccion = async (id: number): Promise<void> => {
    const { error } = await supabase.from('direccion').update({ activa: false }).eq('id', id);
    if (error) throw error;
};