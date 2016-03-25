$(document).ready(function() {
  $('.pour') //Pour Me Another Drink, Bartender!
    .delay(2000)
    .animate({
      height: '300px'
      }, 1500)
    .delay(1600)
    .slideUp(500);
  
  $('#liquid') // I Said Fill 'Er Up!
      .hide()
      .show(3400)
    .animate({
      height: '120px'
    }, 2500);
  
  $('.beer-foam') // Keep that Foam Rollin' Toward the Top! Yahooo!
    .delay(3400)
    .animate({
      bottom: '138px'
      }, 2500);
  });