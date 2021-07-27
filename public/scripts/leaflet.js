//documentready
$(() => {
  const map = L.map('map', {
    center: [48.42959706075791, -123.34509764072138],
    zoom: 13
  })

  //set to user location
  map.locate({ setView: true, maxZoom: 15 })

  L.tileLayer('https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=IWRRuvOlBlyhZTVNm8VO', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(map);

  //const map1 = L.layerGroup([])

  //create marker for map
  function makePin(pin) {
    const marker = L.marker([pin.latitude, pin.longitude])
    marker.addTo(map)
    const image = `<img src="${pin.image_url}">`
    const title = pin.title;
    const description = pin.description;
    marker.bindPopup(`${image} <br> <h3> ${title} </h3> <br> ${description}`);
  }


  //only load pins within radius
  function radiusCheck(pin, rad) {
  const mapLng = map.getCenter().lng
  const mapLat = map.getCenter().lat
  if (mapLat - rad <= pin.latitude && pin.latitude <= mapLat + rad) {
    if (mapLng - rad <= pin.longitude && pin.longitude <= mapLng + rad){
        return true;
      }
    }
  }

  $.get('/api/pins', (obj) => {
    for (const pin of obj.pins) {
     makePin(pin)
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
          console.log('no pin in range')
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
    console.log("ID = " + buttonID);

    $.getJSON(`http://localhost:8080/api/maps/${buttonID}`, function (result) {
      const latitude = result.maps[0].latitude
      const longitude = result.maps[0].longitude
      map.panTo([latitude, longitude], zoom);
    })
  })
});
