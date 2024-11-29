class Logger {
  isTime = true;
  isDate = true;

  colors = {
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
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
      gray: "\x1b[90m",
      crimson: "\x1b[38m"
    },
    bg: {
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
      gray: "\x1b[100m",
      crimson: "\x1b[48m"
    }
  }

  // console.log(this.colors.bg.black, this.colors.fg.white, mes, this.colors.reset);
  // console.log(this.colors.bg.red, this.colors.fg.white, mes, this.colors.reset);
  // console.log(this.colors.bg.green, this.colors.fg.white, mes, this.colors.reset);
  // console.log(this.colors.bg.yellow, this.colors.fg.white, mes, this.colors.reset);
  // console.log(this.colors.bg.magenta, this.colors.fg.white, mes, this.colors.reset);
  // console.log(this.colors.bg.cyan, this.colors.fg.white, mes, this.colors.reset);
  // console.log(this.colors.bg.white, this.colors.fg.white, mes, this.colors.reset);
  // console.log(this.colors.bg.gray, this.colors.fg.white, mes, this.colors.reset);
  // console.log(this.colors.bg.crimson, this.colors.fg.white, mes, this.colors.reset);

  disableTime() {
    this.isTime = false;
  }

  enableTime() {
    this.isTime = true;
  }

  disableDate() {
    this.isDate = false;
  }

  enableDate() {
    this.isDate = true;
  }

  bNumb(numb) {
    return (numb < 10) ? '0' + numb : numb;
  }

  bDate() {
    const cDate = new Date();
    let sTime = '';
    let sDate = '';

    if (this.isDate) {
      const day = this.bNumb(cDate.getDate());
      const month = this.bNumb(cDate.getMonth() + 1);
      const year = cDate.getFullYear();

      sDate = `${day}.${month}.${year}`;
    }

    if (this.isTime) {
      const hours = this.bNumb(cDate.getHours());
      const min = this.bNumb(cDate.getMinutes());
      const sec = this.bNumb(cDate.getSeconds());

      sTime = `${hours}:${min}:${sec}`;
    }

    if (this.isTime && this.isDate) {
      return `${sTime} ${sDate}  `;
    }

    if (this.isTime) {
      return `${sTime}  `;
    }

    if (this.isDate) {
      return `${sDate}  `;
    }

    return '';
  }

  type(mes) {
    if (!this.isTime && !this.isDate) {
      console.log(this.colors.fg.white, mes, this.colors.reset);
    } else {
      console.log(this.colors.fg.white, this.bDate(), mes, this.colors.reset);
    }
  }

  info(mes) {
    if (!this.isTime && !this.isDate) {
      console.log(this.colors.fg.magenta, mes, this.colors.reset);
    } else {
      console.log(this.colors.fg.magenta, this.bDate(), mes, this.colors.reset);
    }
  }

  success(mes) {
    if (!this.isTime && !this.isDate) {
      console.log(this.colors.fg.green, mes, this.colors.reset);
    } else {
      console.log(this.colors.fg.green, this.bDate(), mes, this.colors.reset);
    }
  }

  warn(mes) {
    if (!this.isTime && !this.isDate) {
      console.log(this.colors.fg.yellow, mes, this.colors.reset);
    } else {
      console.log(this.colors.fg.yellow, this.bDate(), mes, this.colors.reset);
    }
  }

  danger(mes) {
    if (!this.isTime && !this.isDate) {
      console.log(this.colors.fg.red, mes, this.colors.reset);
    } else {
      console.log(this.colors.fg.red, this.bDate(), mes, this.colors.reset);
    }
  }
}

const logger = new Logger();

export default logger;