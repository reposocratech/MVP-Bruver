import { useState } from 'react';
import {AuthContext} from './AuthContext'

export const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState();
  const [token, setToken] = useState();

  console.log("user global", user);
  console.log("token global", token);
  

  return (
    <AuthContext.Provider value={{user, setUser, token, setToken}}>
        {children}
    </AuthContext.Provider> 
  )
}
