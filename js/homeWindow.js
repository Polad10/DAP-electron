var pagination = require('./js/common/pagination').pagination;

var allPayments;
var allAppointments;

$("#AddAppointment_btn").click(function () {});

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

function handleAppointmentTableClick() {
  let id = $(this).data("id");
  $("#content").load("./pages/patientDetails.html", function () {});
}

function handlePaymentTableClick() {
  let id = $(this).data("id");
  console.log(id);
}

function handleVisitTableClick() {
  let id = $(this).data("id");
  console.log(id);
}

function initialize()
{
  initializePaymentTable();
  initializeAppointmentTable();
  initializeVisitTable();
  
  $("#new_appointment_btn").on('click', handleAddAppointmentBtnClick);
}

function initializePaymentTable()
{
  var Treatment = require('./db_models/treatment').Treatment;

  Treatment.getPendingPayments((err, rows) => {
    allPayments = rows;
    updatePaymentTable(allPayments.slice(0, pagination.pageSize));

    let pagesNr = pagination.getTotalPages(rows);

    $('#payment_pagination').append(
      $('<a>', {class: 'icon item left_arrow'})
        .append($('<i>', {class: 'left chevron icon'}))
      );

    for(let i = 1; i <= pagesNr; i++)
    { 
      $('#payment_pagination').append(
        $('<a>', {class: 'item'})
          .text(i)
        );

      if(i === pagination.maxPages)
      {
        break;
      }
    }

    $('#payment_pagination').append(
      $('<a>', {class: 'icon item right_arrow'})
        .append($('<i>', {class: 'right chevron icon'}))
      )

    $('#payment_table > tbody').on('click', 'tr', handlePaymentTableClick);
    $('#payment_pagination').on('click', 'a', handlePaymentPageClick);
    pagination.updatePaginationMenu('payment_pagination', 1, pagesNr);
  });
}

function initializeAppointmentTable()
{
  var Appointment = require('./db_models/appointment').Appointment;

  Appointment.getAll((err, rows) => {
    allAppointments = rows;
    updateAppointmentTable(allAppointments.slice(0, pagination.pageSize));

    let pagesNr = pagination.getTotalPages(rows);

    $('#appointment_pagination').append(
      $('<a>', {class: 'icon item left_arrow'})
        .append($('<i>', {class: 'left chevron icon'}))
      );

    for(let i = 1; i <= pagesNr; i++)
    {   
      $('#appointment_pagination').append(
        $('<a>', {class: 'item'})
          .text(i)
        );

      if(i === pagination.maxPages)
      {
        break;
      }
    }

    $('#appointment_pagination').append(
      $('<a>', {class: 'icon item right_arrow'})
        .append($('<i>', {class: 'right chevron icon'}))
      )
    
    $('#appointment_table tbody').on('click', 'tr', handleAppointmentTableClick);
    $('#appointment_pagination').on('click', 'a', handleAppointmentPageClick);
    pagination.updatePaginationMenu('appointment_pagination', 1, pagesNr);
  });
}

function initializeVisitTable()
{
  var Visit = require('./db_models/visit').Visit;

  Visit.getAll((err, rows) => {
    this.visits = rows;

    $('#visit_table > tbody').empty();
    
    for(let i = 0; i < pagination.pageSize; i++)
    {
      let r = rows[i];

      $('#visit_table > tbody').append(
        $('<tr>', {'data-id': r.id})
          .append($('<td>').text(`${r.first_name} ${r.last_name}`))
          .append($('<td>').text(`${r.actions}`))
          .append($('<td>').text(`${r.date} ${r.time}`))
        )
    }

    $('#visit_table tbody').on('click', 'tr', handleVisitTableClick);
  });
}

function handleAppointmentPageClick()
{
  let appointments = pagination.paginate($(this), 'appointment_pagination', allAppointments);
  updateAppointmentTable(appointments);
}

function handlePaymentPageClick()
{
  let payments = pagination.paginate($(this), 'payment_pagination', allPayments);
  updatePaymentTable(payments);
}

function updateAppointmentTable(appointments)
{
  $('#appointment_table > tbody').empty();
    
  for(const a of appointments)
  {
    $('#appointment_table > tbody').append(
      $('<tr>', {'data-id': a.id})
        .append($('<td>').text(`${a.first_name} ${a.last_name}`))
        .append($('<td>').text(`${a.treatment_name}`))
        .append($('<td>').text(`${a.date}`))
        .append($('<td>').text(`${a.time}`))
      )
  }
}

function updatePaymentTable(payments)
{
  $('#payment_table > tbody').empty();
    
  for(const p of payments)
  {
    $('#payment_table > tbody').append(
      $('<tr>', {'data-id': p.id})
        .append($('<td>').text(`${p.first_name} ${p.last_name}`))
        .append($('<td>').text(`${p.treatment_name}`))
        .append($('<td>').text(`${p.pending_payment}`))
      )
  }
}

initialize();
