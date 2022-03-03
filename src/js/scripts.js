$(document).ready(function(){
    // copyright year
    var now = new Date();
    var currentYear = now.getFullYear();
    $('#currentYear').text(currentYear);

    function closeMenu() {
        $('#menu').removeClass('open');
        $('#menu').addClass('closed');
        $('#menu_toggle').attr('aria-expanded', false);
    }
    function openMenu() {
        $('#menu').addClass('open');
        $('#menu').removeClass('closed');
        $('#menu_toggle').attr('aria-expanded', true);
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
            $('#menu_toggle').attr('aria-expanded', false);
        }
        else {
            closeMenu();
        }
    });

    // check if element is in viewport vertically
    jQuery.fn.isInViewport = function() {
        var elTop = $(this).offset().top;
        var elBottom = elTop + $(this).outerHeight();

        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).innerHeight();

        return elBottom > viewportTop && elTop < viewportBottom;
    }

    function toggleNavOpacity() {
        if ($('.header-content').isInViewport()) {
            $('.main-nav').addClass('top');
        }
        else {
            $('.main-nav').removeClass('top');
        }
    }
    toggleNavOpacity();

    // change opacity of header on window scroll/resize if
    // the header content is in the viewport
    $(window).on('resize scroll', () => {
        toggleNavOpacity();
    })
});
