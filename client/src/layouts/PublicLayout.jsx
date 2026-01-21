import { Outlet } from "react-router-dom";
import { NavbarPublic } from "../components/Navbar/NavbarPublic"

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
         <h2>Footer Home</h2>
      </footer>
    </>
    
  )
}
