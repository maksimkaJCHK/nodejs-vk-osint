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

  typeBg(mes) {
    this.enableBg();
    this.bConsole(mes, 'brightWhite');
    this.disableBg();
  }

  mesBg(mes) {
    this.enableBg();
    this.bConsole(mes, 'brightMagenta');
    this.disableBg();
  }

  infoBg(mes) {
    this.enableBg();
    this.bConsole(mes, 'brightBlue');
    this.disableBg();
  }

  successBg(mes) {
    this.enableBg();
    this.bConsole(mes, 'brightGreen');
    this.disableBg();
  }

  warnBg(mes) {
    this.enableBg();
    this.bConsole(mes, 'brightYellow');
    this.disableBg();
  }

  errorBg(mes) {
    this.enableBg();
    this.bConsole(mes, 'brightRed');
    this.disableBg();
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