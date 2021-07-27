$(document).ready(function() {
  function pinDeets(pinId) {
    alert("pin clicked!")
  }

  marker.on('click', pinDeets(2))
});
