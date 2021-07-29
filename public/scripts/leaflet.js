$(() => {
  //set to user location
  map.locate({ setView: true, maxZoom: 15 })
  // console.log(getUser())
  //use getUser(), use window.user




  //const map1 = L.layerGroup([])

  //set to true if create map is selected
  const createMap = false;

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
    })
    return marker;
  }


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

  // map: {{mapleLayer1: [marker1, marker 2]}, {mapleLayer2: [marker1, marker 2]}, {mapleLayer3: [marker1, marker 2]}}
  // add layers to Map
  $.get(`/api/maps/`, (obj) => {
    console.log("getting maps", obj);
    const temp = {};
    const mapLayers = L.layerGroup();
    for (let i = 0; i < obj.maps.length; i++) {
      const map_id = obj.maps[i].id;
      temp[i] = map_id;
      const mapLayer = L.layerGroup();
      mapLayer.addTo(mapLayers);
    }

    let counter = 0;
    mapLayers.eachLayer(function(layer) {
      // assign
      layer.layerID = temp[counter];
      counter+=1;
    });

    //add Pins to layers
    $.get(`/api/pins/`, (obj) => {
      console.log('adding all the pins', obj);
      for (const pin of obj.pins) {
        $.get(`/api/mapPins/${pin.id}`, (obj) => {
          // const { pin_id, creator_id, title, description, image_url, latitude, longitude, map_id } = obj.pins;
          for (let i = 0; i < obj.length; i++) {
            // console.log('map id?', typeof obj[i].map_id)
            // console.log('all the layers', mapLayers.getLayers());
            mapLayers.eachLayer(function (layer) {
              console.log('layer id', layer.layerID, 'map id', obj[i].map_id)
              if (layer.id === obj[i].map_id) {
                console.log('making pin for layer.id');
                makePin(obj[i]).addTo(mapLayers.getLayer(obj[i].map_id));
              }
            });
          }
        });
      }
    });
  });





  // //used to control loading of pins/handle lag
  // map.on('load', function () {
  //   // $.get(`/api/mapPins/${map_id}`, (obj) => {

  //   // });
  //   console.log('on map load');
  //   $.get('/api/pins', (obj) => {
  //     for (const pin of obj.pins) {
  //       //if the pin is in a ~100km radius of the center of the map then it will load to the map
  //       if (radiusCheck(pin, 0.5)) {
  //         makePin(pin);
  //       } else {
  //         map.remove(pin);
  //       }
  //     }
  //   })
  // })


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
