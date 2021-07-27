$(document).ready(function() {
  $('.nav-button1').on('click', function() {
    $('.nav-button1').toggleClass('nav-button2');
    $('.sidebar').toggleClass('side', 300, 'easeOutQuint');
  })
});
