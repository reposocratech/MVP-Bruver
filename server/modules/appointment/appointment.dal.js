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

}

export default new AppointmentDal();
