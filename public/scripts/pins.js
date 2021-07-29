$(document).ready(function() {
    function makePin(pin) {
    const marker = L.marker([pin.latitude, pin.longitude])
    marker.addTo(map)
    const image = `<img src="${pin.image_url}">`
    const title = pin.title;
    const description = pin.description;
    marker.bindPopup(`${image} <br> <h3> ${title} </h3> <br> ${description}`);
  }
  marker.on('click', pinDeets(2))
});


$.get('/api/pins', (obj) => {
  for (const pin of obj.pins) {
    makePin(pin).addTo(map)
  }
});
