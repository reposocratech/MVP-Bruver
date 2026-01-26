import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router"
import { PublicRoutes } from "./PublicRoutes"
import { PrivateRoutes } from "./PrivateRoutes"



//rutas públicas
import {PublicLayout} from "../layouts/PublicLayout.jsx"
const HomePage = lazy(() => import("../pages/PublicPages/HomePage/HomePage"))
const About = lazy(() => import("../pages/PublicPages/About/About"))
const Contact = lazy(() => import("../pages/PublicPages/Contact/Contact"))
const Pharmacy = lazy(() => import("../pages/PublicPages/Pharmacy/Pharmacy"))
const Nutrition = lazy(() => import("../pages/PublicPages/Nutrition/Nutrition"))
const Grooming = lazy(() => import("../pages/PublicPages/Grooming/Grooming"))
const RegisterPage = lazy(() => import("../pages/AuthPages/RegisterPage/RegisterPage"))
const LoginPage = lazy(() => import("../pages/AuthPages/LoginPage/LoginPage"))
const ErrorPage = lazy(() => import("../pages/PublicPages/ErrorPage/ErrorPage"))

/* RUTAS PRIVADAS */
import { ClientLayout } from "../layouts/ClientLayout.jsx"
const ClientProfile = lazy(() => import("../pages/ClientPages/ClientProfile/ProfileClient/ClientProfilePage.jsx"))
const SelectPet = lazy(() => import("../pages/ClientPages/AppointmentPages/SelectPet/SelectPet.jsx"))
const SelectCat = lazy(() => import("../pages/ClientPages/AppointmentPages/SelectCat/SelectCat.jsx"))
const SelectServices = lazy(() => import("../pages/ClientPages/AppointmentPages/SelectServices/SelectServices.jsx"))
const AddPet  = lazy(() => import("../pages/ClientPages/ClientProfile/AddPet/AddPet.jsx"))

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<h2>Cargando...</h2>}>
      <Routes>
        {/* rutas públicas */}
        <Route element={<PublicRoutes />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About/>} />
            <Route path="/pharmacy" element={<Pharmacy/>} />
            <Route path="/nutrition" element={<Nutrition/>} />
            <Route path="/grooming" element={<Grooming />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            
          </Route>
        </Route>

          {/* Rutas privadas usuario */}
          <Route element={<PrivateRoutes />}>
            <Route element={<ClientLayout />}>
               <Route path="/profile" element={<ClientProfile />} />
               <Route path="/selectpet" element={<SelectPet />} />
               <Route path="/selectcat" element={<SelectCat />} />
               <Route path="/selectservices" element={<SelectServices />} />
               <Route path="/addpet" element={<AddPet />} />
            </Route>
          </Route>

        
            <Route path="*" element={<ErrorPage />} />
      </Routes>
      </Suspense>
    </BrowserRouter>  
  )
}
