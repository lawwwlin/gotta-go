$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((obj) => {
    for(const user of obj.users) {
      console.log(user);
      // $("<div>").text(user.name).appendTo($("body"));
    }
  });
});
