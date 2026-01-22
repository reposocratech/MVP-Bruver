import './App.css'

import { AuthContextProvider } from './contexts/AuthContext/AuthContextProvider'
import { AppRoutes } from './routes/AppRoutes'
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  

  return (
    <AuthContextProvider>
        <AppRoutes />
    </AuthContextProvider>

  )
}

export default App
