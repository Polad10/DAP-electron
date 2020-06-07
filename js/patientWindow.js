var pagination = require('./js/common/pagination').pagination;

var allPatients;
var currentPatients;

function initialize()
{
    $("#patient_dropdown").dropdown({});

    initializePatientTable();

    $('#new_patient_btn').on('click', handleNewPatientBtnClick);
    $('#search_patient').on('input', handleSearchPatient);
}

function initializePatientTable()
{
  var Patient = require('./db_models/patient').Patient;

  Patient.getAll((err, rows) => {
    allPatients = rows;
    currentPatients = rows;
    updatePatientTable(allPatients.slice(0, pagination.pageSize));

    let totalPages = pagination.getTotalPages(rows);

    $('#patient_table > tbody').on('click', 'tr', handlePatientTableClick);
    $('#patient_pagination').on('click', 'a', handlePatientPageClick);
    pagination.updatePaginationMenu('patient_pagination', 1, totalPages);
  });
}

function updatePatientTable(patients)
{
  $('#patient_table > tbody').empty();

  for(const p of patients)
  {
    $('#patient_table > tbody').append(
      $('<tr>', {'data-id': p.id})
        .append($('<td>').text(`${p.first_name} ${p.last_name}`))
        .append($('<td>').text(`${p.dob}`))
        .append($('<td>').text(`${p.phone_nr}`))
      );
  }
}

function handlePatientPageClick()
{
  let patients = pagination.paginate($(this), 'patient_pagination', currentPatients);

  updatePatientTable(patients);
}

function handlePatientTableClick() {
  let id = $(this).data("id");
  $("#content").load("./pages/patientDetails.html", function () {});
}

function handleNewPatientBtnClick()
{
    $('#modal_content').load('./modals/new_patient.html', () => {
        $('#patient_modal').modal({onApprove: () => false, detachable: false}).modal('show');
    });
}

function handleSearchPatient()
{
    let patientName = $(this).val();
    let names = patientName.split(' ').map(p => p.toLowerCase());

    if(names.length === 0)
    {
        currentPatients = allPatients;
    }
    else
    {
        currentPatients = allPatients.filter(p => {
            if(names.length === 1)
            {
                let name = names[0];

                return p.first_name.toLowerCase().includes(name) || p.last_name.toLowerCase().includes(name);
            }
            else if(names.length === 2)
            {
                let name_1 = names[0];
                let name_2 = names[1];

                return (p.first_name.includes(name_1) && p.last_name.includes(name_2))
                        || (p.first_name.toLowerCase().includes(name_2) && p.last_name.toLowerCase().includes(name_1));
            }
        });
    }

    updatePatientTable(currentPatients.slice(0, pagination.pageSize));
    let totalPages = pagination.getTotalPages(currentPatients);
    pagination.updatePaginationMenu('patient_pagination', 1, totalPages);
}

initialize();
