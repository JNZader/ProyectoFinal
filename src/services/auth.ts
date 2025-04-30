import { useAuth, useUser } from "@clerk/clerk-react";
import { supabase } from "../supabase/config";
export const useAuthService = () => {
  const { isLoaded } = useAuth();
  const { user } = useUser();
  const syncUserWithSupabase = async () => {
    if (!isLoaded || !user) return;
    const { data, error } = await supabase
      .from('usuario')
      .upsert({
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        nombre: user.fullName || 'Usuario',
      });
    if (error) throw error;
    return data;
  };
  return { user, isLoaded, syncUserWithSupabase };
};