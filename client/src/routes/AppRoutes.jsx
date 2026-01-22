import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router"
import { PublicRoutes } from "./PublicRoutes"

//rutas públicas
import {PublicLayout} from "../layouts/PublicLayout.jsx"


const HomePage = lazy(() => import("../pages/PublicPages/HomePage/HomePage"))
const About = lazy(() => import("../pages/PublicPages/About/About"))
const Contact = lazy(() => import("../pages/PublicPages/Contact/Contact"))
const Pharmacy = lazy(() => import("../pages/PublicPages/Pharmacy/Pharmacy"))
const Nutrition = lazy(() => import("../pages/PublicPages/Nutrition/Nutrition"))
const Grooming = lazy(() => import("../pages/PublicPages/Grooming/Grooming"))
const RegisterPage = lazy(() => import("../pages/AuthPages/RegisterPage/RegisterPage"))
const ErrorPage = lazy(() => import("../pages/PublicPages/ErrorPage/ErrorPage"))


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
          </Route>
        </Route>
        
            <Route path="*" element={<ErrorPage />} />
      </Routes>
      </Suspense>
    </BrowserRouter>  
  )
}
