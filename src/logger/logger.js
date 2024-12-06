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

  oneType(mes) {
    this.clear();
    this.type(mes);
  }

  oneMes(mes) {
    this.clear();
    this.mes(mes);
  }

  oneSuccess(mes) {
    this.clear();
    this.success(mes);
  }

  oneType(mes) {
    this.clear();
    this.type(mes);
  }

  oneWarn(mes) {
    this.clear();
    this.warn(mes);
  }

  oneError(mes) {
    this.clear();
    this.error(mes);
  }
}

export default new Logger();