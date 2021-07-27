$(document).ready(function() {
  $.get('/api/users', (obj) => {
    console.log(obj);
    for (const user of obj.users) {
      console.log(user.username);
    }
  });
});

