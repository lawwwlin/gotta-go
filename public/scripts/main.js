// define a default user location at Vancouver
window.user = {latitude: 49.260833, longitude: -123.113889};

$(document).ready(function() {

  /* get current logged in user object from the users table and set it to global variable
  which includes id, username, password, latitue, longitude */
  const getUser = () => {
    $.get('/api/users/me', (obj) => {
      window.user = obj;
      console.log('logged in user is:', window.user);
    });
  };

  getUser();

  const makeUserPin = (lat, long, content) => {
    const latlng = L.latLng(lat, long);
    const myIcon = L.icon({
      iconUrl: src='/images/poop.png',
      iconSize: [38, 38],
      iconAnchor: [20, 20],
      popupAnchor: [0, -15]
    });
    const marker = L.marker(latlng, { icon: myIcon }).addTo(window.map);
    const popup = L.popup().setContent(content);
    marker.bindPopup(popup).openPopup();
    map.panTo([lat, long], 15);
  };

  const updateUserLocation = () => {
    window.map.locate({ setView: true, maxZoom: 15 })
    .on('locationfound', function(e) {
      window.user.latitude = e.latitude;
      window.user.longitude = e.longitude;
      const radius = e.accuracy / 2;
      makeUserPin(e.latitude, e.longitude, `<p>You are within ${radius} meters from this point</p>`);
      L.circle(e.latlng, radius).addTo(window.map);
      if (userIsLoggedIn()) {
        setUserLocation(window.user);
      }
    })
    // if location not found or blocked
    .on('locationerror', function(e) {
      console.log('location blocked, user lat:', window.user.latitude, 'long:', window.user.longitude);
      if (userIsLoggedIn()) {
        makeUserPin(window.user.latitude, window.user.longitude, `<p>Your last location was here</p>`);
      } else {
        makeUserPin(window.user.latitude, window.user.longitude, `<p>No location found, default to Vancouver City Hall</p>`);
      }
    });
  };

  // patch via ajax current logged in user latitude and longitude in the users table
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

  const getMapNearUserLocation = () => {
    console.log(window.user);
    $.get(`/api/maps/${window.user.latitude}/${window.user.longitude}`, (obj) => {
      console.log('map obj according to location', obj.maps);
      const mapDiv = $('.mapButtons')
      mapDiv.empty();
      for (let i = 0; i < obj.maps.length; i++) {
        const map_name = obj.maps[i].name;
        const map_id = obj.maps[i].id;
        const mapButton = $(`<div><button>${map_name}</button></div>`);
        $(mapButton).attr('id', `${map_id}`);
        mapButton.addClass('map-button');
        mapButton.appendTo(mapDiv);
      }
    });
  };

  // when clicked, pans to specific map's coordinates
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
  });













  $.get('/api/users', (obj) => {
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

        $(".sidebar header").text(`user: ${username}`);
        const $createButton = $('<footer><button>create map</button></footer>');
        $createButton.appendTo($('.sidebar'));
        console.log('create button', $createButton);

        updateUserLocation();

        //only works for buttons with class of "mapButtons"
        const mapDiv = document.getElementsByClassName("mapButtons")

        for (let i = 0; i < obj.userData.length; i++) {
          const map_name = obj.userData[i].map_name;
          const map_id = obj.userData[i].map_id;
          const $mapButton = $(`<div><button>${map_name}</button></div>`);
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
            const map_id = result.maps[0].id;
            const map_lat = result.maps[0].latitude;
            const map_long = result.maps[0].longitude;
            map.panTo([map_lat, map_long], zoom);
            const $sidebar = $('.sidebar');
            $sidebar.empty();

            $.get(`/api/mapPins/${map_id}`, (obj) => {
              console.log(`get map-pins: ${obj}`)
              for (let i = 0; i < obj.length; i++) {
                const pin_id = obj[i].pin_id;
                const pinButton = $(`<div><button>${pin_id}</button></div>`);
                $(pinButton).attr('id', `${pin_id}`);
                pinButton.appendTo($('.sidebar'));
              }
            })
          })
        })

        const $form = $(`<form>
            <input type="hidden" name="creator_id" value="${user_id}" />

            <label for="name">Map name:</label><br><br>
            <input type="text" name="name" id="name" placeholder="Map Name3" /><br><br>

            <label for="latitude">Latitude:</label><br><br>
            <input type="text" name="latitude" id="latitude" placeholder="48.2827" /><br><br>

            <label for="longitude">Longitude:</label><br><br>
            <input type="text" name="longitude" id="longitude" placeholder="-124.1207" /><br><br>
            <button type="submit">submit</button>
          </form> `);

        $('.sidebar footer').on('click', function () {
          const $sidebar = $('.sidebar');
          $sidebar.empty();
          $form.appendTo($sidebar);
        });

        $form.submit((event) => {
          event.preventDefault();
          const data = $form.serialize();
          $.post(`/api/maps/`, data)
            .then(() => {
              console.log(data);
              $.get(`/api/users/${user_id}`, (obj) => {
                location.reload();
              });
            });
        });
      });

      //favourite map buttons
      $.get(`/api/faveMaps/${user_id}`, (obj) => {
        const mapDiv = $(".mapButtons");
        const $faveMapNav = $(`</br>
          <h3> Favourite Maps </h3>
        `)
        $faveMapNav.appendTo(mapDiv)
        for (let i = 0; i < obj.length; i++) {
          const map = obj[i].map_id
          console.log(`map: ${map}`)
          const $faveMapButton = $(`<div><button>${map}</button></div>`);
          $($faveMapButton).attr('id', `${map}`);
          $faveMapButton.addClass('fav-map-button');
          $faveMapButton.appendTo(mapDiv);

        }

        //on click will zoom to map area
        $('.fav-map-button').on('click', function () {
          const zoom = 14;
          const buttonID = $(this).attr('id');
          console.log("button ID = " + buttonID);

          $.getJSON(`http://localhost:8080/api/maps/${buttonID}`, function (result) {
            //console.log('result', result);
            const map_id = result.maps[0].id;
            const map_lat = result.maps[0].latitude;
            const map_long = result.maps[0].longitude;
            map.panTo([map_lat, map_long], zoom);
          })
        })
      })

      //create map button
      const $form = $(`<form>
      <input type="hidden" name="creator_id" value="${user_id}" />

      <label for="name">Map name:</label><br><br>
      <input type="text" name="name" id="name" placeholder="Map Name3" /><br><br>

      <label for="latitude">Latitude:</label><br><br>
      <input type="text" name="latitude" id="latitude" placeholder="48.2827" /><br><br>

      <label for="longitude">Longitude:</label><br><br>
      <input type="text" name="longitude" id="longitude" placeholder="-124.1207" /><br><br>
      <button type="submit">submit</button>
      </form> `);

      $('.sidebar footer').on('click', function () {
      const $sidebar = $('.sidebar');
      $sidebar.empty();
      $form.appendTo($sidebar);
      });

      $form.submit((event) => {
        event.preventDefault();
        const data = $form.serialize();
        $.post(`/api/maps/`, data)
          .then(() => {
            console.log(data);
            $.get(`/api/users/${user_id}`, (obj) => {
              location.reload();
            });
          });
      });

      // user is not logged in
    } else {
      const $header = $('.sidebar h3');
      $header.text('Nearby Maps');
      updateUserLocation();
      getMapNearUserLocation();
    }
  });
});
