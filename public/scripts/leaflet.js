$(document).ready(function() {
  const map = L.map('map', {
    center: [48.42959706075791, -123.34509764072138], //set this to user location
    zoom: 13
  })

  console.log('map.center:', map.getCenter())

  L.tileLayer('https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=IWRRuvOlBlyhZTVNm8VO', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    }).addTo(map);


function makePin(pin) {
  return L.marker([pin.latitude, pin.longitude], title = pin.title).addTo(map)
}
//show all pins
// $.get('/api/pins', (obj) => {
//   for (const pin of obj.pins) {
//     makePin(pin);
//   }
// })

// $.get('/api/pins', (obj) => {
//   for (const pin of obj.pins) {
//     if (pin.latitude >= map.getCenter().lat +- 0.6 && pin.longitude >= pin.longitude + 0.6) {
//       makePin(pin);
//     }
//   }
// })

// pin.on('click', alert("wooooah"));
console.log(arrOfPins);

// if pinId =

$('map').on('dblclick', function() {

  })

});
