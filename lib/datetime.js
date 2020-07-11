function toDateString(datetime)
{
    return datetime.toISOString().substring(0, 10); 
}

function toTimeString(datetime)
{
    return datetime.toISOString().substring(11, 16);
}

exports.datetime = {
    toDateString: toDateString,
    toTimeString: toTimeString
}