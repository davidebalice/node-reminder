const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const demoMode = require('../middlewares/demo_mode');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.route('/categories').get(authController.protect, categoryController.getCategories);
router.route('/category/:id').get(authController.protect, categoryController.getCategory);

router
  .route('/add/category/')
  .post(demoMode, authController.protect, categoryController.createCategory);

router.route('/update/category/:id').post(demoMode, authController.protect, categoryController.updateCategory);
router.route('/category/delete/:id').post(demoMode, authController.protect, categoryController.deleteCategory);

module.exports = router;
