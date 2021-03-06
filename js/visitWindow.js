try { var Visit = require('./db_models/visit').Visit; }
catch(ex) {}

try { var pagination = require('./js/common/pagination').pagination; }
catch(ex) {}

try { var Fuse = require('fuse.js'); }
catch (err) { }

var allVisits;
var currentVisits;

function initialize()
{ 
  initializeVisitTable();

  $('#new_visit_btn').on('click', handleNewVisitBtnClick);
  $('#search_visit').on('input', handleFilter);
  $('#payment_visits_cb').checkbox({
    onChange: handleFilter
  });
}

function initializeVisitTable() {
  Visit.getAll((err, rows) => {
    rows.forEach(r => r.full_name = `${r.first_name} ${r.last_name}`);

    allVisits = rows;
    currentVisits = rows;

    updateVisitTable(allVisits.slice(0, pagination.pageSize));

    let totalPages = pagination.getTotalPages(allVisits);

    $('#visit_table tbody').on('click', 'td[class~=selectable]', handleVisitTableClick);
    $('#visit_pagination').on('click', 'a', handleVisitPageClick);
    pagination.updatePaginationMenu('visit_pagination', 1, totalPages);
  });
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
          .append($('<td>', {'class': 'selectable center aligned', 'data-name': 'patient', 'data-id': v.patient_id})
            .append($('<a>').text(`${v.full_name}`)))
          .append($('<td>', {'class': 'selectable', 'data-name': 'treatment', 'data-id': v.treatment_id})
            .append($('<a>').text(`${v.diagnosis}`)))
          .append($('<td>', { 'class': 'center aligned' }).text(`${v.date} ${v.time}`))
          .append($('<td>').text(`${v.actions}`))
          .append($('<td>', { 'class': 'center aligned' }).text(`${v.amount}`))
      )
    }
  }
}

function handleNewVisitBtnClick()
{
  $('#modal_content').load('./modals/new_visit.html', () => {
    subscribeToVisitSubmit(() => {
      initializeVisitTable();
    })
  });
}

function handleVisitTableClick()
{
  let name = $(this).data('name');

  if(name === 'patient')
  {
    //to do
  }
  else if(name === 'treatment')
  {
    //to do
  }
}

function handleVisitPageClick()
{
  let visits = pagination.paginate($(this), "visit_pagination", currentVisits);

  updateVisitTable(visits);
}

function handleFilter()
{
  let patientName = $('#search_visit').val();
  let paymentVisitsChecked = $('#payment_visits_cb').checkbox('is checked');

  currentVisits = filterVisitsByPatientName(patientName, allVisits);
  currentVisits = filterVisitsWithPayment(paymentVisitsChecked, currentVisits);

  updateVisitTable(currentVisits.slice(0, pagination.pageSize));

  let totalPages = pagination.getTotalPages(currentVisits);
  pagination.updatePaginationMenu("visit_pagination", 1, totalPages);
}

function filterVisitsByPatientName(patientName, visits)
{
  let filteredVisits;

  const fuseOptions = {
    shouldSort: false,
    threshold: 0.3,
    keys: ['full_name']
  };

  if(patientName)
  {

    const fuse = new Fuse(visits, fuseOptions);
    const result = fuse.search(patientName);
    
    filteredVisits = result.map(r => r.item);
  }
  else
  {
    filteredVisits = visits;
  }
  
  return filteredVisits;
}

function filterVisitsWithPayment(check, visits)
{
  if(check)
  {
    return visits.filter(v => v.amount);
  }

  return visits;
}

initialize();
