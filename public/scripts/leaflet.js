$(document).ready(function() {
const map = L.map('map', {
  center: [48.42959706075791, -123.34509764072138], //set this to user location
  zoom: 13
});

L.tileLayer('https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=IWRRuvOlBlyhZTVNm8VO', {
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);

L.marker([48.43037425991212, -123.34502630954228], draggable = false, tile = 'Little June Cafe').addTo(map)

});
