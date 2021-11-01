exports.isValidRole = (userRole, role) => {
  if (userRole === role) {
    return true;
  } else {
    return false;
  }
};

exports.isRefNumberExist = (paymentData) => {
  if (paymentData !== null) {
    return true;
  }
  return false;
};
