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
}
export default new AdminDal();