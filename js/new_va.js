$("#new_patient_btn").on("click", handleAddPatientBtnClick);

function handleAddPatientBtnClick() {
  $("#add_patient_content").transition("drop", "800ms");
}

$("#new_treatment_btn").on("click", handleAddTreatmentBtnClick);

function handleAddTreatmentBtnClick() {
  $("#add_treatment_content").transition("drop", "800ms");
}
