$("#patient_dropdown").dropdown({});

$('#new_patient_btn').on('click', handleNewPatientBtnClick);

function handleNewPatientBtnClick()
{
    $('#modal_content').load('./modals/new_patient.html', () => {
        $('#patient_modal').modal({onApprove: () => false, detachable: false}).modal('show');
    });
}
