const Email = require('./email');
const Reminder = require('../models/reminderModel');

async function cronReminder() {
  try {
    // Ottieni la data attuale
    const dataAttuale = new Date();

    // Ottieni i reminder dal database con una data di scadenza prossima
    const reminderProssimi = await Reminder.find({ deadline: { $gt: dataAttuale } });

    // Invia gli email per ciascun reminder prossimo
    reminderProssimi.forEach((reminder) => {
      const giorniRimanenti = Math.ceil((reminder.deadline - dataAttuale) / (24 * 60 * 60 * 1000));

      if (giorniRimanenti === 30 || giorniRimanenti === 7 || giorniRimanenti === 1) {
        new Email('la scadenza è ' + reminder.deadline, 'reminder test', 'web@sitiwebturismo.it').send();
      }
    });

    console.log('Email di reminder inviate con successo.');
  } catch (error) {
    console.error("Errore durante l'elaborazione dei reminder:", error);
  }
}
module.exports = cronReminder;
