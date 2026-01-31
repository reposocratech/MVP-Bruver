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

      // validaciones simples
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
      service_id,
      supplement_ids,
      appointment_date,
      start_time,
      duration_minutes,
      total_price,
    } = req.body;

    // Validaciones mínimas
    if (!appointment_date) return res.status(400).json({ message: "Falta appointment_date" });
    if (!start_time) return res.status(400).json({ message: "Falta start_time" });
    if (!service_id) return res.status(400).json({ message: "Falta service_id" });

    const result = await workerDal.createQuickAppointment({
      created_by_user_id: user_id,   // ✅ el logueado crea
      employee_user_id: user_id,     // ✅ el logueado atiende
      status: 1,
      total_price,
      appointment_date,
      start_time,
      duration_minutes,
      guest_name: client_name || null,
      guest_phone: phone || null,
      guest_hair: hair || null,
      service_id,
      supplement_ids: Array.isArray(supplement_ids) ? supplement_ids : [],
    });

    res.status(201).json({ message: "Cita rápida creada", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear cita rápida" });
  }
};

  addMinutesToTime = (startTime, minutes) => {
    const parts = startTime.split(":");
    const hh = Number(parts[0]);
    const mm = Number(parts[1]);
    const ss = parts[2] ? Number(parts[2]) : 0;

    const total = hh * 3600 + mm * 60 + ss;
    const endTotal = total + Number(minutes) * 60;

    const endH = Math.floor(endTotal / 3600) % 24;
    const endM = Math.floor((endTotal % 3600) / 60);
    const endS = endTotal % 60;

    const pad2 = (n) => String(n).padStart(2, "0");
    return `${pad2(endH)}:${pad2(endM)}:${pad2(endS)}`;
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
      service_id,
      supplement_ids,
      appointment_date,
      start_time,
      duration_minutes,
      total_price,
    } = req.body;

    if (!appointment_date) return res.status(400).json({ message: "Falta appointment_date" });
    if (!start_time) return res.status(400).json({ message: "Falta start_time" });
    if (!service_id) return res.status(400).json({ message: "Falta service_id" });

    const result = await workerDal.createQuickAppointment({
      created_by_user_id: user_id,
      employee_user_id: user_id,
      appointment_date,
      start_time,
      duration_minutes,
      total_price,
      guest_name: client_name || null,
      guest_phone: phone || null,
      guest_hair: hair || null,
      service_id,
      supplement_ids: Array.isArray(supplement_ids) ? supplement_ids : [],
    });

    res.status(201).json({ message: "Cita rápida creada", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear cita rápida" });
  }
};

createClientAppointment = async (req, res) => {
  try {
    const { user_id } = req;

    const me = await userDal.userByToken(user_id);
    if (!me || me.length === 0) return res.status(401).json({ message: "No autorizado" });
    if (me[0].type !== 1 && me[0].type !== 2) return res.status(403).json({ message: "No autorizado" });

    res.status(200).json({ message: "createClientAppointment OK (pendiente implementar)" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear cita de cliente" });
  }
};
}

export default new WorkerController();
