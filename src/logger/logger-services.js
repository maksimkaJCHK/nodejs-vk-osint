class LoggerServices {
  _isTime = true;
  _isDate = true;
  _isFullYear = false;
  _isBg = false;

  _colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fg: {
      black: "\x1b[30m",
      red: "\x1b[31m",
      brightRed: "\x1b[91m",
      green: "\x1b[32m",
      brightGreen: "\x1b[92m",
      yellow: "\x1b[33m",
      brightYellow: "\x1b[93m",
      blue: "\x1b[34m",
      brightBlue: "\x1b[94m",
      magenta: "\x1b[35m",
      brightMagenta: "\x1b[95m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
      brightWhite: "\x1b[97m",
      gray: "\x1b[90m",
      crimson: "\x1b[38m"
    },
    bg: {
      black: "\x1b[40m",
      red: "\x1b[41m",
      brightRed: "\x1b[101m",
      green: "\x1b[42m",
      brightGreen: "\x1b[102m",
      yellow: "\x1b[43m",
      brightYellow: "\x1b[103m",
      blue: "\x1b[44m",
      brightBlue: "\x1b[104m",
      magenta: "\x1b[45m",
      brightMagenta: "\x1b[105m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
      brightWhite: "\x1b[107m",
      gray: "\x1b[100m",
      crimson: "\x1b[48m"
    }
  }

  clear() {
    console.clear();
  }

  group(nameGroup = '') {
    console.group(nameGroup);
  }

  endGroup() {
    console.groupEnd();
  }

  disableBg() {
    this._isBg = false;
  }

  enableBg() {
    this._isBg = true;
  }

  disableFullYear() {
    this._isFullYear = false;
  }

  enableFullYear() {
    this._isFullYear = true;
  }

  disableTime() {
    this._isTime = false;
  }

  enableTime() {
    this._isTime = true;
  }

  disableDate() {
    this._isDate = false;
  }

  enableDate() {
    this._isDate = true;
  }

  disableTimePeriod() {
    this._isDate = false;
    this._isTime = false;
  }

  enableTimePeriod() {
    this._isDate = true;
    this._isTime = true;
  }

  // Для построения времени
  bNumb(numb) {
    return (numb < 10) ? '0' + numb : numb;
  }

  bDate(date) {
    const day = this.bNumb(date.getDate());
    const month = this.bNumb(date.getMonth() + 1);
    const fullYear = date.getFullYear();

    const year = this._isFullYear ? fullYear : String(fullYear).slice(2);

    return `${day}.${month}.${year}`;
  }

  bTime(date) {
    const hours = this.bNumb(date.getHours());
    const min = this.bNumb(date.getMinutes());
    const sec = this.bNumb(date.getSeconds());

    return `${hours}:${min}:${sec}`;
  }

  bTimePeriod() {
    const cDate = new Date();
    let sTime = '';
    let sDate = '';

    if (this._isDate) sDate = this.bDate(cDate)
    if (this._isTime) sTime = this.bTime(cDate);
    if (this._isTime && this._isDate) return `${sTime}  ${sDate}  `;
    if (this._isTime) return `${sTime}  `;
    if (this._isDate) return `${sDate}  `;

    return '';
  }

  // Для правильного вывода консоли
  bConsoleText(mes, color) {
    const colorTxt = this._colors.fg[color];

    if (!this._isTime && !this._isDate) {
      console.log(
        colorTxt,
        mes,
        this._colors.reset
      );
    } else {
      console.log(
        colorTxt,
        this.bTimePeriod(),
        mes,
        this._colors.reset
      );
    }
  }

  bConsoleBg(mes, color) {
    const isWhiteColorArr = [
      'brightBlue',
      'brightRed',
      'brightMagenta'
    ];

    const typeColor = isWhiteColorArr.includes(color)
      ? 'brightWhite'
      : 'black';

    const colorTxt = this._colors.fg[typeColor];
    const colorBg = this._colors.bg[color];

    if (!this._isTime && !this._isDate) {
      console.log(
        colorBg,
        colorTxt,
        mes,
        this._colors.reset
      );
    } else {
      console.log(
        colorBg,
        colorTxt,
        this.bTimePeriod(),
        mes,
        this._colors.reset
      );
    }
  }

  bConsole(mes, color) {
    this._isBg
      ? this.bConsoleBg(mes, color)
      : this.bConsoleText(mes, color);
  }
}

export default LoggerServices;