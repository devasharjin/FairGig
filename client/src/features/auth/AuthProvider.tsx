import { Outlet } from "react-router-dom"
import { useBootstrapAuth } from "./useBootstrapAuth"


const AuthProvider = () => {
    useBootstrapAuth()
  return <Outlet/>

}

export default AuthProvider