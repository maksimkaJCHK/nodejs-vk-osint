import logger from './logger.js';
import delayF from '../services/delay.js';

const oneInRow = async () => {
  let count = 0;

  logger.disableDate();

  while (count <= 10) {
    logger.oneMes(`Значение счетчика равно ${count}.`);

    count++;
    await delayF(1_000);
  }

  logger.oneSuccess('Счетчик закончился');
}

oneInRow();