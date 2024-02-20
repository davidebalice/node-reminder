const Email = require('./email');
const Reminder = require('../models/reminderModel');

async function cronReminder() {
  try {
    // Ottieni la data attuale
    const today = new Date();

    // Ottieni i reminder dal database con una data di scadenza prossima
    const reminderNext = await Reminder.find({ deadline: { $gt: today } });

    const localOption = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };

    // Invia gli email per ciascun reminder prossimo
    reminderNext.forEach(async (reminder) => {
      const daysRemaining = Math.ceil((reminder.deadline - today) / (24 * 60 * 60 * 1000));
      reminder.title = reminder.title.replace("'", '`');
      reminder.description = reminder.description.replace("'", '`');
      if (daysRemaining === 30 || daysRemaining === 7 || daysRemaining === 3 || daysRemaining === 1) {
        new Email(
          '<b>La scadenza di ' +
            reminder.title +
            ' è ' +
            reminder.deadline.toLocaleDateString('it-IT', localOption) +
            '</b><br />' +
            reminder.description,
          'scadenza ' + reminder.title,
          process.env.EMAIL_RECIPIENT
        ).send();
        await Reminder.findByIdAndUpdate(reminder._id, { lastEmailSend: today });
      }
    });

    console.log('Email di reminder inviate con successo.');
  } catch (error) {
    console.error("Errore durante l'elaborazione dei reminder:", error);
  }
}
module.exports = cronReminder;
