import availabilityDal from "./availability.dal.js";


class AvailabilityController{
  getWorkingHours = async(req, res)=>{
    try {
      let result = await availabilityDal.getWorkingHours()
      res.status(200).json({message: "datos recibidos"})
    } catch (error) {
      console.log(error);
      res.status(500).json(error)
    }
  }
}

export default new AvailabilityController();