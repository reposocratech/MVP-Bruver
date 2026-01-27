import executeQuery from "../../config/db.js";

class PetDal {
  getMine = async (userId) => {
    try {
      let sql = `
        SELECT pet_id, name_pet, description, picture_pet, specie
        FROM pet
        WHERE user_id = ? AND pet_is_deleted = 0
      `;
      let result = await executeQuery(sql, [userId]);
      return result;
    } catch (error) {
      throw error;
    }
  };

  create = async ({ name_pet, description, specie, size_category, user_id }) => {

    try {
      const sql = `
        INSERT INTO pet (name_pet, description, specie, size_category, pet_is_deleted, user_id)
        VALUES (?, ?, ?, ?, 0, ?)
      `;
      const result = await executeQuery(sql, [
        name_pet,
        description,
        specie,
        size_category,
        user_id,
      ]);

      return result;

    } catch (error) 
    {
      throw error;
    }
  };

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
}

export default new PetDal();
