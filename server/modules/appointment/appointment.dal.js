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
}

export default new AppointmentDal();
