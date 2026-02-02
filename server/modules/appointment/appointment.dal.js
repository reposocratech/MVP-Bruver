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
        SELECT appointment_id, start_time, appointment_date, total_price
        FROM appointment
        WHERE client_user_id = ?
          AND (
            appointment_date > CURDATE()
            OR (appointment_date = CURDATE() AND start_time > CURTIME())
          )
        ORDER BY appointment_date ASC, start_time ASC
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
    catch (error)
     {
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
     catch (error) 
     {
      throw error;
    }
  };

  getAdminAppoiment = async(employeeId)=>{
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
        AND a.employee_user_id = ?
      `;
       let result = await executeQuery(sql, [employeeId]);
      return result
    } catch (error) {
      throw error
    }
  }

     insertServicesForAppointment = async (appointmentId, service_id, supplement_ids = []) => {
    try {
      const ids = [];

      if (service_id) ids.push(String(service_id));
      if (Array.isArray(supplement_ids)) {
        for (const s of supplement_ids) ids.push(String(s));
      }

      const uniqueIds = [...new Set(ids)].filter(Boolean);

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

}

export default new AppointmentDal();
