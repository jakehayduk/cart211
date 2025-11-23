$(document).ready(function() {
    let navOpen = false;
    let dark = true;

    $('.hamburger').on('click', function() {
        if (navOpen == false) {
            navOpen = true;
            $('.line-1').css('opacity', '0');
            $('.line-2').css('rotate', '45deg');
            $('.line-3').css('rotate', '-45deg');
            $('.line-3').css('bottom', '50%');
            $('.line-3').css('transform', 'translateY(50%)');
            $('.mobile-nav').css('display', 'flex');
        }

        else {
            navOpen = false;
            $('.line-1').css('opacity', '1');
            $('.line-2').css('rotate', '0deg');
            $('.line-3').css('rotate', '0deg');
            $('.line-3').css('bottom', '0');
            $('.line-3').css('transform', 'translateY(0)');
            $('.mobile-nav').css('display', 'none');
        }
    })

    $('.logo').on('click', function() {
        if (dark == true) {
            dark = false;
            $(':root').css('--primary', 'white');
            $(':root').css('--secondary', 'black');
            $('.logo').css('filter', 'invert()');
        }

        else {
            dark = true;
            $(':root').css('--primary', 'black');
            $(':root').css('--secondary', 'white');
             $('.logo').css('filter', 'none');
        }
    })
})