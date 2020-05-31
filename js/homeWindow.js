$("#AddAppointment_btn").click(function () {});

$("#new_appointment_btn").on("click", handleAddAppointmentBtnClick);

function handleAddAppointmentBtnClick() {
  $("#modal_content").load("./modals/new_appointment.html", () => {
    $("#appointment_modal").modal("show");
    $("#appointment_calendar").calendar({
      type: "datetime",
    });
    $("#treatment_dropdown").dropdown({
      metadata: {
        defaultText: "No Treatment Yet",
        defaultValue: "0",
      },
    });
    $("#patient_dropdown").dropdown();
  });
}

$("#appointment_table tbody tr").on("click", handleAppointmentTableClick);

function handleAppointmentTableClick() {
  let id = $(this).data("id");
  $("#content").load("./pages/patientDetails.html", function () {});
  console.log(id);
}

$("#payment_table tbody tr").on("click", handlePaymentTableClick);

function handlePaymentTableClick() {
  let id = $(this).data("id");
  console.log(id);
}

$("#visit_table tbody tr").on("click", handleVisitTableClick);

function handleVisitTableClick() {
  let id = $(this).data("id");
  console.log(id);
}
