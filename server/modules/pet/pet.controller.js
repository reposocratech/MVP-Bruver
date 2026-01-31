import petDal from "./pet.dal.js";

class PetController {
  getMine = async (req, res) => {
    const { user_id } = req;

    try {

      let result = await petDal.getMine(user_id);
      res.status(200).json({ pets: result });

    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  create = async (req, res) => {
    try {
      const { user_id } = req;
      const { name_pet, description, specie, size_category, hair, medical_history } = req.body;

      if (!name_pet || !specie || !size_category) {
        res.status(400).json({ message: "Faltan campos obligatorios" });

      } else {
        let data = {
          name_pet,
          description,
          specie,
          size_category,
          hair,
          medical_history,
          user_id,
        };

        let result = await petDal.create(data);
        res.status(201).json({ message: "creación ok", result });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  /* borrado */
  remove = async (req, res) => {
    const { petId } = req.params;
    const { user_id } = req;

    try {
      await petDal.softDelete(petId, user_id);
      res.status(204).json({ message: "borrado ok" });

    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  getOne = async (req, res) => {
    const { petId } = req.params;
    const { user_id } = req;

    try {
      let result = await petDal.getOne(petId, user_id);

      if (result.length === 0) {
        res.status(404).json({ message: "Mascota no encontrada" });
      } else {
        res.status(200).json(result[0]);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  /* edit */
  edit = async (req, res) => {
    const { petId } = req.params;
    const { user_id } = req;

    try {
      const { name_pet, description, specie, size_category, hair, medical_history } = JSON.parse(req.body.editPet);
      if (!name_pet || !specie || !size_category) {
        res.status(400).json({ message: "Faltan campos obligatorios" });

        
      } else {
        
        let values = [name_pet, description, specie, size_category, hair, medical_history, petId, user_id]

        if(req.file) {
        values = [name_pet, description, specie, size_category, hair, medical_history, req.file.filename, petId, user_id];
      }
        await petDal.edit(values, !!req.file);

        let updated = await petDal.getOne(petId, user_id);
        res.status(200).json({ message: "edición ok", pet: updated[0] });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };
}

export default new PetController();
