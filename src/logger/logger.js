import LoggerServices from './logger-services.js';

class Logger extends LoggerServices {
  type(mes) {
    this.bConsole(mes, 'white');
  }

  info(mes) {
    this.bConsole(mes, 'brightMagenta');
  }

  success(mes) {
    this.bConsole(mes, 'brightGreen');
  }

  warn(mes) {
    this.bConsole(mes, 'brightYellow');
  }

  danger(mes) {
    this.bConsole(mes, 'brightRed');
  }
}

export default new Logger();