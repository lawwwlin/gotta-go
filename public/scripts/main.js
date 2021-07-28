$(document).ready(function() {
  $.get('/api/users', (obj) => {
    // console.log('side-bar.js', obj);
    for (const user of obj.users) {
      // console.log(user.username);
    }

    // <header>user:</header>
    // <div>
    //   <h3>User maps</h3>
    //   <div class='mapButtons'></div>
    // </div>
    const $userMaps = $(`<header>user not logged in</header>
    <div>
      <h3>User maps</h3>
      <div class='mapButtons'></div>
    </div>
    `);

    $userMaps.appendTo($('.sidebar'));



    let username, user_lat, user_long;
    // console.log('object is: ', obj);
    if (obj.user_id) {
      // if user_id exist:
      const user_id = obj.user_id;
      $.get(`/api/users/${user_id}`, (obj) => {
        console.log(`user ${user_id}`, obj);
        console.log(`username`, obj.userData[0].username);
        username = obj.userData[0].username;
        user_lat = obj.userData[0].user_lat;
        user_long = obj.userData[0].user_long;

        // <div class="favourites">
        //   <h3>Favourited Maps</h3>
        //   <ul>Map2</ul>
        // </div>
        // <footer>
        //   <button>create map</button>
        //   <button>create pin</button>
        // </footer>

        $(".sidebar header").text(`user: ${username}`);
        const $createButton = $('<footer><button>create map</button></footer>');
        $createButton.appendTo($('.sidebar'));

        $createButton.on('click', function() {
          $('.sidebar').empty();
        });

        // const map = L.map('map', {
        //   center: [user_lat, user_long], //set this to user location
        //   zoom: 13
        // });

        // L.tileLayer('https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=IWRRuvOlBlyhZTVNm8VO', {
        //   attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        // }).addTo(map);


        // get user location
        map.locate({ setView: true, maxZoom: 15 });

        // patch user location in the database
        // ***********still need to check if it's actually patching*********
        $.ajax({
          url : `http://localhost:8080/api/users/${user_id}`,
          type : 'PATCH',
          data : {latitude: user_lat, longitude: user_long},
          success : function() {
              console.log("user location Successfully Patched!");
          },
          error : function(jqXHR, textStatus, errorThrown) {
              // log the error to the console
              console.log("The following error occured: " + textStatus, errorThrown);
          },
          complete : function() {
              console.log("Patching completed");
          }
        });

        //only works for buttons with class of "mapButtons"
        const mapDiv = document.getElementsByClassName("mapButtons")

        for (let i = 0; i < obj.userData.length; i++) {
          const map_name = obj.userData[i].map_name;
          const map_id = obj.userData[i].map_id;
          const $mapButton = $(`<button>${map_name}</button>`);
          $($mapButton).attr('id', `${map_id}`);
          $mapButton.addClass('map-button');
          // console.log('map button:', mapButton);
          // console.log('map button id', mapButton.attr('id'));
          $mapButton.appendTo(mapDiv);
        }

        //pans to map [x]'s coordinates
        $('.map-button').on('click', function () {
          const zoom = 14;
          const buttonID = $(this).attr('id');
          console.log("button ID = " + buttonID);

          $.getJSON(`http://localhost:8080/api/maps/${buttonID}`, function (result) {
            console.log('result', result);
            const map_lat = result.maps[0].latitude;
            const map_long = result.maps[0].longitude;
            map.panTo([map_lat, map_long], zoom);
          })
        })
      });

      // user does not exist
    } else {
      const $header = $('.sidebar h3');
      $header.text('Nearby Maps');

      // set default lat long
      user_lat = 49.260833;
      user_long = 123.113889;

      // const map = L.map('map', {
      //   center: [user_lat, user_long], //set this to user location
      //   zoom: 13
      // });

      // L.tileLayer('https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=IWRRuvOlBlyhZTVNm8VO', {
      //   attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
      // }).addTo(map);


      //set map to user location
      map.locate({ setView: true, maxZoom: 15 })
        .on('locationfound', function(e) {
          user_lat = e.latitude;
          user_long = e.longitude;
          console.log('updated user location: lat:', user_lat, 'long:', user_long )
          var radius = e.accuracy / 2;
          L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point").openPopup();
          L.circle(e.latlng, radius).addTo(map);
          const $continueButton = $(`<a href="http://localhost:8080/api/maps/${user_lat}/${user_long}"><button>Continu without logging in</button></a>`);
          $continueButton.addClass('continue-button');
          $continueButton.appendTo($('.sidebar'));
          $.get(`/api/maps/${user_lat}/${user_long}`, (obj) => {
            console.log('map obj according to location',obj);

          //   const mapDiv = document.getElementsByClassName("mapButtons")
          //   for (let i = 0; i < obj.userData.length; i++) {
          //     const map_name = obj.userData[i].map_name;
          //     const map_id = obj.userData[i].map_id;
          //     const mapButton = $(`<button>${map_name}</button>`);
          //     $(mapButton).attr('id', `${map_id}`);
          //     mapButton.addClass('map-button');
          //     // console.log('map button:', mapButton);
          //     // console.log('map button id', mapButton.attr('id'));
          //     mapButton.appendTo(mapDiv);
          //   }

          //   //pans to map [x]'s coordinates
          //   $('.map-button').on('click', function () {
          //     const zoom = 14;
          //     const buttonID = $(this).attr('id');
          //     console.log("button ID = " + buttonID);

          //     $.getJSON(`http://localhost:8080/api/maps/${buttonID}`, function (result) {
          //       console.log('result', result);
          //       const map_lat = result.maps[0].latitude;
          //       const map_long = result.maps[0].longitude;
          //       map.panTo([map_lat, map_long], zoom);
          //     })
          //   })

          //   //declare variable as pins.id
          //   const pinId = L.marker([48.43037425991212, -123.34502630954228], draggable = false, title = 'Little June Cafe')

          //   pinId.addTo(map)

          //   // if pinId =

          //   $('map').on('dblclick', function () {

          //   })

          });
        });


      // $('.continue-button').on('click', function(e) {
      //   e.preventDefault();
      //   console.log('not logging in clicked');
      //   window.location = `http://localhost:8080/api/maps/${user_lat}/${user_long}`;
      // });



    }
  });
});
