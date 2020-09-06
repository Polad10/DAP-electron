try { var Appointment = require('./db_models/appointment').Appointment; }
catch(ex) {}

try { var Visit = require('./db_models/visit').Visit; }
catch(ex) {}

try { var pagination = require('./js/common/pagination').pagination; }
catch(ex) {}

try { var dt = require('./lib/datetime.js').datetime; }
catch(ex) {}

var allAppointments;
var allVisits;

function handleAddAppointmentBtnClick() {
  $('#modal_content').load('./modals/new_appointment.html', () => {
    subscribeToAppointmentSubmit(() => {
      initializeAppointmentTable();
    })
  });
}

function handleAddVisitBtnClick() {
  showVisitForm(() => {
    subscribeToVisitSubmit(() => {
      initializeVisitTable();
    })
  });
}

function showVisitForm(callback)
{
  $('#modal_content').load('./modals/new_visit.html', callback);
}

function handleAppointmentTableClick() {
  let id = $(this).data("id");
  $("#content").load("./pages/patientDetails.html", function () { });
}

function handleVisitTableClick() {
  let id = $(this).data("id");
  console.log(id);
}

function initialize() {
  initializeAppointmentTable();
  initializeVisitTable();

  $("#new_appointment_btn").on('click', handleAddAppointmentBtnClick);
  $('#new_visit_btn').on('click', handleAddVisitBtnClick);
}

function initializeAppointmentTable() {
  Appointment.getForDate(new Date(), (err, rows) => {
    allAppointments = rows;
    updateAppointmentTable(allAppointments.slice(0, pagination.pageSize));

    let totalPages = pagination.getTotalPages(rows);

    $('#appointment_table tbody').on('click', 'tr', handleAppointmentTableClick);
    $('#appointment_pagination').on('click', 'a', handleAppointmentPageClick);
    $('#appointment_table tbody').on('click', 'button[class~=finish]', handleFinishedAppointment);
    $('#appointment_table tbody').on('click', 'button[class~=cancel]', handleCancelledAppointment);
    pagination.updatePaginationMenu('appointment_pagination', 1, totalPages);
  });
}

function initializeVisitTable() {
  Visit.getForDate(new Date(), (err, rows) => {
    allVisits = rows;
    updateVisitTable(allVisits.slice(0, pagination.pageSize));

    let totalPages = pagination.getTotalPages(allVisits);

    $('#visit_table tbody').on('click', 'tr', handleVisitTableClick);
    $('#visit_pagination').on('click', 'a', handleVisitPageClick);
    pagination.updatePaginationMenu('visit_pagination', 1, totalPages);
  });
}

function handleAppointmentPageClick() {
  let appointments = pagination.paginate($(this), 'appointment_pagination', allAppointments);
  updateAppointmentTable(appointments);
}

function handleVisitPageClick() {
  let visits = pagination.paginate($(this), 'visit_pagination', allVisits);
  updateVisitTable(visits);
}

function updateAppointmentTable(appointments) {
  $('#appointment_table > tbody').empty();

  if (appointments.length === 0) {
    $('#no_appointment').show();
  }
  else {
    $('#no_appointment').hide();

    for (const a of appointments) {
      $('#appointment_table > tbody').append(
        $('<tr>', { 'data-id': a.id })
          .append($('<td>', {'data-id': a.patient_id}).text(`${a.first_name} ${a.last_name}`))
          .append($('<td>', {'data-id': a.treatment_id}).text(`${a.diagnosis}`))
          .append($('<td>').text(`${a.actions}`))
          .append($('<td>', { 'class': 'center aligned' }).text(`${a.time}`))
          .append($('<td>', { 'class': 'center aligned' })
            .append($('<button>', { 'class': 'finish ui compact tertiary icon button' })
              .append($('<i>', { 'class': 'green check square outline large icon' })))
            .append($('<button>', { 'class': 'cancel ui compact tertiary icon button' })
              .append($('<i>', { 'class': 'red window close outline large icon' })))
          )
      )
    }
  }
}

function updateVisitTable(visits) {
  $('#visit_table > tbody').empty();

  if (visits.length === 0) {
    $('#no_visit').show();
  }
  else {
    $('#no_visit').hide();

    for (const v of visits) {
      $('#visit_table > tbody').append(
        $('<tr>', { 'data-id': v.id })
          .append($('<td>').text(`${v.first_name} ${v.last_name}`))
          .append($('<td>').text(`${v.diagnosis}`))
          .append($('<td>').text(`${v.actions}`))
          .append($('<td>', { 'class': 'center aligned' }).text(`${v.time}`))
          .append($('<td>', { 'class': 'center aligned' }).text(`${v.amount}`))
      )
    }
  }
}

function handleFinishedAppointment(e) {
  e.stopPropagation();

  let appointmentID = $(this).closest('tr').data('id');

  let cells = $(this).closest('tr').find('td');

  let patientID = cells.eq(0).data('id');
  let treatmentID = cells.eq(1).data('id');
  let actions = cells.eq(2).text();
  let time = cells.eq(3).text();
  let datetime = dt.createDateFromTime(time);

  showVisitForm(() => {
    setVisitFormValues(patientID, treatmentID, actions, datetime);
    subscribeToVisitSubmit(() => {
      Appointment.finish(appointmentID, function(err) {
        initializeAppointmentTable();
        initializeVisitTable();
      })
    });
  });
}

function handleCancelledAppointment(e) {
  e.stopPropagation();

  let appointmentID = $(this).closest('tr').data('id');

  Appointment.cancel(appointmentID, function(err) {
    initializeAppointmentTable();
  });
}

initialize();
