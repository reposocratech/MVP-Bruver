import workerDal from "./worker.dal.js";
import userDal from "../user/user.dal.js";

class WorkerController {
  searchClients = async (req, res) => {
    try {
      const { user_id } = req;

      const me = await userDal.userByToken(user_id);
      if (!me || me.length === 0) {
        return res.status(401).json({ message: "No autorizado" });
      }

      if (me[0].type !== 1 && me[0].type !== 2) {
        return res.status(403).json({ message: "No autorizado" });
      }

      const { search } = req.query;
      const result = await workerDal.searchClients(search);

      res.status(200).json({ message: "ok", result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al buscar clientes" });
    }
  };

  getClientPets = async (req, res) => {
    try {
      const { user_id } = req;

      const me = await userDal.userByToken(user_id);
      if (!me || me.length === 0) {
        return res.status(401).json({ message: "No autorizado" });
      }

      if (me[0].type !== 1 && me[0].type !== 2) {
        return res.status(403).json({ message: "No autorizado" });
      }

      const { clientId } = req.params;
      const result = await workerDal.getClientPets(clientId);

      res.status(200).json({ message: "ok", result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al traer mascotas" });
    }
  };

  getAllWorkers = async(req, res)=>{
    try {
      let result = await workerDal.getAllWorkers();
      res.status(200).json({
        message: 'datos recibidos',
        result
      })
    } catch (error) {
      console.log(error);
      res.status(500).json(error)
      
    }
  }

}

export default new WorkerController();
