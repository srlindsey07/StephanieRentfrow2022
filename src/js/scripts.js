$(document).ready(function(){
    // copyright year
    var now = new Date();
    var currentYear = now.getFullYear();
    $('#currentYear').text(currentYear);

    function closeMenu() {
        $('#menu').removeClass('open');
        $('#menu').addClass('closed');
    }
    function openMenu() {
        $('#menu').addClass('open');
        $('#menu').removeClass('closed');
    }

    // menu toggle classes
    var menuOpen = false;
    $('#menu_toggle').click(() => {
        menuOpen = !menuOpen;

        if (menuOpen) {
            openMenu();
        }
        else {
            closeMenu();
        }
    });

    // remove menu toggle classes when not in mobile sizes
    $(window).on('resize', () => {
        if (window.innerWidth >= 768) {
            // make desktop menu
            $('#menu').removeClass('closed');
            $('#menu').removeClass('open');
        }
        else {
            closeMenu();
        }
    });
});
