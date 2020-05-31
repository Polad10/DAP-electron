$("#patient_menu .item").on("click", handlePatientMenuClick);

function handlePatientMenuClick(e) {
  // prevent from going to the page
  e.preventDefault();

  $(".tabcontent").css({ display: "none" });
  //set Active class
  $("#patient_menu .item.active").removeClass("active");
  $(this).addClass("active");

  let id = $(this).text().trim();
  // get the href and load it
  $(`#${id}`).css({ display: "block" });
}
