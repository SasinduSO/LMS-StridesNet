const materialModel = require("../models/materialModel");

const MaterialController = {
  getMaterials: async (req, res) => {
    const { code } = req.params;
    console.log("course code is:", code);

    try {
      const materials = await materialModel.getMaterials(code);
      res.status(200).json(materials);
      console.log("your materials", materials );
    } catch (err) {
      console.error("Error retrieving materials:", err);
      res.status(500).json({ error: "Failed to retrieve materials" });
    }
  },

  addMaterial: async (req, res) => {
    const { courseCode } = req.params;
    const { title, note, material, instructor_id } = req.body;

    const materialData = {
      title,
      note,
      material,
      instructor_id,
    };

    try {
      await materialModel.addMaterial(courseCode, materialData);
      res.status(201).json({ message: "Material added successfully" });
    } catch (err) {
      console.error("Error adding material:", err);
      res.status(500).json({ error: "Failed to add material" });
    }
  },

  updateMaterial: async (req, res) => {
    const { courseCode, materialId } = req.params;
    const { title, note, material, instructor_id } = req.body;

    const materialData = {
      title,
      note,
      material,
      instructor_id,
    };

    try {
      await materialModel.updateMaterial(courseCode, materialId, materialData);
      res.status(200).json({ message: "Material updated successfully" });
    } catch (err) {
      console.error("Error updating material:", err);
      res.status(500).json({ error: "Failed to update material" });
    }
  },

  deleteMaterial: async (req, res) => {
    const { courseCode, materialId } = req.params;

    try {
      await materialModel.deleteMaterial(courseCode, materialId);
      res.status(200).json({ message: "Material deleted successfully" });
    } catch (err) {
      console.error("Error deleting material:", err);
      res.status(500).json({ error: "Failed to delete material" });
    }
  },
};

module.exports = MaterialController;
