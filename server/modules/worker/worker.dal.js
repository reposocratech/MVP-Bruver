import executeQuery from "../../config/db.js";

class WorkerDal {
  searchClients = async (search) => {
    try {
      // Si search viene vacío -> devolvemos [] (para no sacar todos)
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

  getServices = async (type, size_category) => {
    try {
      const sql = `
        SELECT service_id, title, duration_minutes, price, type, size_category
        FROM service
        WHERE is_active_services = 1
          AND type = ?
          AND size_category = ?
        ORDER BY title ASC
      `;
      return await executeQuery(sql, [type, size_category]);
    } catch (error) {
      throw error;
    }
  };
}

export default new WorkerDal();
