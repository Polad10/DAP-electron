$('a.item').on('click', handleNavClick);

window.navigationBar = {
  navBarContainer: document.getElementById("navbar")
};

function handleNavClick(e)
{
  $('a.item.active').removeClass('active');
  $(this).addClass('active');
}
