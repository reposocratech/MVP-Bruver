import { useState } from "react";
import { Button } from "react-bootstrap"
import { recoverySchema } from "../../../schemas/RecoverySchema";
import { fetchData } from "../../../helpers/axiosHelper";
import {ZodError} from "zod"

const initialValue = {
  email:""
}

const ForgotPassPage = () => {

  const [recovery, setRecovery] = useState(initialValue);
  const [valErr, setValErr] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const {name, value} = e.target;
    setRecovery({...recovery, [name]:value})
  } 

  const onSubmit = async () => {
      try {
        recoverySchema.parse(recovery);
        const res = await fetchData("user/forgotPassword", "POST", recovery)
      } catch (error) {
        if(error instanceof ZodError){
          const fieldsErrors = {};
          error.issues.forEach((elem)=>{
            fieldsErrors[elem.path[0]] = elem.message
          })
          setValErr(fieldsErrors);
          setErrorMsg("");
        }else{
          setErrorMsg(error.response?.data?.message);
          setValErr({})
        }
      }
    } 
  


  return (
    <>
      <h2>Recuperar contraseña</h2>
      <form>
        <label>Introduce tu e-mail:</label>
        <input
            name="email"
            value={recovery?.email}
            onChange={handleChange} 
            type="email" 
            placeholder="Introduce tu email"/>
            <p className="text-danger">{errorMsg}</p>
           {valErr?.email &&<p className="text-danger">{valErr.email}</p>}
        <Button onClick={onSubmit}>Enviar</Button>
      </form>
    </>
  )
}

export default ForgotPassPage

