const connection = require("../models/connection");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

class MaterialModel {
  async getMaterials(courseId) {
    try {
      const queryString = `SELECT * FROM course_${courseId}_materials`;
      const result = await query(queryString);
      return result;
    } catch (err) {
      throw new Error("Failed to retrieve materials");
    }
  }

  async addMaterial(courseId, materialData) {
    try {
      const queryString = `INSERT INTO course_${courseId}_materials SET ?`;
      const result = await query(queryString, materialData);
      return result;
    } catch (err) {
      throw new Error("Failed to add material");
    }
  }

  async updateMaterial(courseId, materialId, materialData) {
    try {
      const queryString = `UPDATE course_${courseId}_materials SET ? WHERE id = ?`;
      const result = await query(queryString, [materialData, materialId]);
      return result;
    } catch (err) {
      throw new Error("Failed to update material");
    }
  }

  async deleteMaterial(courseId, materialId) {
    try {
      const queryString = `DELETE FROM course_${courseId}_materials WHERE id = ?`;
      const result = await query(queryString, materialId);
      return result;
    } catch (err) {
      throw new Error("Failed to delete material");
    }
  }
}

const materialModel = new MaterialModel();
module.exports = materialModel;
