function toDateString(datetime)
{
    let year = `${datetime.getFullYear()}`;
    let month = `${datetime.getMonth() + 1}`;
    let date = `${datetime.getDate()}`;

    if(month.length == 1)
    {
        month = `0${month}`;
    }

    if(date.length == 1)
    {
        date = `0${date}`;
    }

    return `${year}-${month}-${date}`;
}

function toTimeString(datetime)
{
    let hours = `${datetime.getHours()}`;
    let minutes = `${datetime.getMinutes()}`;

    if(hours.length == 1)
    {
        hours = `0${hours}`;
    }

    if(minutes.length == 1)
    {
        minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}`;
}

exports.datetime = {
    toDateString: toDateString,
    toTimeString: toTimeString
}