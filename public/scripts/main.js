//             merge pins side bar
// ***** TODO: make onclick function for pins
//             make map a layer group that contains pins
//             make button for user to favourite a map
//             show distance away from the user in the pin panel
//             rating system


// define a default user location at Vancouver
window.user = { latitude: 49.260833, longitude: -123.113889 };

$(document).ready(function() {
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
        const mapButton = $(`<div>${map_name}</div><br>`);
        $(mapButton).attr('id', `${map_id}`);
        mapButton.addClass('map-button');
        mapButton.appendTo(mapDiv);
      }
    });
  };

  // clicking any map button
  $('.sidebar').on('click', '.map-button' ,function () {
    const zoom = 14;
    const buttonID = $(this).attr('id');
    console.log("button ID = " + buttonID);

    $.getJSON(`http://localhost:8080/api/maps/${buttonID}`, function (result) {
      console.log('result', result);
      const map_id = result.maps[0].id;
      const map_lat = result.maps[0].latitude;
      const map_long = result.maps[0].longitude;
      const map_name = result.maps[0].name;
      map.panTo([map_lat, map_long], zoom);
      const $sidebar = $('.sidebar');
      $sidebar.empty();

      $.get(`/api/mapPins/${map_id}`, (obj) => {
        const $h3 = $(`<div><h3>Pins for ${map_name}</h3></div><br>`);
        $h3.appendTo($('.sidebar'));
        for (let i = 0; i < obj.length; i++) {
          const {pin_id, title, latitude, longitude} = obj[i];
          const pinButton = $(`<div class='pinButtons'>${title} @${latitude}, ${longitude}</div><br>`);
          $(pinButton).attr('id', `${pin_id}`);
          pinButton.appendTo($h3);
        }})
      .then(() => {
        const $backButton = $('</br><button>back</button>')
        $backButton.appendTo($('.sidebar'))
        $($backButton).on('click', function () {
          renderNav();
        });
      })
    })
  });


  const renderNavLoggedIn = () => {
    const user_id = window.user.id;
    $('.sidebar').empty();
    const $userMaps = $(`<header>user not logged in</header>
      <div>
        <h3>User Maps</h3>
        <div class='mapButtons'></div>
      </div>`);
    $userMaps.appendTo($('.sidebar'));
    $.get(`/api/users/${user_id}`, (obj) => {
      console.log(`user ${user_id}`, obj);
      console.log(`username`, obj.userData[0].username);
      username = obj.userData[0].username;

      // update sidebar username
      $(".sidebar header").text(`user: ${username}`);
      const $createButton = $('<footer><button class="createMap">create map</button></footer>');
      $createButton.appendTo($('.sidebar'));

      const mapDiv = $(".mapButtons");

      for (let i = 0; i < obj.userData.length; i++) {
        const map_name = obj.userData[i].map_name;
        const map_id = obj.userData[i].map_id;
        const $mapButton = $(`<div>${map_name}</div><br>`);
        $($mapButton).attr('id', `${map_id}`);
        $mapButton.addClass('map-button');
        // console.log('map button:', mapButton);
        // console.log('map button id', mapButton.attr('id'));
        $mapButton.appendTo(mapDiv);
      }


    });

    // create map form
    const $form = $(`<form>
        <input type="hidden" name="creator_id" value="${user_id}" />

        <label for="name">Map name:</label><br><br>
        <input type="text" name="name" id="name" placeholder="Map Name" /><br><br>

        <label for="latitude">Latitude:</label><br><br>
        <input type="text" name="latitude" id="latitude" placeholder="49.260833" /><br><br>

        <label for="longitude">Longitude:</label><br><br>
        <input type="text" name="longitude" id="longitude" placeholder="-123.113889" /><br><br>
        <span></span> <br><br>
        <button type="submit" id="submitButton" value="Submit">submit</button>
        <button type="button" id="cancelButton">Cancel</button>
      </form> `);

    $('.sidebar').on('click', '.createMap', function() {
      const $sidebar = $('.sidebar');
      $sidebar.empty();
      $form.appendTo($sidebar);
    });

    // form submit button
    $form.submit((event) => {
      event.preventDefault();
      if ($.trim($("#name").val()) === "" || $.trim($("#latitude").val()) === "" || $.trim($("#longitude").val()) === "") {
        return $( "span" ).text( "One of the field is empty!" ).show().fadeOut( 4000 );
      } else if (isNaN(parseFloat($.trim($("#latitude").val()))) || isNaN(parseFloat($.trim($("#longitude").val())))) {
        return $( "span" ).text( "Please be mature and input proper latitude or longitude!" ).show().fadeOut( 4000 );
      }
      const data = $form.serialize();
      $.post(`/api/maps/`, data)
      .then(() => {
        console.log(data);
        $.get(`/api/users/${user_id}`, (obj) => {
          renderNav();
        });
      });
    });


    $form.on('click', '#cancelButton', () => {
      console.log('cancel button');
      renderNav();
    });

    //WIP
    $('button.cancel').on('click', function () {
      $sidebar.empty()
    })

    //form submit for creating pins
    const $pinform = $(`<form>
    <input type="hidden" name="creator_id" value="${user_id}" />

    <label for="title">Pin Name:</label><br><br>
    <input type="text" name="name" id="name" placeholder="New Pin" /><br><br>

    <label for="description">Description:</label><br><br>
    <input type="text" name="latitude" id="latitude" placeholder="48.2827" /><br><br>

    <label for="img_url">Image URL:</label><br><br>
    <input type="text" name="longitude" id="longitude" placeholder="-124.1207" /><br><br>
    <p class="submit_popup">Please click on the map where you would like to create your pin.</p>
    <label for="latitude" class="pinlat" hidden></label><br>
    <label for="longitude" class="pinlng" hidden></label><br>
    <button class="submit_popup" type="submit" hidden>submit</button>
    <button class="cancel">cancel</button>
    </form> `);

    //change button layout
    $('button#createPin').on('click', function () {
      const $pin_bar = $('div.pin_container');
      $pin_bar.empty();
      $pin_bar.append($pinform);
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
        $('label.pinlat').show().text(`latitude: ${e.latlng.lat}`)
        $('label.pinlng').show().text(`longitude: ${e.latlng.lng}`)
      });
    })

    //     WIP
    // $pinform.submit((event) => {
    //   event.preventDefault();
    //   const data = $pinform.serialize();
    //   $.post(`/api/pins/`, data)
    //     .then(() => {
    //       console.log(data);
    //       $.get(`/api/users/${user_id}`, (obj) => {
    //         location.reload();
    //       });
    //     });
    // });

    $('button.cancel').on('click', function () {
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
    //maybe some more code here


    //favourite map buttons
    $.get(`/api/faveMaps/${user_id}`, (obj) => {
      const mapDiv = $(".mapButtons");
      const $faveMapNav = $(`</br>
        <h3> Favourite Maps </h3>
      `)
      $faveMapNav.appendTo(mapDiv)
      console.log('fav maps:', obj);
      for (let i = 0; i < obj.length; i++) {
        const {id, name, username} = obj[i];
        const $faveMapButton = $(`<div>${name}<br>created by: ${username}</div><br>`);
        $($faveMapButton).attr('id', `${id}`);
        $faveMapButton.addClass('map-button');
        $faveMapButton.appendTo(mapDiv);
      }
    })

  };

  /* get current logged in user object from the users table and set it to global variable
  which includes id, username, password, latitue, longitude */
  const getUser = (callback) => {
    $.get('/api/users/me', (obj) => {
      console.log('logged in user is:', window.user);
      window.user = obj;
      callback();
    });
  };

  getUser(() => {
    renderNav();
  });

  const renderNav = () => {
    if (userIsLoggedIn()) {
      console.log('user is logged in');
      updateUserLocation();
      renderNavLoggedIn();
    } else {
      console.log('usr is not logged in');
      const $sidebar = $('.sidebar');
      $sidebar.empty();
      const $nearbyMaps = $(`<header>user not logged in</header>
      <div>
        <h3>Nearby Maps</h3>
        <div class='mapButtons'></div>
      </div>`);
      $nearbyMaps.appendTo($sidebar);
      updateUserLocation();
      getMapNearUserLocation();
    }
  };
});
