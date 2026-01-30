import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../helpers/axiosHelper";
import "./UsersPetsAppointment.css"
 
export const UsersPetsAppointment = () => {
  // 1) Traemos del contexto el array de mascotas, token y el setter global
  const { pets, token, setPets } = useContext(AuthContext);

  const navigate = useNavigate();
 
  // 2) Al montar el componente, si hay token, pedimos las mascotas al backend
  useEffect(() => {
 
    const getMyPets = async () => {
 
      try {
        const res = await fetchData("pet/mine", "GET", null, token);
        setPets(res.data.pets);
      }
      catch (error)
       {
        console.log(error);
      }
    };
 
    if (token) getMyPets();
 
  },
   []);
  
 
  // 4) Pintamos la galería de mascotas
  return (

    <div className="appointmentPetPage">
      <h2 className="appointmentPetTitle">Selecciona tu mascota</h2>

      <div className="appointmentPetGrid row g-4 justify-content-center">
        {pets?.map((elem) => (
          <div className="col-12 col-sm-6 col-lg-4" key={elem.pet_id}>
            <div className="appointmentPetCard">

              <div className="appointmentPetImage">
                {elem.picture_pet ? (
                  <img
                    src={`http://localhost:4000/images/pets/${elem.picture_pet}`}
                    alt={elem.name_pet}
                  />
                ) : (
                  <span>IMG</span>
                )}
              </div>

              <div className="appointmentPetInfo">
                <h3>{elem.name_pet}</h3>

                <div className="appointmentPetActions">
                  <button
                  type="button"
                  onClick={() => navigate(`/selectservices/${elem.pet_id}`)}
                  className="selectPetBtn"
                >
                  SELECCIONAR
                </button>
                </div>
              </div>

            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="selectPetBackBtn"
        >
          VOLVER
        </button>
      </div>
    </div>
  );
};