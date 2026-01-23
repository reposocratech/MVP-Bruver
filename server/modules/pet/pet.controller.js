import petDal from "./pet.dal.js";

class PetController {
  getMine = async (req, res) => {
    try {
      let userId = req.user_id;

      let result = await petDal.getMine(userId);

      res.status(200).json({
        ok: true,
        pets: result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  remove = async (req, res) => {
    try {
      let userId = req.user_id;
      let { petId } = req.params;

      let result = await petDal.softDelete(petId, userId);

      res.status(200).json({
        ok: true,
        result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };
}

export default new PetController();
