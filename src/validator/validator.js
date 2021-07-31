exports.isValidRole = (userRole, role) => {
    if (userRole === role) {
        return true;
    } else {
        return false;
    }
};
