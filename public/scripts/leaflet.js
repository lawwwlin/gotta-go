$(document).ready(function() {
  const map = L.map('map', {
    center: [48.42959706075791, -123.34509764072138], //set this to user location
    zoom: 13
  })

  console.log('map.center:', typeof(map.getCenter().lat))

  L.tileLayer('https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=IWRRuvOlBlyhZTVNm8VO', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(map);


function makePin(pin) {
  return L.marker([pin.latitude, pin.longitude], title = pin.title).addTo(map)
}


const mapLat = map.getCenter().lat
const mapLng = map.getCenter().lng

function radiusCheck(pin, rad) {
  if (mapLat - rad <= pin.latitude && pin.latitude <= mapLat + rad) {
    if (mapLng - rad <= pin.longitude && pin.longitude <= mapLng + rad){
      return true;
    }
  }
}

//show all pins
// $.get('/api/pins', (obj) => {
//   for (const pin of obj.pins) {
//     makePin(pin);
//   }
// })

//map.on('drag', {
  $.get('/api/pins', (obj) => {
    for (const pin of obj.pins) {
      //if the pin is in a ~100km radius of the center of the map then it will load to the map
      if (radiusCheck(pin, 0.6)) {
        makePin(pin);
      } else {
        console.log('no pin in range')
      }
    }
  })
//})

// pin.on('click', alert("wooooah"));
console.log(arrOfPins);

// if pinId =

$('map').on('dblclick', function() {

  })

});
