
import executeQuery from "../../config/db.js";

class AppointmentDal {
  // 1) Traer citas del cliente logueado
  getMine = async (userId) => {
    try {

      /* las que solo son futuras hasta el mismo dia  */
      /* const sql = `
      SELECT appointment_id, start_time, appointment_date, total_price
      FROM appointment
      WHERE client_user_id = ?
        AND appointment_date > CURDATE()
      ORDER BY appointment_date ASC, start_time ASC
      `; */

      /* como dato creo que se deberia de poder mostrar hasta las de minutos antes,
      ahora mismo si yo tengo una cita el dia 12 ya el dia 11 a las 11:59 desapareceria y no mostraria a que hora la tiene */

      /*   con esta si controla 
      curdate es una funcion de sql que te dice el dia 
      curtime es una funcion de sql que te dice la hora */

      const sql = `
        SELECT 
          a.appointment_id, 
          a.start_time, 
          a.appointment_date, 
          a.total_price,
          GROUP_CONCAT(s.title SEPARATOR ', ') AS servicios
        FROM appointment a
        LEFT JOIN service_appointment sa ON a.appointment_id = sa.appointment_id
        LEFT JOIN service s ON sa.service_id = s.service_id
        WHERE a.client_user_id = ?
          AND (
            a.appointment_date > CURDATE()
            OR (a.appointment_date = CURDATE() AND a.start_time > CURTIME())
          )
        GROUP BY a.appointment_id
        ORDER BY a.appointment_date ASC, a.start_time ASC
      `;


      /* antigua que muestra tanto las futuras y antiguas */
      /* const sql = `
        SELECT appointment_id, start_time, appointment_date, total_price
        FROM appointment
        WHERE client_user_id = ?
        ORDER BY appointment_date DESC, start_time DESC
      `; */
      return await executeQuery(sql, [userId]);
    }
    catch (error) {
      throw error;
    }
  };

  // 2) Traer citas generales que no  esten canceladas
  getGenaralAppoiment = async () => {
    try {
      const sql = `
        SELECT
          a.appointment_id,
          a.appointment_date,
          a.start_time,
          a.end_time,
          a.employee_user_id,
          u.name_user AS employee_name
        FROM appointment a
        JOIN user u ON u.user_id = a.employee_user_id
        WHERE a.status != 3
      `;
      let result = await executeQuery(sql);
      return result
    }
    catch (error) {
      throw error;
    }
  };

  getAdminAppoiment = async (employeeId) => {
    try {
      const sql = `
            SELECT
        a.appointment_id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        a.employee_user_id,
        a.total_price,
        a.guest_name,
        a.guest_phone,
        a.observations,

        emp.user_id        AS employee_id,
        emp.name_user      AS employee_name,
        emp.last_name      AS employee_lastname,

        cli.user_id        AS client_id,
        cli.name_user      AS client_name,
        cli.last_name      AS client_lastname,

        creator.user_id   AS created_by_id,
        creator.name_user AS created_by_name,
        creator.type      AS created_by_type

        FROM appointment a
        JOIN user emp 
          ON emp.user_id = a.employee_user_id
        LEFT JOIN user cli 
          ON cli.user_id = a.client_user_id
        JOIN user creator 
          ON creator.user_id = a.created_by_user_id

        WHERE a.status != 3
        AND a.employee_user_id = ?;
      `;
      let result = await executeQuery(sql, [employeeId]);
      return result
    } catch (error) {
      throw error
    }
  }

  updateAppointment = async (values) => {
    try {
      let sql = `UPDATE appointment
                 SET 
    appointment_date = ?,
    start_time = ?,
    end_time = ?,
    employee_user_id = ?,
    total_price = ?,
    status = ?
WHERE appointment_id = ?;`

      let result = executeQuery(sql, values)
      return result

    } catch (error) {
      throw error
    }
  }

  deleteAppointment = async (appointmentId) => {
    try {
      // 1. Obtener los datos de la cita antes de borrarla
      const selectSql = `SELECT * FROM appointment WHERE appointment_id = ?`;
      const appointmentRows = await executeQuery(selectSql, [appointmentId]);
      const appointmentData = appointmentRows && appointmentRows.length > 0 ? appointmentRows[0] : null;

      // 2. Borrar la cita
      const deleteSql = `DELETE FROM appointment WHERE appointment_id = ?`;
      let result = await executeQuery(deleteSql, [appointmentId]);

      // 3. Devolver el resultado del borrado y los datos de la cita
      return { deleteResult: result, appointmentData };
    } catch (error) {
      throw error;
    }
  }

  insertServicesForAppointment = async (appointmentId, service_id, supplement_ids = []) => {
    try {
      const cleaningId = Number(process.env.CLEANING_SERVICE_ID);
      const ids = [];

      if (service_id) ids.push(service_id);
      if (Array.isArray(supplement_ids)) {
        for (const s of supplement_ids) ids.push(s);
      }
      if (!Number.isNaN(cleaningId)) ids.push(cleaningId);

      const uniqueIds = [...new Set(ids.map(id => Number(id)))].filter(id => !Number.isNaN(id));

      for (const sid of uniqueIds) {
        const sql = `
          INSERT INTO service_appointment (appointment_id, service_id)
          VALUES (?, ?)
        `;
        await executeQuery(sql, [appointmentId, sid]);
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  createClientAppointment = async ({
    created_by_user_id,
    employee_user_id,
    client_user_id,
    pet_id,
    appointment_date,
    start_time,
    duration_minutes,
    total_price,
    observations,
  }) => {
    try {
console.log("############", start_time)
let st = `${start_time}:00`;
if(start_time.length>5){
  let temporal = start_time.split(":")
  st = `${temporal[0]}:${temporal[1]}:00` 
}
console.log("NOOOOOOOOOOOOOOOOOOOO", st)
      /* const st = start_time.length === 5 ? start_time.split : `${start_time}:00`; */

      const sql = `
        INSERT INTO appointment (
          created_by_user_id,
          employee_user_id,
          client_user_id,
          pet_id,
          status,
          total_price,
          appointment_date,
          start_time,
          end_time,
          observations
        )
        VALUES (
          ?, ?, ?, ?,
          1,
          ?,
          ?,
          ?,
          ADDTIME(?, SEC_TO_TIME(? * 60)),
          ?
        )
      `;

      const result = await executeQuery(sql, [
        created_by_user_id,
        employee_user_id,
        client_user_id,
        pet_id,
        total_price,
        appointment_date,
        st,
        st,
        duration_minutes,
        observations || null,
      ]);

      return { appointment_id: result.insertId };
    } catch (error) {
      throw error;
    }
  };

  clientCreateAppointment = async ({
    created_by_user_id,
    employee_user_id,
    client_user_id,
    pet_id,
    appointment_date,
    start_time,
    duration_minutes,
    total_price,
    observations,
  }) => {
    try {

      const st = start_time.length === 5 ? `${start_time}:00` : start_time;

      const sql = `
        INSERT INTO appointment (
          created_by_user_id,
          employee_user_id,
          client_user_id,
          pet_id,
          status,
          total_price,
          appointment_date,
          start_time,
          end_time,
          observations
        )
        VALUES (
          ?, ?, ?, ?,
          2,
          ?,
          ?,
          ?,
          ADDTIME(?, SEC_TO_TIME(? * 60)),
          ?
        )
      `;

      const result = await executeQuery(sql, [
        created_by_user_id,
        employee_user_id,
        client_user_id,
        pet_id,
        total_price,
        appointment_date,
        st,
        st,
        duration_minutes,
        observations || null,
      ]);

      return { appointment_id: result.insertId };
    } catch (error) {
      throw error;
    }
  };

  //funcion sacar a utils 
  checkOverlap = async (employeeId, appointment_date, start_time, duration_minutes) => {
    try {
      const sql = `
        SELECT appointment_id
        FROM appointment
        WHERE employee_user_id = ?
          AND appointment_date = ?
          AND status IN (1,2)
          AND NOT (end_time <= ? OR start_time >= ADDTIME(?, SEC_TO_TIME(? * 60)))
        LIMIT 1
      `;

      const result = await executeQuery(sql, [
        employeeId,
        appointment_date,
        start_time,
        start_time,
        duration_minutes,
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  };


  createQuickAppointment = async ({
    created_by_user_id,
    employee_user_id,
    appointment_date,
    start_time,
    duration_minutes,
    total_price,
    guest_name,
    guest_phone,
    guest_hair,
    observations,
  }) => {
    try {
      const st = start_time.length === 5 ? `${start_time}:00` : start_time;

      const sql = `
        INSERT INTO appointment (
          created_by_user_id,
          employee_user_id,
          client_user_id,
          pet_id,
          guest_name,
          guest_phone,
          guest_hair,
          status,
          total_price,
          appointment_date,
          start_time,
          end_time,
          observations
        )
        VALUES (
          ?, ?, NULL, NULL,
          ?, ?, ?,
          1,
          ?,
          ?, ?,
          ADDTIME(?, SEC_TO_TIME(? * 60)),
          ?
        )
      `;

      const result = await executeQuery(sql, [
        created_by_user_id,
        employee_user_id,
        guest_name,
        guest_phone,
        guest_hair,
        total_price,
        appointment_date,
        st,
        st,
        duration_minutes,
        observations || null,
      ]);

      return { appointment_id: result.insertId };
    } catch (error) {
      throw error;
    }
  };

  checkOverlap = async (employeeId, appointment_date, start_time, duration_minutes) => {
    try {
      const sql = `
        SELECT appointment_id
        FROM appointment
        WHERE employee_user_id = ?
          AND appointment_date = ?
          AND status IN (1,2)
          AND NOT (end_time <= ? OR start_time >= ADDTIME(?, SEC_TO_TIME(? * 60)))
        LIMIT 1
      `;

      const result = await executeQuery(sql, [
        employeeId,
        appointment_date,
        start_time,
        start_time,
        duration_minutes,
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  };

  getWorkerAppoiment = async (employeeId) => {
    try {
      const sql = `
            SELECT
        a.appointment_id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        a.employee_user_id,
        a.total_price,

        emp.user_id        AS employee_id,
        emp.name_user      AS employee_name,
        emp.last_name      AS employee_lastname,

        cli.user_id        AS client_id,
        cli.name_user      AS client_name,
        cli.last_name      AS client_lastname,

        creator.user_id   AS created_by_id,
        creator.name_user AS created_by_name,
        creator.type      AS created_by_type

        FROM appointment a
        JOIN user emp 
          ON emp.user_id = a.employee_user_id
        LEFT JOIN user cli 
          ON cli.user_id = a.client_user_id
        JOIN user creator 
          ON creator.user_id = a.created_by_user_id

        WHERE a.status != 3
        AND a.employee_user_id = ?;
      `;
      let result = await executeQuery(sql, [employeeId]);
      return result
    } catch (error) {
      throw error
    }
  }

  // Traer todas las citas del usuario (presente, pasadas y futuras)
  getAllByUserId = async (userId) => {
    try {
      const sql = `
        SELECT appointment_id, start_time, appointment_date, total_price, status
        FROM appointment
        WHERE client_user_id = ?
        ORDER BY appointment_date DESC, start_time DESC
      `;
      return await executeQuery(sql, [userId]);
    } catch (error) {
      throw error;
    }
  };

}

export default new AppointmentDal();
