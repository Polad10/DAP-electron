$("#new_patient_btn").on("click", handleAddPatientBtnClick);

function handleAddPatientBtnClick() {
  $("#add_patient_content").transition("drop", "800ms");
}
