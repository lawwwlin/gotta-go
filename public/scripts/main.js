// define a default user location at Vancouver
window.user = {latitude: 49.260833, longitude: -123.113889};

$(document).ready(function() {
  getUser();


  // patch via ajax current logged in user latitude and longitude in the users table


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

        $.get(`/api/users/`, (obj) => { });

        // <div class="favourites">
        //   <h3>Favourited Maps</h3>
        //   <ul>Map2</ul>
        // </div>
        // <footer>
        //   <button>create map</button>
        //   <button>create pin</button>
        // </footer>


        $(".sidebar header").text(`user: ${username}`);
        const $createButton = $('<footer><button id="createMap">create map</button><button id="createPin">create pin</button></footer>');
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

        //creates the create map form
        const $form = $(`<form>
            <input type="hidden" name="creator_id" value="${user_id}" />

            <label for="name">Map name:</label><br><br>
            <input type="text" name="name" id="name" placeholder="Map Name3" /><br><br>

            <label for="latitude">Latitude:</label><br><br>
            <input type="text" name="latitude" id="latitude" placeholder="48.2827" /><br><br>

            <label for="longitude">Longitude:</label><br><br>
            <input type="text" name="longitude" id="longitude" placeholder="-124.1207" /><br><br>
            <button type="submit">submit</button>

            <button class = "cancel">Cancel</button>
          </form> `);

        $('button#createMap').on('click', function () {
          const $sidebar = $('.sidebar');
          $sidebar.empty();
          $form.appendTo($sidebar);
        });


        $form.submit((event) => {
          event.preventDefault();
          const data = $form.serialize();
          console.log(data);
          $.post(`/api/maps/`, data)
            .then(() => {
              $.get(`/api/users/${user_id}`, (obj) => {
                location.reload();
              });
            });
        });

        //form submit for creating pins
        const $pinform = $(`<form>
        <input type="hidden" name="creator_id" value="${user_id}" />

        <label for="title">Pin Name:</label><br><br>
        <input type="text" name="title" id="name" placeholder="New Pin" /><br><br>

        <label for="description">Description:</label><br><br>
        <textarea type="text" name="description" placeholder="description" /><br><br>

        <label for="img_url">Image URL:</label><br><br>
        <input type="text" name="image_url" id="longitude" placeholder="image url" /><br><br>
        <p class="submit_popup">Please click on the map where you would like to create your pin.</p>
        <label for="latitude" class="pinlat" hidden></label><br>
        <input type="text" class="pinlat" name="latitude" hidden />
        <label for="longitude" class="pinlng" hidden></label><br>
        <input type="text" class="pinlng" name="longitude" hidden/>
        <button class="submit_popup" type="submit" hidden>submit</button>
        </form>

        <button class="cancel" type="cancel">cancel</button>

      `);

        //change button layout
        $('button#createPin').on('click', function () {
          const $pin_bar = $('div.pin_container');
          $pin_bar.empty();
          $pin_bar.append($pinform);
          //make pin-bar appear if tucked away
          $('div.pin_details').removeClass('left_side') //animate this
          $('.toggle_button').removeClass('toggle_close').addClass('toggle_open')
          let marker = {};
          map.on('click', function(e) {
            lat = e.latlng.lat;
            lon = e.latlng.lng;
            if (marker != undefined) {
              map.removeLayer(marker);
            };
            marker=L.marker(e.latlng).addTo(window.map);
            marker.bindPopup(`Right here? <button>Yes</button><button>No</button>`).openPopup();
            $('p.submit_popup').hide();
            $('button.submit_popup').show();
            $('label.pinlat').show().text(`latitude: ${e.latlng.lat}`);
            $('label.pinlng').show().text(`longitude: ${e.latlng.lng}`);
            $('input.pinlng').val(lon);
            $('input.pinlat').val(lat);
          });

          $('button.cancel').on('click', function () {
            console.log('cancel clicked')
            map.off('click', function(e) {
              lat = e.latlng.lat;
              lon = e.latlng.lng;
              if (marker != undefined) {
                map.removeLayer(marker);
              };
              marker=L.marker(e.latlng).addTo(window.map);
              marker.bindPopup(`Right here? <button>Yes</button><button>No</button>`).openPopup();
              $('p.submit_popup').hide();
              $('button.submit_popup').show();
              $('label.pinlat').show().text(`latitude: ${e.latlng.lat}`)
              $('label.pinlng').show().text(`longitude: ${e.latlng.lng}`)
            });
            $pin_bar.empty();
            $('.pin_details').toggleClass('left_side', 300, 'easeOutQuint');
            $('.toggle_button').toggleClass('toggle_close');
            map.removeLayer(marker);
          });
        })

        //     WIP
        $pinform.submit((event) => {
          event.preventDefault();
          const data = $pinform.serialize();
          console.log('data: ', data)
          map.off('click', function(e) {
            lat = e.latlng.lat;
            lon = e.latlng.lng;
            if (marker != undefined) {
              map.removeLayer(marker);
            };
            marker=L.marker(e.latlng).addTo(window.map);
            marker.bindPopup(`Right here? <button>Yes</button><button>No</button>`).openPopup();
            $('p.submit_popup').hide();
            $('button.submit_popup').show();
            $('label.pinlat').show().text(`latitude: ${e.latlng.lat}`)
            $('label.pinlng').show().text(`longitude: ${e.latlng.lng}`)
          });
          $.post(`/api/pins/`, data)
            .then(() => {
              console.log(data);
              $.get(`/api/users/${user_id}`, (obj) => {
                location.reload();
              });
            });
        });

          //maybe some more code here
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
