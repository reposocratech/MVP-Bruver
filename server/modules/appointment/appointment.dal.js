import executeQuery from "../../config/db.js";

class AppointmentDal {
  getMine = async (userId) => {
    try {
      let sql = `
        SELECT appointment_id, start_time, appointment_date, total_price
        FROM appointment
        WHERE client_user_id = ?
        ORDER BY appointment_date DESC, start_time DESC
      `;
      let result = await executeQuery(sql, [userId]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  getGenaralAppoiment = async()=>{
    try {
        let sql = `
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
    `
      let result = await executeQuery(sql)

      return result
      
    } catch (error) {
      throw error
    }
  }
}

export default new AppointmentDal();
