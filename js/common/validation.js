function validateNonEmpty(field)
{  
    if(field.val())
    {
      return true;
    }
  
    return false;
}

function validateNumber(field, min)
{
    if(validateNonEmpty(field))
    {
        return field.val() >= min;
    }
    
    return false;
}

exports.validation = {
    validateNonEmpty: validateNonEmpty,
    validateNumber: validateNumber
}