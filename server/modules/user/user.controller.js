import userDal from './user.dal.js';

class UserController {
    register = async (req, res) => {
      try {
        let result = await userDal.register();
        res.status(200).json(result);
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    }
  }
export default new UserController();
        
