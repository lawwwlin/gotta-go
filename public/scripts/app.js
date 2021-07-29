$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((obj) => {
    for(const user of obj.users) {
      // console.log('app.js', user);
      // $("<div>").text(user.name).appendTo($("body"));
    }
  });
});
