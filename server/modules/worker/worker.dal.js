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
}

export default new WorkerDal();
