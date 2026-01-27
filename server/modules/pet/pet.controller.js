import petDal from "./pet.dal.js";

class PetController {
  // 1) devuelve las mascotas del usuario logueado
  getMine = async (req, res) => {
    
    const { user_id } = req;

    try {
      // 2) pedimos al DAL las mascotas del usuario
      const result = await petDal.getMine(user_id);
      res.status(200).json({ pets: result });

    } 
    catch (error) 
    {
      // 3) si falla, devolvemos error 500
      console.log(error);
      res.status(500).json(error);
    }
  };

  // 4 crea una mascota asociada al usuario logueado
  create = async (req, res) => {

    const { user_id } = req;

    try {
      // 5) sacamos datos del body
      const { name_pet, description, specie, size_category } = req.body;

      // 5.1) validación mínima
      if (!name_pet || !specie || !size_category) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
      }

      // 5.2) data + token
      const data = {
        name_pet: name_pet.trim(),
        description: description?.trim() || null,
        specie,
        size_category,
        user_id,
      };

      // 6 ) insert a la bd
      const result = await petDal.create(data);

      res.status(201).json({ message: "creación ok", result });

    } catch (error) {
      // 7 si falla algo mostramos el error
      console.log(error);
      res.status(500).json(error);
    }
  };

  // 8 realizamos el borrado logico
  remove = async (req, res) => {
    
    const { user_id } = req;
    const { petId } = req.params;

    try {
      //9 marcamos pet_is_deleted = 1  si es uno la mascota a sido eliminada
      const result = await petDal.softDelete(petId, user_id);

      res.status(200).json({ message: "borrado ok", result });

    } 
    catch (error)
    {
      // 10 si falla algo mostramos el error
      console.log(error);
      res.status(500).json(error);
    }
  };
}

export default new PetController();
