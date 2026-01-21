import executeQuery from "../../config/db.js";

class UserDal{
  register = async()=>{
    try {
      let sql = "SELECT * FROM user";
      let result = await executeQuery(sql); 
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export default new UserDal();