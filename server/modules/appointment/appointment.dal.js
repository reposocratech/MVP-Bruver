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
    total_price = ?
WHERE appointment_id = ?;`

      let result = executeQuery(sql, values)
      return result

    } catch (error) {
      throw error
    }
  }

  deleteAppointment = async(appointmentId)=>{
    try {
      const sql = `DELETE FROM appointment WHERE appointment_id = ?`;
    let result = await  executeQuery(sql, [appointmentId])
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

  createAppointment = async ({
    created_by_user_id,
    employee_user_id,
    client_user_id,
    pet_id,
    appointment_date,
    start_time,
    duration_minutes,
    total_price,
    service_id,
    supplement_ids = [],
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

      const appointmentRes = await executeQuery(sql, [
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

      const appointmentId = appointmentRes.insertId;

      // Vincular servicio base + suplementos + servicio de limpieza (si está en env) - versión simplificada
      const rawIds = [
        service_id,
        ...(Array.isArray(supplement_ids) ? supplement_ids : []),
        process.env.CLEANING_SERVICE_ID,
      ].filter(Boolean);

      const uniqueIds = [...new Set(rawIds)];

      if (uniqueIds.length > 0) {
        // Construimos VALUES directamente: (appointmentId, serviceId),(...)
        // Convertimos a Number para evitar inyección si los ids vienen alterados
        const values = uniqueIds.map(id => `(${appointmentId}, ${Number(id)})`).join(', ');
        const sqlLink = `INSERT INTO service_appointment (appointment_id, service_id) VALUES ${values}`;
        await executeQuery(sqlLink);
      }

      return { appointment_id: appointmentId };
    } catch (error) {
      throw error;
    }
  };

}

export default new AppointmentDal();
