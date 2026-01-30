import serviceDal from "./service.dal.js";
import petDal from "../pet/pet.dal.js";

class ServiceController {
   getServicesBySize = async (req, res) => {
      try {
        const { size_category } = req.query;

        const services = await serviceDal.getForSize(size_category);

        res.json({ services });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener servicios" });
      }
    };

    getServiceByPetId = async (req, res) => {
      try {
        const { petId } = req.params;
        const { user_id } = req;

        const petResult = await petDal.getOne(petId, user_id);
        const pet = petResult[0];

        if (!pet) {
          return res.status(404).json({ message: "Mascota no encontrada" });
        }

        const services = await serviceDal.getForSize(pet.size_category);

        res.json({ services });
      } catch (error) {
        console.log("ERROR REAL:", error);
        res.status(400).json({ message: "Error al obtener servicios por mascota" });
      }
    };

}

export default new ServiceController();