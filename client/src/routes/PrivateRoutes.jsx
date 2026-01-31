import { useEffect } from 'react';
import {Outlet, useNavigate} from 'react-router';

export const PrivateRoutes = ({user, requiredType}) => {

  const navigate = useNavigate()
  useEffect(()=>{
    if(user?.type !== requiredType) navigate("/");
  },[user])
  return (
    <>
        <Outlet />
    </>
  )
}
