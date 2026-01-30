import executeQuery from "../../config/db.js";

class ServiceDal {
  getForSize = async (sizeCategory) => {
    try {
      const sql = `
        SELECT service_id, title, duration_minutes, price, type, size_category, picture_services
        FROM service
        WHERE is_active_services = 1
          AND (
            (type IN (1,2) AND size_category = ?)
            OR (type = 3)
          )
        ORDER BY type ASC, service_id ASC;
      `;
      const result = await executeQuery(sql, [sizeCategory]);
      return result;
    } catch (error) {
      throw error;
    }
  };
}

export default new ServiceDal();
