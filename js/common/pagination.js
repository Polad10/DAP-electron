var maxPages = 4;
var pageSize = 5;

function paginate(page, id, data)
{
  let currentPageNr = getActivePageNr(id);
  let newPageNr;
  
  if(page.hasClass('left_arrow'))
  {
    newPageNr = currentPageNr - 1;
  }
  else if (page.hasClass('right_arrow'))
  {
    newPageNr = currentPageNr + 1;
  }
  else
  {
    newPageNr = parseInt(page.text(), 10);
  }

  let actualPageNr = updatePaginationMenu(id, newPageNr, getTotalPages(data));
  return retrievePageData(actualPageNr, data);
}

function updatePaginationMenu(id, pageNr, totalPages)
{
  setPages(id, totalPages);

  let firstVisiblePage = $(`#${id} a:nth-child(2)`);
  let lastVisiblePage = $(`#${id} a:nth-last-child(2)`);
  
  let firstVisiblePageNr = parseInt(firstVisiblePage.text(), 10);
  let lastVisiblePageNr = parseInt(lastVisiblePage.text(), 10);

  let index = 2;
  let nextPageNr = pageNr;

  if(totalPages === 0)
  {
    pageNr = 0;
  }
  else if(pageNr < 1)
  {
    pageNr = 1;
  }
  else if(pageNr > totalPages)
  {
    pageNr = totalPages;
  }

  if(pageNr < firstVisiblePageNr)
  {
    for(let i = 0; i < Math.min(totalPages, maxPages); i++)
    {
      $(`#${id} a:nth-child(${index++})`).text(nextPageNr++);
    }
  }
  else if(pageNr > lastVisiblePageNr)
  {
    for(let i = 0; i < Math.min(totalPages, maxPages); i++)
    {
      $(`#${id} a:nth-last-child(${index++})`).text(nextPageNr--);
    }
  }

  setActivePageNr(id, pageNr, totalPages);

  return pageNr;
}

function setActivePageNr(id, pageNr, totalPages)
{
  $(`#${id} a`).removeClass('active');
  let page = $(`#${id} a`).toArray().find(a => $(a).text() === pageNr.toString());
  $(page).addClass('active');

  updatePaginationArrows(id, pageNr, totalPages);
}

function getActivePageNr(id)
{
  let page = $(`#${id} a`).toArray().find(a => $(a).hasClass('active'));

  return parseInt($(page).text(), 10);
}

function getTotalPages(data)
{
  return Math.ceil(data.length / 5);
}

function updatePaginationArrows(id, pageNr, totalPages)
{
  $(`#${id} .left_arrow`).removeClass('disabled');
  $(`#${id} .right_arrow`).removeClass('disabled');
  
  if(pageNr === 0)
  {
    $(`#${id} .left_arrow`).addClass('disabled');
    $(`#${id} .right_arrow`).addClass('disabled');
  }
  else if(pageNr === 1)
  {
    $(`#${id} .left_arrow`).addClass('disabled');
  }
  else if(pageNr === totalPages)
  {
    $(`#${id} .right_arrow`).addClass('disabled');
  }
}

function retrievePageData(pageNr, data)
{
    let pageData = [];
    let endIndex = pageNr * pageSize;
    let startIndex = endIndex - pageSize;

    for(let i = startIndex; i < endIndex; i++)
    {
      let d = data[i];

      if(d)
      {
        pageData.push(d);
      }
    }

    return pageData;
}

function setPages(id, totalPages)
{
  $(`#${id}`).empty();

  $(`#${id}`).append(
    $('<a>', {class: 'icon item left_arrow'})
      .append($('<i>', {class: 'left chevron icon'}))
    );

  for(let i = 1; i <= totalPages; i++)
  { 
    $(`#${id}`).append(
      $('<a>', {class: 'item'}).text(i)
      );

    if(i === pagination.maxPages)
    {
      break;
    }
  }

  $(`#${id}`).append(
    $('<a>', {class: 'icon item right_arrow'})
      .append($('<i>', {class: 'right chevron icon'}))
    )
}

exports.pagination = {
    paginate: paginate,
    getActivePageNr: getActivePageNr,
    getTotalPages: getTotalPages,
    updatePaginationMenu: updatePaginationMenu,
    maxPages: maxPages,
    pageSize: pageSize
}