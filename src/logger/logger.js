import LoggerServices from './logger-services.js';

class Logger extends LoggerServices {
  type(mes) {
    this.bConsole(mes, 'brightWhite');
  }

  mes(mes) {
    this.bConsole(mes, 'brightMagenta');
  }

  info(mes) {
    this.bConsole(mes, 'brightBlue');
  }

  success(mes) {
    this.bConsole(mes, 'brightGreen');
  }

  warn(mes) {
    this.bConsole(mes, 'brightYellow');
  }

  error(mes) {
    this.bConsole(mes, 'brightRed');
  }
}

export default new Logger();