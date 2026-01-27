import { Outlet } from 'react-router'
import { NavbarLogin } from '../components/NavbarLogin/NavbarLogin'
import { FooterPublic } from "../components/Footer/FooterPublic";

export const WorkerLayout = () => {
  return (
    <>
      <header>
          <NavbarLogin/>
      </header>  
      <main>
          <Outlet/>
      </main>
      <footer>
           <FooterPublic />
      </footer>
    </>  
)
}
