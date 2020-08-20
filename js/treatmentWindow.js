var pagination = require("./js/common/pagination").pagination;

var allTreatments;
var currentTreatments;

function initialize() {
  $("#treatment_dropdown").dropdown({});

  initializeTreatmentTable();

  $("#new_treatment_btn").on("click", handleNewTreatmentBtnClick);
  $("#search_treatment").on("input", handleSearchTreatment);
}

function initializeTreatmentTable() {
  let Treatment = require("./db_models/treatment").Treatment;

  Treatment.getAll((err, rows) => {
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

  for (const t of treatments) {
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
        .append($("<td>").text(t.name))
        .append($("<td>").text(`${t.first_name} ${t.last_name}`))
        .append($("<td>").text(t.start_date))
        .append($("<td>").text(t.diagnosis))
    );
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
  $("#modal_content").load("./modals/new_treatment.html", () => {
    $("#treatment_modal")
      .modal({ onApprove: () => false, detachable: false })
      .modal("show");
  });
}

function handleSearchTreatment() {
  let patientName = $(this).val();
  let names = patientName.split(" ").map((p) => p.toLowerCase());

  if (names.length === 0) {
    currentTreatments = allTreatments;
  } else {
    currentTreatments = allTreatments.filter((t) => {
      if (names.length === 1) {
        let name = names[0];

        return (
          t.first_name.toLowerCase().includes(name) ||
          t.last_name.toLowerCase().includes(name)
        );
      } else if (names.length) {
        let name_1 = names[0];
        let name_2 = names[1];

        return (
          (t.first_name.toLowerCase().includes(name_1) &&
            t.last_name.toLowerCase().includes(name_2)) ||
          (t.first_name.toLowerCase().includes(name_2) &&
            t.last_name.toLowerCase().includes(name_1))
        );
      }
    });
  }

  updateTreatmentTable(currentTreatments.slice(0, pagination.pageSize));

  let totalPages = pagination.getTotalPages(currentTreatments);
  pagination.updatePaginationMenu("treatment_pagination", 1, totalPages);
}

initialize();
