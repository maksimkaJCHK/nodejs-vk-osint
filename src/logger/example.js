import logger from './logger.js';

console.log("\n\n")
console.log("***** BASE TERMINAL EXAMPLES *****\n")
console.log("- \\x1b[0m", "  | \x1b[0mReset\x1b[0m")
console.log("- \\x1b[1m", "  | \x1b[1mBold/Bright\x1b[0m")
console.log("- \\x1b[3m", "  | \x1b[3mItalic\x1b[0m")
console.log("- \\x1b[4m", "  | \x1b[4mUnderline\x1b[0m")
console.log("- \\x1b[7m", "  | \x1b[7mReverse\x1b[0m")
console.log("- \\x1b[8m", "  | \x1b[8mHidden\x1b[0m - hidden")
console.log("- \\x1b[9m", "  | \x1b[9mStrike-through\x1b[0m")

console.log("- \\x1b[30m", " | \x1b[30mBlack\x1b[0m")
console.log("- \\x1b[31m", " | \x1b[31mRed\x1b[0m")
console.log("- \\x1b[32m", " | \x1b[32mGreen\x1b[0m")
console.log("- \\x1b[33m", " | \x1b[33mYellow\x1b[0m")
console.log("- \\x1b[34m", " | \x1b[34mBlue\x1b[0m")
console.log("- \\x1b[35m", " | \x1b[35mMagenta\x1b[0m")
console.log("- \\x1b[36m", " | \x1b[36mCyan\x1b[0m")
console.log("- \\x1b[37m", " | \x1b[37mWhite\x1b[0m")

console.log("- \\x1b[40m", " | \x1b[40mBlack Background\x1b[0m")
console.log("- \\x1b[41m", " | \x1b[41mRed Background\x1b[0m")
console.log("- \\x1b[42m", " | \x1b[42mGreen Background\x1b[0m")
console.log("- \\x1b[43m", " | \x1b[43mYellow Background\x1b[0m")
console.log("- \\x1b[44m", " | \x1b[44mBlue Background\x1b[0m")
console.log("- \\x1b[45m", " | \x1b[45mMagenta Background\x1b[0m")
console.log("- \\x1b[46m", " | \x1b[46mCyan Background\x1b[0m")
console.log("- \\x1b[47m", " | \x1b[47mWhite Background\x1b[0m")

console.log("- \\x1b[90m", " | \x1b[90mBright Black\x1b[0m")
console.log("- \\x1b[91m", " | \x1b[91mBright Red\x1b[0m")
console.log("- \\x1b[92m", " | \x1b[92mBright Green\x1b[0m")
console.log("- \\x1b[93m", " | \x1b[93mBright Yellow\x1b[0m")
console.log("- \\x1b[94m", " | \x1b[94mBright Blue\x1b[0m")
console.log("- \\x1b[95m", " | \x1b[95mBright Magenta\x1b[0m")
console.log("- \\x1b[96m", " | \x1b[96mBright Cyan\x1b[0m")
console.log("- \\x1b[97m", " | \x1b[97mBright White\x1b[0m")

console.log("- \\x1b[100m", "| \x1b[100mBright Black Background\x1b[0m")
console.log("- \\x1b[101m", "| \x1b[101mBright Red Background\x1b[0m")
console.log("- \\x1b[102m", "| \x1b[102mBright Green Background\x1b[0m")
console.log("- \\x1b[103m", "| \x1b[103mBright Yellow Background\x1b[0m")
console.log("- \\x1b[104m", "| \x1b[104mBright Blue Background\x1b[0m")
console.log("- \\x1b[105m", "| \x1b[105mBright Magenta Background\x1b[0m")
console.log("- \\x1b[106m", "| \x1b[106mBright Cyan Background\x1b[0m")
console.log("- \\x1b[107m", "| \x1b[107mBright White Background\x1b[0m")

console.log("\n***** 24-BIT RGB COLOR EXAMPLES *****\n")
console.log("- \\x1b[38;2;150;56;78m", "| \x1b[38;2;150;56;78mCustom RGB 'Rose' Font\x1b[0m")
console.log("- \\x1b[38;2;229;255;0m", "| \x1b[38;2;229;255;0mCustom RGB 'Yellow' Font\x1b[0m")

console.log("\n***** 256-COLOR (8-BIT) COLOR EXAMPLES *****\n")

console.log("- \\x1b[48;5;49m", "| \x1b[48;5;49mMint Background\x1b[0m")
console.log("- \\x1b[48;5;45m", "| \x1b[48;5;45mCyan Background\x1b[0m")
console.log("- \\x1b[38;5;33m", "| \x1b[38;5;33mBlue Font\x1b[0m")
console.log("- \\x1b[38;5;61m", "| \x1b[38;5;61mPurple Font\x1b[0m")

console.log("\n\n")

console.log("\x1b[93m\x1b[3m%s", "Phrase");
console.log("\x1b[48;5;49mMint Background\x1b[0m");
console.log("\x1b[93m\x1b[3m%s\x1b[0m", "Phrase");

console.log('Сообщения без группировки');

logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример предупреждения');
logger.error('Пример ошибки');

console.log('Включаю отображение полного года ( logger.enableFullYear() )');
logger.enableFullYear();
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример предупреждения');
logger.warn('Пример Пример предупреждения');
logger.error('Пример ошибки');

console.log('Отключаю отображение полного года ( logger.disableFullYear() )');

logger.disableFullYear();
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример предупреждения');
logger.error('Пример ошибки');

console.log('Ниже идут сгруппированные сообщения');

logger.group('Пример сообщений');
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример Пример предупреждения');
logger.error('Пример ошибки');
logger.endGroup();

logger.disableTime();

logger.group('Пример сообщени без времени ( logger.disableTime() )');
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример предупреждения');
logger.error('Пример ошибки');
logger.endGroup();

logger.disableDate();

logger.group('Пример сообщени без даты ( logger.disableDate() )');
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример предупреждения');
logger.error('Пример ошибки');
logger.endGroup();

logger.enableTime();

logger.group('Включаю время ( logger.enableTime() )');
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример предупреждения');
logger.error('Пример ошибки');
logger.endGroup();

logger.enableDate();

logger.group('Включаю дату ( logger.enableDate() )');
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример предупреждения');
logger.error('Пример ошибки');
logger.endGroup();

logger.disableTimePeriod();

logger.group('Отключаю период ( logger.disableTimePeriod() )');
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример предупреждения');
logger.error('Пример ошибки');
logger.endGroup();

logger.enableTimePeriod();

logger.group("Включаю период ( logger.enableTimePeriod() )");
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример предупреждения');
logger.error('Пример ошибки');
logger.endGroup();

logger.enableBg();

logger.group('Включаю bg ( logger.enableBg() )');
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример предупреждения');
logger.error('Пример ошибки');
logger.endGroup();

logger.disableBg();

logger.group("Отключаю bg ( logger.disableBg() )");
logger.type('Пример типового сообщения');
logger.info('Пример информационного сообщения');
logger.mes('Пример простого сообщения');
logger.success('Пример успешного сообщения');
logger.warn('Пример предупреждения');
logger.error('Пример ошибки');
logger.endGroup();