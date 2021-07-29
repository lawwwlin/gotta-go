$(document).ready(function() {
  $('.nav-button1').on('click', function() {
    $('.nav-button1').toggleClass('nav-button2');
    $('.left-nav').toggleClass('side', 300, 'easeOutQuint');
  })

  $('.toggle_button').on('click', function() {
    $('.toggle_button').toggleClass('toggle_close');
    $('.pin_details').toggleClass('left_side', 300, 'easeOutQuint');
  })
});
