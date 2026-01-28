import { BrowserRouter, Routes, Route } from "react-router"
import { lazy, Suspense } from "react"
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
const ForgotPassPage = lazy(() => import("../pages/AuthPages/ForgotPassPage/ForgotPassPage"))
const ErrorPage = lazy(() => import("../pages/PublicPages/ErrorPage/ErrorPage"))


/* RUTAS PRIVADAS USUARIO */
import { ClientLayout } from "../layouts/ClientLayout.jsx"

const SelectPet = lazy(() => import("../pages/ClientPages/AppointmentPages/SelectPet/SelectPet.jsx"))
const SelectCat = lazy(() => import("../pages/ClientPages/AppointmentPages/SelectCat/SelectCat.jsx"))
const ClientProfile = lazy(() => import("../pages/ClientPages/ClientProfile/ProfileClient/ClientProfilePage.jsx"))
const SelectServices = lazy(() => import("../pages/ClientPages/AppointmentPages/SelectServices/SelectServices.jsx"))
const EditPet = lazy(() => import("../pages/ClientPages/ClientProfile/EditPet/EditPet.jsx"))

const AddPet  = lazy(() => import("../pages/ClientPages/ClientProfile/AddPet/AddPet.jsx"))
const SelectDate = lazy(() => import("../pages/ClientPages/AppointmentPages/SelectDate/SelectDate.jsx"))


/* RUTAS PRIVADAS WORKER */
import { WorkerLayout } from "../layouts/WorkerLayout.jsx"
const Worker = lazy(() => import("../pages/WorkerPages/Worker.jsx"))
const WorkerProfile = lazy(() => import("../pages/WorkerPages/WorkerProfile/WorkerProfile.jsx"))

/* RUTAS PRIVADAS ADMIN */
import { AdminLayout } from "../layouts/AdminLayout.jsx"
const AdminManage = lazy(() =>import("../pages/AdminPages/AdminManage/AdminManage.jsx"));
const AdminProfile = lazy(()=> import("../pages/AdminPages/AdminProfile/AdminProfile.jsx"));
const AdminAppointments = lazy(() => import("../pages/AdminPages/AdminAppointments/AdminAppointments.jsx"));
const AdminWorkingHours = lazy(() => import("../pages/AdminPages/AdminWorkingHours/AdminWorkingHours.jsx"))
const GeneralCalendarPage = lazy(()=>import("../pages/AdminPages/GeneralCalendarPage/GeneralCalendarPage.jsx") )



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
            <Route path="/recoveryPass" element={<ForgotPassPage />} />
          </Route>
        </Route>

          {/* Rutas privadas usuario */}
          <Route element={<PrivateRoutes />}>
            <Route element={<ClientLayout />}>
               <Route path="/profile" element={<ClientProfile />} />
               <Route path="/selectpet" element={<SelectPet />} />
               <Route path="/selectcat" element={<SelectCat />} />
               <Route path="/profile/edit-pet" element={<EditPet />} /> 
               <Route path="/addpet" element={<AddPet />} />
               <Route path="/selectservices" element={<SelectServices />} /> 
               <Route path="/selectdate" element={<SelectDate />} /> 
            </Route>
          </Route>

          {/* Rutas privadas trabajador */}
          <Route element={<PrivateRoutes/>}>
                <Route element={<WorkerLayout/>}>
                   <Route path="/worker" element={<Worker />} /> 
                   <Route path="worker/profile" element={<WorkerProfile />} />
                </Route>    
          </Route>


          {/* Rutas privadas de admin */}
          <Route element={<PrivateRoutes />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminProfile />} />
              <Route path="/admin/manage" element={<AdminManage />}/>
              <Route path="/admin/general" element={<GeneralCalendarPage/>} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/workinghours" element={<AdminWorkingHours />} />
            </Route>
          </Route>

            <Route path="*" element={<ErrorPage />} />
      </Routes>
      </Suspense>
    </BrowserRouter>  
  )
}
