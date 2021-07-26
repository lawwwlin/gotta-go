//documentready
$(() => {
  const map = L.map('map', {
    center: [48.42959706075791, -123.34509764072138], //set this to user location
    zoom: 13
  });

  L.tileLayer('https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=IWRRuvOlBlyhZTVNm8VO', {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
  }).addTo(map);


  //set to user location
  map.locate({ setView: true, maxZoom: 15 })

  //pans to map 1's coordinates
  const map1Button = document.getElementById('map1');
  map1Button.onclick = function () {
    $.getJSON("http://localhost:8080/api/maps/64", function (result) {
      const latitude = result.maps[0].latitude
      const longitude = result.maps[0].longitude
      console.log(`latitude: ${latitude}, longitude: ${longitude}`)
      map.panTo([latitude, longitude])
    });
  }

  /*    map.panTo([49.24966, -123.11934]) */

  //declare variable as pins.id
  const pinId = L.marker([48.43037425991212, -123.34502630954228], draggable = false, title = 'Little June Cafe')

  pinId.addTo(map)

  // if pinId =

  $('map').on('dblclick', function () {

  })

});
