try { var validation = require('./js/common/validation').validation; }
catch(ex) {}

function initialize()
{
    $('#add_product_btn').on('click', handleAddProductBtnClick);
    $('#products').on('click', 'button[class~=remove]', handleRemoveProductBtnClick);
}

function handleAddProductBtnClick() {
    if (validateProductFields()) {
        let productName = $('input[name="product_name"]').val();
        let amount = Number($('input[name="amount"]').val());
        let quantity = Number($('input[name="quantity"]').val());
        let totalAmount = Number((amount * quantity).toFixed(2));

        $('#products')
            .append($('<div>', { 'class': 'item' })
                .append($('<div>', { 'class': 'right floated content' })
                    .append($('<button>', { 'class': 'remove ui compact tertiary icon button', 'type': 'button' })
                        .append($('<i>', { 'class': 'red window close outline large icon' }))))
                .append($('<div>', { 'class': 'content product_row' })
                    .data('product_name', productName)
                    .data('total_amount', totalAmount)
                    .data('quantity', quantity)
                    .append($('<div>', { 'class': 'header' }).text(`${productName}`)
                        .append($('<i>').text(` (x ${quantity})`)))
                    .append($('<div>', { 'class': 'description' })
                        .append($('<b>')).text(`₼ ${totalAmount}`)))
            );

        $('input[name="product_name"]').val('');
        $('input[name="amount"]').val('');
        $('input[name="quantity"]').val('');
    }
}

function handleRemoveProductBtnClick(e)
{
  $(this).closest('.item').remove();
}

function validateProductFields()
{
  return validateProductNameField() & validateAmountField() & validateQuantityField();
}

function validateProductNameField()
{
  let productNameField = $('input[name="product_name"]');

  if(validation.validateNonEmpty(productNameField))
  {
    fieldError(productNameField, false);

    return true;
  }

  fieldError(productNameField, true);

  return false;
}

function validateAmountField()
{
  let amountField = $('input[name="amount"]');

  if(validation.validateNumber(amountField, 0))
  {
    fieldError(amountField, false);

    return true;
  }
  
  fieldError(amountField, true);

  return false;
}

function validateQuantityField()
{
  let quantityField = $('input[name="quantity"]');

  if(validation.validateNumber(quantityField, 1))
  {
    fieldError(quantityField, false);

    return true;
  }

  fieldError(quantityField, true);

  return false;
}

function fieldError(field, state)
{
  if(state)
  {
    field.closest('.field').addClass('error');
  }
  else
  {
    field.closest('.field').removeClass('error');
  }
}

initialize();