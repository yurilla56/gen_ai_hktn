export default {
  setUser: function(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },
  getUser: function() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  removeUser: function() {
    localStorage.removeItem('user');
  }
}
