import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { fetchData } from "../../helpers/axiosHelper";

export const AuthContextProvider = ({ children }) => {


  // Estado global del usuario logueado
  const [user, setUser] = useState();

  // Token JWT (sirve para autenticar peticiones al backend)
  const [token, setToken] = useState();

  // Mascotas del usuario logueado
  const [pets, setPets] = useState();

  useEffect(() => {
    // 1) Al arrancar la app (y tras F5), miramos si hay token guardado
    const tokenLS = localStorage.getItem("token");

    const fetchUser = async () => {
      try {
        // Si existe token en localStorage, intentamos reconstruir la sesión
        if (tokenLS) {
          // 2) Pedimos al backend los datos del usuario usando el token
          const resUser = await fetchData("user/userByToken", "GET", null, tokenLS);

          // 3) Guardamos todo en el contexto
          setToken(tokenLS);
          setUser(resUser.data.user);
          setPets(resUser.data.pets);
        } else {
          setUser();
          setToken();
          setPets();
        }
      } catch (error) {
        console.log(error);
        setUser();
        setToken();
        setPets();
      }
    };

    fetchUser();
  }, 
  []); 

  // para el cierre de sesión vacía estados y borra token guardado
  //Setear el usuario con el InitialValue 
  //Setear el token
  //Borrar el token de localStorage
  const logout = () => {
    setUser();
    setToken();
    setPets();
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
