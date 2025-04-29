import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';

// Configuración básica para uso no autenticado
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cliente base
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Función para obtener cliente autenticado
export const useAuthenticatedSupabase = () => {
  const { getToken } = useAuth();

  const getAuthenticatedSupabase = async () => {
    try {
      const token = await getToken({ template: 'supabase' });

      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    } catch (error) {
      console.error('Error al autenticar con Supabase:', error);
      throw error;
    }
  };

  return { getAuthenticatedSupabase };
};

// Cliente para operaciones administrativas (usar con precaución)
export const supabaseAdmin = createClient(
  supabaseUrl,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

export default supabase;