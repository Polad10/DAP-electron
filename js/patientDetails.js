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

$("#treatment_list").on("click", handleTreatmentListItemClick);

function handleTreatmentListItemClick() {
  $("#treatment_details_placeholder").show();
  $("#treatment_details_content").hide();
  $(".treatment_details_payment_placeholder").show();
  $(".treatment_details_payment_content").hide();
  $(".treatment_details_loader").addClass("active");

  setTimeout(function () {
    $("#treatment_details_placeholder").hide();
    $("#treatment_details_content").show();
    $(".treatment_details_payment_placeholder").hide();
    $(".treatment_details_payment_content").show();
    $(".treatment_details_loader").removeClass("active");
  }, 1500);
}

$("#calendar_details .segment").dimmer({
  on: "hover",
});

function initialize() {
  // Fill in the treatment name list
  setTimeout(function () {
    $(".dimmer").removeClass("active");
  }, 1500);
}

initialize();
