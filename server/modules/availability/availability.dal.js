import executeQuery from "../../config/db.js";


class AvailabilityDal {
  getWorkingHours = async(adminId)=>{
    try {
      let sql = 'SELECT * FROM availability WHERE user_id=?'
      let result = await executeQuery(sql, [adminId])
      return result
      
    } catch (error) {
      throw error
    }
  }

  newAvailability = async(values)=>{
    try {
      let sql = `INSERT INTO availability (user_id, day_id, start_time, end_time)
    VALUES (?, ?, ?, ?)`

      let result = await executeQuery(sql, values)
      return result
    } catch (error) {
      throw error
    }
  }

  editAvailability = async(values)=>{
    try {
      let sql = `UPDATE availability
    SET day_id=?, start_time=?, end_time=?
    WHERE availability_id=?`
      let result = await executeQuery(sql, values)
      return result
    } catch (error) {
      throw error
    }
  }

  delAvailability = async(availability_id)=>{
    try {
      let sql=`DELETE FROM availability WHERE availability_id=?`
      let result = await executeQuery(sql, [availability_id])
      return result
    } catch (error) {
      throw error
    }
  }

}

export default new AvailabilityDal();