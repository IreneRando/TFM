import { useState } from "react";
import { users } from "../Users";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // Simula un retardo de 1 segundo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const found = users.find(
        (u) => u.email === email && u.password === password,
      );
      if (!found) {
        throw new Error("Credenciales inválidas");
      }
      return found;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;