import executeQuery from "../../config/db.js";

class WorkerDal {
  searchClients = async (search) => {
    try {
      if (!search || search.trim() === "") return [];

      const like = `%${search}%`;

      const sql = `
        SELECT user_id, name_user, last_name, phone, email
        FROM user
        WHERE type = 3
          AND is_deleted = 0
          AND (
            name_user LIKE ?
            OR last_name LIKE ?
            OR phone LIKE ?
            OR email LIKE ?
          )
        ORDER BY name_user ASC, last_name ASC
        LIMIT 50
      `;

      const result = await executeQuery(sql, [like, like, like, like]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  getClientPets = async (clientId) => {
    try {
      const sql = `
        SELECT pet_id, name_pet, size_category, specie
        FROM pet
        WHERE user_id = ?
          AND pet_is_deleted = 0
        ORDER BY name_pet ASC
      `;
      return await executeQuery(sql, [clientId]);
    } catch (error) {
      throw error;
    }
  };

  getServices = async (type, size_category) => {
    try {
      const sql = `
        SELECT service_id, title, duration_minutes, price, type, size_category
        FROM service
        WHERE is_active_services = 1
          AND type = ?
          AND size_category = ?
        ORDER BY title ASC
      `;
      return await executeQuery(sql, [type, size_category]);
    } catch (error) {
      throw error;
    }
  };
  checkOverlap = async (employeeId, appointment_date, start_time, end_time) => {
    try {
      const sql = `
        SELECT appointment_id
        FROM appointment
        WHERE employee_user_id = ?
          AND appointment_date = ?
          AND status IN (1,2)
          AND NOT (end_time <= ? OR start_time >= ?)
        LIMIT 1
      `;

      return await executeQuery(sql, [
        employeeId,
        appointment_date,
        start_time,
        end_time,
      ]);
    } catch (error) {
      throw error;
    }
  };

  createAppointmentQuick = async (
    userId,
    appointment_date,
    start_time,
    end_time,
    total_price
  ) => {
    try {
      const sql = `
        INSERT INTO appointment
        (created_by_user_id, employee_user_id, client_user_id, pet_id, status,
         total_price, appointment_date, start_time, end_time)
        VALUES (?, ?, NULL, NULL, 1, ?, ?, ?, ?)
      `;

      const st = start_time.length === 5 ? `${start_time}:00` : start_time;

      const result = await executeQuery(sql, [
        userId,
        userId,
        total_price,
        appointment_date,
        st,
        end_time,
      ]);

      return result.insertId;
    } catch (error) {
      throw error;
    }
  };

  insertServicesForAppointment = async (
    appointmentId,
    service_id,
    supplement_ids = []
  ) => {
    try {
      const ids = [String(service_id), ...supplement_ids.map(String)];
      const uniqueIds = [...new Set(ids)].filter(Boolean);

      for (const sid of uniqueIds) {
        const sql = `
          INSERT INTO service_appointment (appointment_id, service_id)
          VALUES (?, ?)
        `;

        await executeQuery(sql, [appointmentId, sid]);
      }

      return true;
    } catch (error) {
      throw error;
    }
  };
  createQuickAppointment = async ({
  createdBy,
  employeeId,
  appointmentDate,
  startTime,
  durationMinutes,
  totalPrice,
  status,
  guestName,
  guestPhone,
  guestHair,
  serviceIds,
}) => {
  try {
    const sqlAppointment = `
      INSERT INTO appointment (
        created_by_user_id,
        employee_user_id,
        client_user_id,
        pet_id,
        guest_name,
        guest_phone,
        guest_hair,
        status,
        total_price,
        appointment_date,
        start_time,
        end_time
      )
      VALUES (
        ?, ?, NULL, NULL,
        ?, ?, ?,
        ?, ?,
        ?, ?,
        ADDTIME(?, SEC_TO_TIME(? * 60))
      )
    `;

    const appointmentRes = await executeQuery(sqlAppointment, [
      createdBy,
      employeeId,
      guestName,
      guestPhone,
      guestHair,
      status,
      totalPrice,
      appointmentDate,
      startTime,
      startTime,
      durationMinutes,
    ]);

    const appointmentId = appointmentRes.insertId;

    // 2) Insert relaciones con servicios (base + suplementos)
    if (Array.isArray(serviceIds) && serviceIds.length > 0) {
      for (const sid of serviceIds) {
        const sqlLink = `
          INSERT INTO service_appointment (appointment_id, service_id)
          VALUES (?, ?)
        `;
        await executeQuery(sqlLink, [appointmentId, sid]);
      }
    }

    return { appointment_id: appointmentId };
  } catch (error) {
    throw error;
  }
};
}

export default new WorkerDal();
