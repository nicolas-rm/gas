

$(function () {

    // scroll

    $(".scroll-link").on("click", function (t) {
        var o = $(this);
        $("html, body").stop().animate({
            scrollTop: $(o.attr("href")).offset().top - 160
        }, 1e3), t.preventDefault()
    })

    var header = $('#main-header'); 
    var sticky = header.offset().top;
    var fixedClass = 'active'; 
    var dirValue = $('html').attr('dir');
    
    // Handle scroll event
    $(window).on('scroll', function () {
      if (window.scrollY > 0) {
        header.addClass(fixedClass);
      } else {
        header.removeClass(fixedClass); 
      }
    });

    // Aos

    AOS.init({
        once: true,
    });


    // Review Slider

    var owl = $('.review-slider .owl-carousel').owlCarousel({
        loop: true,
        margin: 0,
        rtl: dirValue === "ltr" ? false : true,
        dots: false,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1024: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    })
  $('.template-slider .owl-carousel').owlCarousel({
        loop: true,
        margin: 12,
        dots: false,
        rtl: true,rtl: dirValue === "ltr" ? false : true,
        center: true,
        autoplay:true,
        autoplayTimeout:2000,
        autoplayHoverPause:true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            1024: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    })
   let owl3 =  $('.testimonial-slider .owl-carousel').owlCarousel({
        loop: true,
        margin: 24,
        autoplayTimeout: 5000,
        rtl: dirValue === "ltr" ? false : true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1024: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    })

    // Get total slides and update the placeholder
    var totalSlides = $('.testimonial-slider .owl-carousel .item').length;
    $('#total-slides').text(totalSlides);

    // Update the current slide on initialization and change
    owl3.on('changed.owl.carousel', function (event) {
      // Owl Carousel uses 0-based index; add 1 for display
      var currentSlide = event.item.index - event.relatedTarget._clones.length / 2;
      var visibleSlide = (currentSlide % totalSlides) + 1;
      if (visibleSlide < 1) visibleSlide = totalSlides; // Handle edge cases

      $('#current-slide').text(visibleSlide);
    });

    // Custom Navigation Events
    $('.custom-prev2').click(function () {
        owl3.trigger('prev.owl.carousel');
      });
  
      $('.custom-next2').click(function () {
        owl3.trigger('next.owl.carousel');
      });

    // Custom Navigation Events
    $('.custom-prev').click(function () {
        owl.trigger('prev.owl.carousel');
      });
  
      $('.custom-next').click(function () {
        owl.trigger('next.owl.carousel');
      });

    // Close Announcement Bar
    $('#close-btn').on('click',function(){
        $('#announcement-bar').addClass('hidden');
    })

});