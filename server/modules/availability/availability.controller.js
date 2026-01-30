import availabilityDal from "./availability.dal.js";


class AvailabilityController{
  getWorkingHours = async(req, res)=>{
    const {adminId} = req.params
    try {
      const result = await availabilityDal.getWorkingHours(adminId)
      res.status(200).json({
        message: "datos recibidos",
        result
      })
      
    } catch (error) {
      console.log(error);
      res.status(500).json(error)
    }
  }

  newAvailability =async(req, res)=>{
    const {user_id, day_id, start_time, end_time} = req.body
    try {
      const result = await availabilityDal.newAvailability([
        user_id,
        day_id,
        start_time,
        end_time
      ])
      res.status(200).json({
        message: "datos recibidos",
        result
      })
    } catch (error) {
      console.log(error);
      
    }
  }

  editAvailability = async(req, res)=>{
    const {availability_id} = req.params
    const {day_id, start_time, end_time} = req.body
    try {
      const result = await availabilityDal.editAvailability([
        day_id, start_time, end_time, availability_id
      ])
      
      res.status(200).json({
        message: "datos recibidos",
        result
      })
    } catch (error) {
      console.log(error);
      
    }
  }

  delAvailability = async(req, res)=>{
    const {availability_id} = req.params
    console.log("nos llega el id???????", availability_id);
    
    try {
      const result = await availabilityDal.delAvailability(availability_id)
      res.status(200).json({
        message: "datos recibidos",
        result
      })
    } catch (error) {
      console.log(error);
      
    }
  }

}

export default new AvailabilityController();