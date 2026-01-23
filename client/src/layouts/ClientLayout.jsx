import { Outlet } from 'react-router'
import { NavbarLogin } from '../components/NavbarLogin/NavbarLogin'

export const ClientLayout = () => {
  return (
    <>
      <header>
          <NavbarLogin/>
      </header>  
      <main>
          <Outlet/>
      </main>
      <footer>
           <h2>footer cliente</h2>
      </footer>
    </>  
)
}
