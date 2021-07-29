// helper functions that can get called by any script

const userIsLoggedIn = () => {
  // if the current user has a username, which means this user is updated from getUser();
  if (window.user.username) {
    return true;
  }
  return false;
};
