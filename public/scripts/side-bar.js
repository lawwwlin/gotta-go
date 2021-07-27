$(document).ready(function() {
  $.get('/api/users', (obj) => {
    console.log('side-bar.js', obj);
    for (const user of obj.users) {
      console.log(user.username);
    }

    const user_id = obj.user_id;
    $.get(`/api/users/${user_id}`, (obj) => {
      console.log('user:', user_id);
      console.log(`user ${user_id}`, obj);
      console.log(`username`, obj.userData[0].username);
      $(".sidebar header").text(`user: ${obj.userData[0].username}`);
    });
  });

});

