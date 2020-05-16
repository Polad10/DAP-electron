$("#AddAppointment_btn").click(function () {
  $(".ui.modal").modal("show");
  $("#appointment_calendar").calendar({
    type: "datetime",
  });
  $("#patient_dropdown").dropdown();
  $("#treatment_dropdown").dropdown({
    metadata: {
      defaultText: "No Treatment Yet",
      defaultValue: "0",
    },
  });
});
