const express = require('express');
const reminderController = require('../controllers/reminderController');
const authController = require('../controllers/authController');
const demoMode = require('../middlewares/demo_mode');
const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.route('/reminders').get(authController.protect, reminderController.getReminders);
router.route('/reminder/:id').get(authController.protect, reminderController.getReminder);

router
  .route('/add/reminder/')
  .get(authController.protect, reminderController.addReminder)
  .post(demoMode, authController.protect, reminderController.createReminder);

router.route('/update/reminder/:id').post(demoMode, authController.protect, reminderController.updateReminder);
router.route('/reminder/delete/:id').post(demoMode, authController.protect, reminderController.deleteReminder);

module.exports = router;
