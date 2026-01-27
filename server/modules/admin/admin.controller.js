import adminDal from "./admin.dal.js";

class AdminController {

  getAdminProfile = async (req, res) => {
    const { user_id } = req;
    console.log(user_id);

    try {
      const result = await adminDal.getAdminById(user_id);
      res.status(200).json({ ok: true, user: result[0] });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

}

export default new AdminController();
