import executeQuery from "../../config/db.js";

class UserDal{
  register = async(values)=>{
    
    try {
      let sql = "INSERT INTO user (name_user, last_name, phone, email, province, city, password)  VALUES (?,?,?,?,?,?,?)";
      let result = await executeQuery(sql, values); 
      return result;
    } catch (error) {
      throw error;
    }
  }

  getProfileById = async (userId) => {
    try {
      let sql = "SELECT user_id, name_user, last_name, email, phone, picture_user FROM user WHERE user_id = ? AND is_deleted = 0";
      let result = await executeQuery(sql, [userId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export default new UserDal();