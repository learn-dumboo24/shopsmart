// In-memory user store - swap this with MongoDB queries later
const users = [];

function findByEmail(email) {
  return users.find(u => u.email === email.toLowerCase());
}

function findById(id) {
  return users.find(u => u.id === id);
}

function createUser(user) {
  users.push(user);
  return user;
}

function getAllUsers() {
  return users;
}

module.exports = { users, findByEmail, findById, createUser, getAllUsers };
