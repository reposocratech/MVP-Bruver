import { Outlet } from "react-router";
import { NavbarPublic } from "../components/Navbar/NavbarPublic";
import { FooterPublic } from "../components/Footer/FooterPublic";


export const PublicLayout = () => {
  return (
    <>
      <header>
        <NavbarPublic />
      </header>
      <main>
         <Outlet />
      </main>
      <footer>
         <FooterPublic/>
      </footer>
    </>
    
  )
}
