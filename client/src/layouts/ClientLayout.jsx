import { Outlet } from 'react-router'
import { NavbarLogin } from '../components/NavbarLogin/NavbarLogin'
import { FooterPrivate } from '../components/Footer/FooterPrivate/FooterPrivate';

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
           <FooterPrivate />
      </footer>
    </>  
)
}
