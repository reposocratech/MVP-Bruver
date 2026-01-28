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

  // 4) crea una mascota asociada al usuario logueado
  create = async (req, res) => {
    const { user_id } = req;

    try {
      // 5) sacamos datos del body 
      const { name_pet, description, specie, size_category, hair, medical_history } = req.body;

      // 5.1) validación mínima
      if (!name_pet || !specie || !size_category) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
      }

      // 5.2) data
      const data = {
        name_pet: name_pet.trim(),
        description: description?.trim() || null,
        specie,
        size_category,
        user_id,
        hair: hair?.trim() || null,
        medical_history: medical_history?.trim() || null,
      };

      // 6) insert a la bd
      const result = await petDal.create(data);

      res.status(201).json({ message: "creación correcta", result });
    } catch (error) {

      // 7) si falla algo mostramos el error
      console.log(error);
      res.status(500).json(error);
    }
  };

  // 8) realizamos el borrado lógico
  remove = async (req, res) => {
    const { user_id } = req;
    const { petId } = req.params;

    try {
      // 9) marcamos pet_is_deleted = 1
      const result = await petDal.softDelete(petId, user_id);

      res.status(200).json({ message: "borrado realizado", result });
    } 
    catch (error) 
    {
      // 10) si falla algo mostramos el error
      console.log(error);
      res.status(500).json(error);
    }
  };

  // 11) Traer 1 mascota por id  para su edición
  getOne = async (req, res) => {
    const { user_id } = req;
    const { petId } = req.params;

    try {
      const result = await petDal.getOne(petId, user_id);

      if (result.length === 0) {
        return res.status(404).json({ message: "Mascota no encontrada" });
      }

      res.status(200).json({ pet: result[0] });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  // 12) Editar mascota (actualiza BD)
  edit = async (req, res) => {
    const { user_id } = req;
    const { petId } = req.params;

    try {
      
      const { name_pet, description, specie, size_category, hair, medical_history } = req.body;

      if (!name_pet || !specie || !size_category) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
      }

      const data = {
        petId,
        userId: user_id,
        name_pet: name_pet.trim(),
        description: description?.trim() || null,
        specie,
        size_category,
        hair: hair?.trim() || null,
        medical_history: medical_history?.trim() || null,
      };

      await petDal.edit(data);

      // devolvemos la mascota actualizada
      const updated = await petDal.getOne(petId, user_id);
      res.status(200).json({ message: "edición correcta", pet: updated[0] });
    }
     catch (error) 
     {
      console.log(error);
      res.status(500).json(error);
    }
  };
}

export default new PetController();
