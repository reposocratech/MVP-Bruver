import executeQuery from "../../config/db.js";

class PetDal {
  // 1) Traer todas las mascotas del usuario
  getMine = async (userId) => {
    try {
      let sql = `
        SELECT pet_id, name_pet, description, picture_pet, specie, size_category
        FROM pet
        WHERE user_id = ? AND pet_is_deleted = 0
      `;
      let result = await executeQuery(sql, [userId]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // 2) Crear mascota
  create = async ({ name_pet, description, specie, size_category, hair, medical_history, user_id }) => {
    try {
      const sql = `
        INSERT INTO pet (name_pet, description, specie, size_category, hair, medical_history, pet_is_deleted, user_id)
        VALUES (?, ?, ?, ?, ?, ?, 0, ?)
      `;
      const result = await executeQuery(sql, [
        name_pet,
        description,
        specie,
        size_category,
        hair,
        medical_history,
        user_id,
      ]);

      return result;
    } catch (error) {
      throw error;
    }
  };

  // 3) Borrado lógico
  softDelete = async (petId, userId) => {
    try {
      let sql = `
        UPDATE pet
        SET pet_is_deleted = 1
        WHERE pet_id = ? AND user_id = ?
      `;
      let result = await executeQuery(sql, [petId, userId]);
      return result;
    } catch (error) {
      throw error;
    }
  };

// 4) Traer 1 mascota por id (solo si es del usuario)
getOne = async (petId, userId) => {
  try {
    const sql = `
      SELECT pet_id, name_pet, description, picture_pet, specie, size_category, hair, medical_history
      FROM pet
      WHERE pet_id = ? AND user_id = ? AND pet_is_deleted = 0
    `;
    const result = await executeQuery(sql, [petId, userId]);
    return result;
  } catch (error) {
    throw error;
  }
};

// 5) Editar mascota (solo si es del usuario)
edit = async ({ petId, userId, name_pet, description, specie, size_category, hair, medical_history }) => {
  try {
    const sql = `
      UPDATE pet
      SET name_pet = ?, description = ?, specie = ?, size_category = ?, hair = ?, medical_history = ?
      WHERE pet_id = ? AND user_id = ? AND pet_is_deleted = 0
    `;
    const result = await executeQuery(sql, [
      name_pet,
      description,
      specie,
      size_category,
      hair,
      medical_history,
      petId,
      userId,
    ]);
    return result;
  } catch (error) {
    throw error;
  }
};

}

export default new PetDal();
