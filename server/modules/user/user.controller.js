import userDal from './user.dal.js';
import bcrypt from "bcrypt";

class UserController {
    register = async (req, res) => {
      try {
        const {name_user, last_name, phone, email, province, city, password} = req.body;
        
        let hashedPass = await bcrypt.hash(password, 10);
        let result = await userDal.register([name_user, last_name || null, phone, email, province || null, city || null, hashedPass]);
        res.status(200).json(result);
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    }
  }
export default new UserController();
        
