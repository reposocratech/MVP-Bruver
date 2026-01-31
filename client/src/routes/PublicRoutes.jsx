import { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router'
import { AuthContext } from '../contexts/AuthContext/AuthContext';

export const PublicRoutes = () => {

  const {user} = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(()=>{
    if(user){
      if(user.type === 1) navigate("/admin");
      if(user.type === 2) navigate ("/worker/profile");
      if(user.type === 3) navigate ("/profile");
  }
}, [user])

  return (
    <>
        <Outlet />
    </>
  )
}
