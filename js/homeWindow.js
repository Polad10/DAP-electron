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

function initialize()
{
  initializePaymentTable();
  initializeAppointmentTable();
  initializeVisitTable();
}

function initializePaymentTable()
{
  var Payment = require('./db_models/payment').Payment;

  Payment.getAll((err, rows) => {
    this.payments = rows;
    
    $('#payment_table > tbody').empty();
    
    for(let i = 0; i < 5; i++)
    {
      let r = rows[i];

      $('#payment_table > tbody').append(
        $('<tr>', {'data-id': r.id})
          .append($('<td>').text(`${r.first_name} ${r.last_name}`))
          .append($('<td>').text(`${r.treatment_name}`))
          .append($('<td>').text(`${r.amount}`))
        )
    }
  });
}

function initializeAppointmentTable()
{
  var Appointment = require('./db_models/appointment').Appointment;

  Appointment.getAll((err, rows) => {
    this.appointments = rows;

    $('#appointment_table > tbody').empty();
    
    for(let i = 0; i < 5; i++)
    {
      let r = rows[i];

      $('#appointment_table > tbody').append(
        $('<tr>', {'data-id': r.id})
          .append($('<td>').text(`${r.first_name} ${r.last_name}`))
          .append($('<td>').text(`${r.treatment_name}`))
          .append($('<td>').text(`${r.date}`))
          .append($('<td>').text(`${r.time}`))
        )
    }
  });
}

function initializeVisitTable()
{
  var Visit = require('./db_models/visit').Visit;

  Visit.getAll((err, rows) => {
    this.visits = rows;

    $('#visit_table > tbody').empty();
    
    for(let i = 0; i < 5; i++)
    {
      let r = rows[i];

      $('#visit_table > tbody').append(
        $('<tr>', {'data-id': r.id})
          .append($('<td>').text(`${r.first_name} ${r.last_name}`))
          .append($('<td>').text(`${r.actions}`))
          .append($('<td>').text(`${r.date} ${r.time}`))
        )
    }
  });
}

initialize();
