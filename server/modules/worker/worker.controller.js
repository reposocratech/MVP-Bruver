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

  getServices = async (req, res) => {
    try {
      const { user_id } = req;

      const me = await userDal.userByToken(user_id);
      if (!me || me.length === 0) {
        return res.status(401).json({ message: "No autorizado" });
      }

      if (me[0].type !== 1 && me[0].type !== 2) {
        return res.status(403).json({ message: "No autorizado" });
      }

      const { type, size_category } = req.query;

      // validaciones 
      if (!type || !size_category) {
        return res.status(400).json({ message: "Faltan parámetros" });
      }

      const result = await workerDal.getServices(type, size_category);
      res.status(200).json({ message: "ok", result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error al traer servicios" });
    }
  };

  
 createQuickAppointment = async (req, res) => {
  try {
    const { user_id } = req; 

    const me = await userDal.userByToken(user_id);
    if (!me || me.length === 0) return res.status(401).json({ message: "No autorizado" });
    if (me[0].type !== 1 && me[0].type !== 2) return res.status(403).json({ message: "No autorizado" });

    const {
      client_name,
      phone,
      hair,
      specie,
      service_id,
      supplement_ids,
      appointment_date,
      start_time,
      duration_minutes,
      total_price,
      observations
    } = req.body;

    // Validaciones para no dejar campos vacíos y por si se elige gatos
      if (!appointment_date) return res.status(400).json({ message: "Falta appointment_date" });
      if (!start_time) return res.status(400).json({ message: "Falta start_time" });

      const isCat = String(specie) === "2";

      if (!isCat) {
        if (!service_id) return res.status(400).json({ message: "Falta service_id" });
        if (!duration_minutes || Number(duration_minutes) <= 0)
          return res.status(400).json({ message: "Duración inválida" });
      }


    const result = await workerDal.createQuickAppointment({
      created_by_user_id: user_id,
      employee_user_id: user_id,

      appointment_date,
      start_time,
      duration_minutes:isCat? 0 : Number(duration_minutes),
      total_price: isCat? 0 : Number(total_price || 0),

      guest_name: client_name || null,
      guest_phone: phone || null,
      guest_hair: hair || null,

      service_id: isCat? null: service_id,
      supplement_ids:isCat ?[] : Array.isArray(supplement_ids) ? supplement_ids : [],
      observations: observations || null,
    });

    return res.status(201).json({ message: "Cita rápida creada", result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al crear cita rápida" });
  }
};

createClientAppointment = async (req, res) => {
  try {
    const { user_id } = req;

    // Comprobar que el usuario logueado existe y es admin/empleado
    const me = await userDal.userByToken(user_id);
    if (!me || me.length === 0) {
      return res.status(401).json({ message: "No autorizado" });
    }

    if (me[0].type !== 1 && me[0].type !== 2) {
      return res.status(403).json({ message: "No autorizado" });
    }

    //leer datos del front para cita a cliente registrado
    const {
      client_user_id,
      pet_id,
      service_id,
      supplement_ids,
      appointment_date,
      start_time,
      duration_minutes,
      total_price,
      observations
    } = req.body;

    // Validaciones para campos vacíos
    if (!client_user_id) return res.status(400).json({ message: "Falta client_user_id" });
    if (!pet_id) return res.status(400).json({ message: "Falta pet_id" });
    if (!appointment_date) return res.status(400).json({ message: "Falta appointment_date" });
    if (!start_time) return res.status(400).json({ message: "Falta start_time" });

    // duración y precio
    const dur = Number(duration_minutes || 0);
    if (dur <= 0) return res.status(400).json({ message: "Duración inválida" });

    const price = Number(total_price || 0);
    if (Number.isNaN(price)) return res.status(400).json({ message: "Precio inválido" });

    //Crear cita (trabajador logueado, created_by = logueado)
    const result = await workerDal.createClientAppointment({
      created_by_user_id: user_id,
      employee_user_id: user_id,
      client_user_id,
      pet_id,
      appointment_date,
      start_time,
      duration_minutes: dur,
      total_price: price,
      service_id: service_id || null, //null en gatos
      supplement_ids: Array.isArray(supplement_ids) ? supplement_ids : [],
      observations: observations || null,
    });

    return res.status(201).json({ message: "Cita creada", result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error al crear cita de cliente" });
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
