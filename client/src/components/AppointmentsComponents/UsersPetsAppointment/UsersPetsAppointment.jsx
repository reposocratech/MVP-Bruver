import "./UsersPetsAppointment.css"
 
export const UsersPetsAppointment = ({ pets, setSelectedPet })=>{
  return (

    <div className="appointmentPetPage">
      <h2 className="appointmentPetTitle">Selecciona tu mascota</h2> 
      {!pets && <p>No hay mascotas disponibles.</p>}
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
                 <img
                  className="petPhoto"
                  src={`/img/defaultimg/IconDefaultPet.png`}
                  alt="Imagen de mascota por defecto"
                />
                )}
              </div>

              <div className="appointmentPetInfo">
                <h3>{elem.name_pet}</h3>

                <div className="appointmentPetActions">
                  <button
                  type="button"
                  onClick={() =>{
                    setSelectedPet(elem);
                  }}
                  className="selectPetBtn"
                >
                  SELECCIONAR
                </button>
                </div>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};