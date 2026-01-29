import executeQuery from "../../config/db.js";

class UserDal {
  register = async (values) => {
    try {
      let sql =
        "INSERT INTO user (name_user, last_name, phone, email, address, province, city, password) VALUES (?,?,?,?,?,?,?,?)";
      let result = await executeQuery(sql, values);
      return result;
    } catch (error) {
      throw error;
    }
  };

  verifyEmail = async (email) => {
    try {
      let sql = "UPDATE user SET is_confirmed = 1 WHERE email = ?";
      let result = await executeQuery(sql, [email]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  findUserByEmail = async (email) => {
    try {
      let sql =
        "SELECT user_id, password, is_confirmed FROM user WHERE email = ? AND is_deleted = 0";
      let result = await executeQuery(sql, [email]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  userByToken = async (id) => {
    try {
      let sql =
        "SELECT user_id, name_user, last_name, type, address, city, province, email, phone, picture_user FROM user WHERE user_id = ? AND is_deleted = 0";
      let result = await executeQuery(sql, [id]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  updatePassword = async (hashedPass, email) => {
    try {
      let sql = "UPDATE user SET password = ? WHERE email = ?";
      let result = await executeQuery(sql, [hashedPass, email]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  
  updateProfile = async (values) => {
    try {
      const sql = 
      `UPDATE user SET name_user = ?, last_name = ?, phone = ?, province = ?, city = ?, address = ?, picture_user=? WHERE user_id = ? AND is_deleted = 0
      `;
      const result = await executeQuery(sql, values);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /* borrado logico */
  deleteLogic = async (user_id) => {
    try {
      const sql = `UPDATE user SET is_deleted = 1 WHERE user_id = ?`;
      const result = await executeQuery(sql, [user_id]);
      return result;
    } catch (error) {
      throw error;
    }
  };
}

export default new UserDal();
