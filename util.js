const regex = /^(?=[A-Z])[A-Za-z0-9]{0,61}[A-Za-z0-9]$/;

function isValidName(str) {
  return regex.test(str);
}

module.exports = {
  isValidName,
};
