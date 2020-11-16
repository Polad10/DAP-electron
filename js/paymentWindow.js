try { var Payment = require('./db_models/payment').Payment; }
catch(ex) {}

try { var pagination = require('./js/common/pagination').pagination; }
catch(ex) {}

try { var Fuse = require('fuse.js'); }
catch (err) { }

var allPayments;
var currentPayments;

function initialize()
{
    initializePaymentTable();
    
    $('#search_payment').on('input', handleSearchPayment);
}

function initializePaymentTable()
{
    Payment.getAll((err, rows) => {
        rows.forEach(r => r.full_name = `${r.first_name} ${r.last_name}`);

        allPayments = rows;
        currentPayments = rows;

        updatePaymentTable(allPayments.slice(0, pagination.pageSize));

        let totalPages = pagination.getTotalPages(allPayments);

        $('#payment_table tbody').on('click', 'td[class~=selectable]', handlePaymentTableClick);
        $('#payment_pagination').on('click', 'a', handlePaymentPageClick);

        pagination.updatePaginationMenu('payment_pagination', 1, totalPages);
    });
}

function updatePaymentTable(payments)
{
    $('#payment_table > tbody').empty();

    if(payments.length === 0)
    {
        $('no_payment').show();
    }
    else
    {
        $('no_payment').hide();

        for(const p of payments)
        {
            $('#payment_table > tbody').append(
                $('<tr>')
                    .append($('<td>', {'class': 'selectable center aligned', 'data-name': 'patient', 'data-id': p.patient_id})
                        .append($('<a>').text(`${p.full_name}`)))
                    .append($('<td>', {'class': 'selectable', 'data-name': 'treatment', 'data-id': p.treatment_id})
                        .append($('<a>').text(`${p.diagnosis}`)))
                    .append($('<td>', {'class': 'center aligned'}).text(`${p.amount}`))
                    .append($('<td>', {'class': 'center aligned'}).text(`${p.date} ${p.time}`))
            );
        }
    }
}

function handleSearchPayment()
{
    const searchValue = $(this).val();

    const fuseOptions = {
        shouldSort: false,
        threshold: 0.3,
        keys: ['full_name']
      };
    
      if(searchValue)
      {
    
        const fuse = new Fuse(allPayments, fuseOptions);
        const result = fuse.search(searchValue);
        
        currentPayments = result.map(r => r.item);
      }
      else
      {
        currentPayments = allPayments;
      }
    
      updatePaymentTable(currentPayments.slice(0, pagination.pageSize));
    
      let totalPages = pagination.getTotalPages(currentPayments);
      pagination.updatePaginationMenu("payment_pagination", 1, totalPages);
}

function handlePaymentTableClick()
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

function handlePaymentPageClick()
{
    let payments = pagination.paginate($(this), "payment_pagination", currentPayments);

    updatePaymentTable(payments);
}

initialize();