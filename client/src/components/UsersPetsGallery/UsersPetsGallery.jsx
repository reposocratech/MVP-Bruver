import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { fetchData } from "../../helpers/axiosHelper";
import "./UsersPetsGallery.css";

export const UsersPetsGallery = () => {
  // 1) Traemos del contexto el array de mascotas, token y el setter global
  const { pets, token, setPets } = useContext(AuthContext);

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

  }, []);

  // 3) Borrar mascota en BD y actualizar el array global quitando esa mascota
  const delPet = async (pet_id, pet_name) => {

    try {
    // forma rapida de verificar el borrao
      if (window.confirm(`¿Seguro que quieres eliminar a ${pet_name}?`)) {
        // 3.1) Borramos en backend
        let res = await fetchData(`pet/${pet_id}`, "DELETE", null, token);
        console.log(res);

        // 3.2) Actualizamos el array en el contexto

        setPets(pets.filter((elem) => elem.pet_id !== pet_id));
      }
    } 
    catch (error) 
    {
      console.log(error);
    }
  };

  // 4) Pintamos la galería de mascotas
  return (
    <div>

      {pets?.map((elem) => {
        return (
          <div className="petCard" key={elem.pet_id}>
            <div className="petImage">
              {elem.picture_pet ? (
                <img
                  src={`http://localhost:4000/images/pets/${elem.picture_pet}`}
                  alt={elem.name_pet}
                />
              ) : (
                <span>IMG</span>
              )}
            </div>
              {/* inform de la card */}
            <div className="petInfo">
              <h3>{elem.name_pet}</h3>

              <div className="petActions">
                <button className="petBtn" type="button">
                  EDITAR
                </button>

                <button
                  className="petBtn danger"
                  type="button"
                  onClick={() => delPet(elem.pet_id, elem.name_pet)}
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
