import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import {PublicRoutes} from "./PublicRoutes"

//rutas públicas
import {PublicLayout} from "../layouts/PublicLayout/PublicLayout"
const HomePage = lazy(() => import("../pages/PublicPages/HomePage/HomePage"))

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<h2>Loading...</h2>}>
      <Routes>
        {/* rutas públicas */}
        <Route element={<PublicRoutes />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
        </Route>
        
      </Routes>
      </Suspense>
    </BrowserRouter>  
  )
}
