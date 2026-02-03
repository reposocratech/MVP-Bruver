import { Outlet } from "react-router";
import { useContext } from "react";
import { NavbarPublic } from "../components/Navbar/NavbarPublic";
import { NavbarLogin } from "../components/NavbarLogin/NavbarLogin";
import { FooterPublic } from "../components/Footer/FooterPublic/FooterPublic";
import { FooterPrivate } from "../components/Footer/FooterPrivate/FooterPrivate";
import { AuthContext } from "../contexts/AuthContext/AuthContext";

export const PublicLayout = () => {
  const { user } = useContext(AuthContext);
  return (
    <>
      <header>
        {user ? <NavbarLogin /> : <NavbarPublic />}
      </header>
      <main>
         <Outlet />
      </main>
      <footer>
        {user ? <FooterPrivate /> : <FooterPublic />}
      </footer>
    </>
    
  )
}
