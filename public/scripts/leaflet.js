const userLocation = function() {
  const userCoords = [window.user.latitude, window.user.longitude];
  return userCoords

  // $.get('/api/users/', (obj) => {
  //   const user_id = obj.user_id;
  //   $.get(`/api/users/${user_id}/location`, (obj) => {
  //     const location = [obj.userData[0].latitude, obj.userData[0].longitude];
  //     console.log("location in func: ", location);
  //   })
  // });
};

const createMap = false;

const userDistance = (location) => {return Math.round(map.distance(userLocation(), location))};

function makePin(pin) {
  const marker = L.marker([pin.latitude, pin.longitude]);
  const title = pin.title;
  const description = pin.description;
  //create popup
  marker.bindPopup(`<h3> ${title} </h3> <br> ${userDistance([pin.latitude, pin.longitude])}m away`);
  //behaviour for when marker is clicked
  marker.on('click', function() {
    const $title = $('<header>', {'class': 'pin_title'}).text(title);
    const $img = $('<img>', {'class': 'image'}).attr('src', pin.image_url);
    const $description = $('<p>', { 'class': 'write_up'}).text(description);
    const $descriptionDiv = $('<div>', { 'class': 'description'});
    const $nav = $('<nav>', {'class': 'pin_bar'});
    const $footer = $('<footer>');
    const $rateButton = $('<button>', {'class': 'edit_pin'}).text('Rate Bathroom');
    const $editButton = $('<button>', {'class': 'edit_pin'}).text('edit pin').attr('hidden', true);
    const $addButton = $('<button>', {'class': 'add_pin'}).attr('hidden', true).text('report pin');
    if (createMap){
      $addButton.attr('hidden', false);
    };
    $descriptionDiv.append($img, $description);
    $footer.append($rateButton, $editButton, $addButton);
    $nav.append($title, $descriptionDiv, $footer);
    $('div.pin_container').empty();
    $('div.pin_container').append($nav);
    $('div.pin_details').addClass('left_side') //animate this
    $('.toggle_button').removeClass('toggle_close').addClass('toggle_open')
    // $('.pin_details').toggleClass('left_side', 300, 'easeOutQuint');
    // $('.toggle_button').toggleClass('toggle_close');
  })
  return marker;
}
$(() => {
  //set to user location
  map.locate({ setView: true, maxZoom: 15 })
  // console.log(getUser())
  //use getUser(), use window.user



  //const map1 = L.layerGroup([])

  //set to true if create map is selected




  //only load pins within radius
  function radiusCheck(pin, rad) {
    const mapLng = map.getCenter().lng
    const mapLat = map.getCenter().lat
    if (mapLat - rad <= pin.latitude && pin.latitude <= mapLat + rad) {
      if (mapLng - rad <= pin.longitude && pin.longitude <= mapLng + rad) {
        return true;
      }
    }
  }

  //add Pins to Map
  $.get('/api/pins', (obj) => {
    for (const pin of obj.pins) {
      makePin(pin).addTo(map)
    }
  });


  //used to control loading of pins/handle lag
  map.on('load', function () {
    $.get('/api/pins', (obj) => {
      for (const pin of obj.pins) {
        //if the pin is in a ~100km radius of the center of the map then it will load to the map
        if (radiusCheck(pin, 0.5)) {
          makePin(pin);
        } else {
          map.remove(pin);
        }
      }
    })
  })


  //only works for buttons with class of "mapButtons"
  const elements = document.getElementsByClassName("mapButtons")

  //pans to map [x]'s coordinates
  $(elements).on('click', function () {
    const zoom = 14;
    const buttonID = (this.id);

    $.getJSON(`http://localhost:8080/api/maps/${buttonID}`, function (result) {
      const latitude = result.maps[0].latitude
      const longitude = result.maps[0].longitude
      map.panTo([latitude, longitude], zoom);
    })
  })

  //################################################################## maps stuff ##################################################################
});
