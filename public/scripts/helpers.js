// helper functions that can get called by any script

const userIsLoggedIn = () => {
  // if the current user has a username, which means this user is updated from getUser();
  if (window.user.username) {
    return true;
  }
  return false;
};

const setUserLocation = (user) => {
  $.ajax({
    url: `http://localhost:8080/api/users/${user.id}`,
    type: 'PATCH',
    data: { latitude: user.latitude, longitude: user.longitude },
    success: function () {
      console.log(`user location Successfully Patched! user lat: ${user.latitude}, user long:${user.longitude}`);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // log the error to the console
      console.log("The following error occured: " + textStatus, errorThrown);
    },
    complete: function () {
      console.log("Patching completed");
    }
  })
};

const getUser = () => {
  $.get('/api/users/me', (obj) => {
    window.user = obj;
    console.log('logged in user is:', window.user);
  });
};

