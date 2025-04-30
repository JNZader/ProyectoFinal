import { supabase } from '../supabase/config';

export interface Localidad {
    id: number;
    nombre: string;
    provincia?: { nombre: string };
}

export interface Direccion {
    direccion_id: number;
    tipo: 'CLIENTE' | 'ALMACEN' | 'PROVEEDOR' | 'REPARTIDOR' | 'PUNTO_RETIRO';
    calle: string;
    numero: number;
    departamento?: string;
    localidad_id: number;
    activa: boolean;
    localidad?: Localidad;
    created_at?: string;
}

export const getDirecciones = async (): Promise<Direccion[]> => {
    const { data, error } = await supabase
        .from('direcciones')
        .select('*, localidad(nombre, provincia(nombre))')
        .eq('activa', true);
    if (error) throw error;
    return data;
};

export const createDireccion = async (direccion: Omit<Direccion, 'direccion_id' | 'created_at'>): Promise<Direccion> => {
    const { data, error } = await supabase.from('direcciones').insert([direccion]).select();
    if (error) throw error;
    return data[0];
};

export const updateDireccion = async (id: number, updates: Partial<Direccion>): Promise<Direccion> => {
    const { data, error } = await supabase.from('direcciones').update(updates).eq('direccion_id', id).select();
    if (error) throw error;
    return data[0];
};

export const deleteDireccion = async (id: number): Promise<void> => {
    const { error } = await supabase.from('direcciones').update({ activa: false }).eq('direccion_id', id);
    if (error) throw error;
};