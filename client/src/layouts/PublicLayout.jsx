import { Outlet } from "react-router";
import { NavbarPublic } from "../components/Navbar/NavbarPublic";
import { FooterPublic } from "../components/Footer/FooterPublic";
import { NavbarLogin } from "../components/NavbarLogin/NavbarLogin";


export const PublicLayout = () => {
  return (
    <>
      <header>
        <NavbarPublic />
        <br /><br />
        <NavbarLogin />
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
