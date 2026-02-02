import executeQuery from "../../config/db.js";

class AdminDal {



  getAdminById = async (user_id) => {
    try {
      let sql = "SELECT * FROM user WHERE user_id = ? AND type = 1";
      return await executeQuery(sql, [user_id]);
    } catch (error) {
      throw error;
    }
  };

  createUser = async (values) => {
    try {
      let sql = "INSERT INTO user (name_user, last_name, phone, email, address, province, city, password, type) VALUES (?,?,?,?,?,?,?,?,?)";
      let result = await executeQuery(sql, values);
      return result;
    } catch (error) {
      throw error;
    }
  };

   // Obtener usuarios por tipo (2=worker, 3=client)
  getUsersByType = async (type) => {
    try {
      const sql = `SELECT user_id, client_code, name_user, last_name, phone, email, address, province, city, type FROM user WHERE type = ? AND is_deleted = 0`;
      const result = await executeQuery(sql, [type]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Actualizar el tipo del usuario
  updateUserType = async (user_id, type) => {
    try {
      const sql = `UPDATE user SET type = ? WHERE user_id = ?`;
      const result = await executeQuery(sql, [type, user_id]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  getUserById = async (userId) => {
    try {
      const sql = `SELECT user_id, client_code, name_user, last_name, email, phone, province, city, address, picture_user, type FROM user WHERE user_id = ?`;
      const result = await executeQuery(sql, [userId]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  editUserById = async (values) => {
    try {
      let sql;
      if (values.length === 9) {
        sql = 'UPDATE user SET name_user=?, last_name=?, phone=?, province=?, city=?, address=?, client_code=?, picture_user=? WHERE user_id=? AND is_deleted = 0';
      } else {
        sql = 'UPDATE user SET name_user=?, last_name=?, phone=?, province=?, city=?, address=?, client_code=? WHERE user_id=? AND is_deleted = 0';
      }
      const result = await executeQuery(sql, values);
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  // Actualizar is_deleted (0 o 1)
  updateUserIsDeleted = async (user_id, status) => {
    try {
      const sql = `UPDATE user SET is_deleted = ? WHERE user_id = ?`;
      const result = await executeQuery(sql, [status, user_id]);
      return result;
    } catch (error) {
      throw error;
    }
  };
}
export default new AdminDal();