//load homeWindow when loaded
<<<<<<< HEAD
$(document).ready(function() {
  $("#content").load("./pages/homeWindow.html", function() {});
=======
$(document).ready(function () {
  $("#content").load("./pages/homeWindow.html", function () {});
>>>>>>> 88328b77e1602080f1c961c6b3f4efd114645d91
});

$("a.item").on("click", handleNavClick);

function handleNavClick(e) {
  // prevent from going to the page
  e.preventDefault();

  //set Active class
  $("a.item.active").removeClass("active");
  $(this).addClass("active");

  // get the href and load it
  var href = $(this).attr("href");
  $("#content").load(href, function () {});
}
