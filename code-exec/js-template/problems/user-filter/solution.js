function filterUsers(users, minAge) {
    return users.filter(user => user.age > minAge);
}

module.exports = filterUsers;
