import executeQuery from "../../config/db.js";

class WorkerDal {
  searchClients = async (search) => {
    try {
      if (!search || search.trim() === "") return [];

      const like = `%${search}%`;

      const sql = `
        SELECT user_id, name_user, last_name, phone, email
        FROM user
        WHERE type = 3
          AND is_deleted = 0
          AND (
            name_user LIKE ?
            OR last_name LIKE ?
            OR phone LIKE ?
            OR email LIKE ?
          )
        ORDER BY name_user ASC, last_name ASC
        LIMIT 50
      `;

      const result = await executeQuery(sql, [like, like, like, like]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  getClientPets = async (clientId) => {
    try {
      const sql = `
        SELECT pet_id, name_pet, size_category, specie
        FROM pet
        WHERE user_id = ?
          AND pet_is_deleted = 0
        ORDER BY name_pet ASC
      `;
      return await executeQuery(sql, [clientId]);
    } catch (error) {
      throw error;
    }
  };

  checkOverlap = async (employeeId, appointment_date, start_time, end_time) => {
    try {
      const sql = `
        SELECT appointment_id
        FROM appointment
        WHERE employee_user_id = ?
          AND appointment_date = ?
          AND status IN (1,2)
          AND NOT (end_time <= ? OR start_time >= ?)
        LIMIT 1
      `;

      return await executeQuery(sql, [
        employeeId,
        appointment_date,
        start_time,
        end_time,
      ]);
    } catch (error) {
      throw error;
    }
  };

   getAllWorkers = async () => {
    try {
      let sql = `SELECT user_id, name_user, last_name
                     FROM user
                     WHERE type IN (1, 2)
                     AND is_deleted = 0;`
      let result = executeQuery(sql);
      return result;
    } catch (error) {
      throw error;
    }
  }

}

export default new WorkerDal();
