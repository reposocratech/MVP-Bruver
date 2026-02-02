
import { Navigate, Outlet } from 'react-router';

export const PrivateRoutes = ({ user, requiredType }) => {
  // Esperamos a que el user se resuelva (undefined = cargando)
  if (user === undefined) return null;

  if (!user || user?.type !== requiredType) return <Navigate to="/"/>;

  return <Outlet />;
}
