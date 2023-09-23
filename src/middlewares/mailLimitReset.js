const { User } = require('../models/User'); // Asegúrate de importar tu modelo de usuario

async function resetMailPerDay() {
  try {
    await User.update({ mailPerDay: 0 }, { where: {} });
    console.log('Valores de mailPerDay restablecidos a 0 para todos los usuarios.');
  } catch (error) {
    console.error('Error al restablecer los valores de mailPerDay:', error);
  }
}

const scheduleReset = () => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, // Suma 1 para obtener el próximo día
      0, // Hora: 0 (medianoche)
      0, // Minutos: 0
      0 // Segundos: 0
    );
    const timeUntilMidnight = midnight - now;
  
    setTimeout(() => {
      resetMailPerDay();
      scheduleReset(); // Programar la siguiente ejecución
    }, timeUntilMidnight);
  }


module.exports = {
    scheduleReset,
};