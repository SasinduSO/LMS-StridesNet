const router = require("express").Router();
const materialController = require("../controllers/materialController");
const instructorAuth = require("../middleware/instructorAuth");

// Ensure proper routes for materials with authentication

//router.get('/materials-code', instructorAuth, materialController.getMaterials);
router.post('/course/:courseCode/materials', instructorAuth, materialController.addMaterial);
router.put('/course/:courseCode/materials/:materialId', instructorAuth, materialController.updateMaterial);
router.delete('/course/:courseCode/materials/:materialId', instructorAuth, materialController.deleteMaterial);

module.exports = router;
