const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const logWithColor = (message, color) => {
  console.log(`${colors[color] || colors.reset}${message}${colors.reset}\n`);
};

export { logWithColor };
