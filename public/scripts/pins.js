$(document).ready(function() {
  $.get('/api/pins', (obj) => {
    console.log('obj:', obj);
    for (const pin of obj.pins) {
      const pin[pin.id] = new L.marker([pin.latitude, pin.longitude], draggable = false, title = pin.title).addTo(map);
    }
  })
});
