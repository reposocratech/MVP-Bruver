/* import { useContext, useEffect } from 'react'; */
import { Outlet } from 'react-router'
import { AuthContext } from '../contexts/AuthContext/AuthContext';

export const PublicRoutes = () => {

 /*  const {user} = useContext(AuthContext)
  const navigate = useNavigate() */

  return (
    <>
        <Outlet />
    </>
  )
}
