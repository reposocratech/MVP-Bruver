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
}
export default new UserDal();