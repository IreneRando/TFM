import { useState } from "react";
import {loginUser} from '../Services/supabaseService'

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (correo: string, contrasena: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(correo, contrasena)
      localStorage.setItem('user', JSON.stringify(user));
      return user
     
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;