import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { fetchData } from "../../helpers/axiosHelper";

export const AuthContextProvider = ({ children }) => {
  // Estado global del usuario logueado
  const [user, setUser] = useState(null);

  // Token JWT (sirve para autenticar peticiones al backend)
  const [token, setToken] = useState(null);

  // Mascotas del usuario logueado
  const [pets, setPets] = useState(null);

  useEffect(() => {
    // 1) Al arrancar la app (y tras F5), miramos si hay token guardado
    const tokenLS = localStorage.getItem("token");

    // Si existe token en localStorage, intentamos reconstruir la sesión
    if (tokenLS) {
      const fetchUser = async () => {
        try {
          // 2) Pedimos al backend los datos del usuario usando el token
          const resUser = await fetchData("user/userByToken", "GET", null, tokenLS);

          // 3) Guardamos todo en el contexto
          setToken(tokenLS);
          setUser(resUser.data.user);
          setPets(resUser.data.pets); 

        } catch (error) {
          console.log(error);

        }
      };

      fetchUser();
    }
  }, 
  []); 

  // para el cierre de sesión vacía estados y borra token guardado
  const logout = () => {
    setUser(null);
    setToken(null);
    setPets(null);
    localStorage.removeItem("token");
  };

  // 5) Compartimos los estados y setters con toda la app
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        pets,
        setPets,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
