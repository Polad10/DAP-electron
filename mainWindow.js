let firstLoad = true;

$("a.item").on("click", handleNavClick);

function handleNavClick(e) {
  // prevent from going to the page
  e.preventDefault();

  //set Active class
  $("a.item.active").removeClass("active");
  $(this).addClass("active");

  // get the href and load it
  var href = $(this).attr("href");
  $("#content").load(href, function() {});
}
