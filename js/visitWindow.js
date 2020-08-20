$("#visit_dropdown").dropdown({});

$("#new_visit_btn").on("click", handleAddVisitBtnClick);

function handleAddVisitBtnClick() {
  $("#modal_content").load("./modals/new_visit.html", () => {
    $("#visit_modal")
      .modal({ onApprove: () => false, detachable: false })
      .modal("show");
  });
}
