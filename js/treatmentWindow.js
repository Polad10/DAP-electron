try { var pagination = require("./js/common/pagination").pagination; }
catch (err) { }

try { var Treatment = require("./db_models/treatment").Treatment; }
catch (err) { }

try { var Fuse = require('fuse.js'); }
catch (err) { }

var allTreatments;
var currentTreatments;

function initialize() {
  $("#treatment_window_dropdown").dropdown({
    values: [
      {
        name: 'Patient Name',
        value: 'patient name',
        selected: true
      },
      {
        name: 'Diagnosis',
        value: 'diagnosis'
      }
    ]
  });

  $("#treatment_filter_dropdown").dropdown({
    values: [
      {
        name: 'All Treatments',
        value: 'all treatments',
        selected: true
      },
      {
        name: 'Ongoing Treatments',
        value: 'ongoing treatments'
      },
      {
        name: 'Finished Treatments',
        value: 'finished treatments'
      }
    ],
    onChange: handleTreatmentFilterChange
  });

  initializeTreatmentTable();

  $("#new_treatment_btn").on("click", handleNewTreatmentBtnClick);
  $("#search_treatment").on("input", handleSearchTreatment);
}

function initializeTreatmentTable() {
  Treatment.getAll((err, rows) => {
    rows.forEach(r => r.full_name = `${r.first_name} ${r.last_name}`);

    allTreatments = rows;
    currentTreatments = rows;

    updateTreatmentTable(allTreatments.slice(0, pagination.pageSize));

    let totalPages = pagination.getTotalPages(rows);

    $("#treatment_table > tbody").on("click", "tr", handleTreatmentTableClick);
    $("#treatment_pagination").on("click", "a", handleTreatmentPageClick);

    pagination.updatePaginationMenu("treatment_pagination", 1, totalPages);
  });
}

function updateTreatmentTable(treatments) {
  $("#treatment_table > tbody").empty();

  if (treatments.length === 0) 
  {
    $('#no_treatment').show();
  }
  else 
  {
    $('#no_treatment').hide();

    for (const t of treatments) 
    {
      let color;
  
      if (t.paid === 0) {
        color = "red";
      } else if (t.paid >= t.total_price) {
        color = "green";
      } else {
        color = "yellow";
      }
  
      $("#treatment_table > tbody").append(
        $("<tr>", { "data-id": t.id })
          .addClass(color)
          .append($("<td>").text(`${t.first_name} ${t.last_name}`))
          .append($("<td>").text(t.diagnosis))
          .append($("<td>").text(t.start_date))
          .append($("<td>").text(t.end_date))
          .append($("<td>").text(t.status))
      );
    }
  }
}

function handleTreatmentTableClick() {
  let id = $(this).data("id");

  //$('#content').load('./pages/treatmentDetails.html');
}

function handleTreatmentPageClick() {
  let treatments = pagination.paginate(
    $(this),
    "treatment_pagination",
    currentTreatments
  );

  updateTreatmentTable(treatments);
}

function handleNewTreatmentBtnClick() {
  $("#modal_content").load("./modals/new_treatment.html");
}

function handleSearchTreatment() {
  const searchValue = $(this).val();
  const searchOption = $('#treatment_window_dropdown').dropdown('get value');
  const fuseOptions = {
    shouldSort: false,
    threshold: 0.3
  };

  if(searchOption === 'diagnosis')
  {
    fuseOptions.keys = ['diagnosis'];
  }
  else
  {
    fuseOptions.keys = ['full_name'];
  }

  if(searchValue)
  {

    const fuse = new Fuse(allTreatments, fuseOptions);
    const result = fuse.search(searchValue);
    
    currentTreatments = result.map(r => r.item);
  }
  else
  {
    currentTreatments = allTreatments;
  }

  updateTreatmentTable(currentTreatments.slice(0, pagination.pageSize));

  let totalPages = pagination.getTotalPages(currentTreatments);
  pagination.updatePaginationMenu("treatment_pagination", 1, totalPages);
}

function handleTreatmentFilterChange(value, text, choice)
{
  if(value === 'finished treatments')
  {
    currentTreatments = allTreatments.filter(t => t.status === 'Finished');
  }
  else if(value === 'ongoing treatments')
  {
    currentTreatments = allTreatments.filter(t => t.status === 'Ongoing');
  }
  else
  {
    currentTreatments = allTreatments;
  }

  updateTreatmentTable(currentTreatments.slice(0, pagination.pageSize));

  let totalPages = pagination.getTotalPages(currentTreatments);
  pagination.updatePaginationMenu("treatment_pagination", 1, totalPages);
}

initialize();
