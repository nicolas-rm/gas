$(function () {
    //
    // Carousel
    //
    $(".collectibles-carousel").owlCarousel({
      loop: true,
      margin: 30,
      mouseDrag: true,
      autoplay: true,
      autoplayTimeout: 4000,
      autoplaySpeed: 2000,
      nav: false,
      dots: false,
      rtl: true,
      responsive: {
        0: {
          items: 1,
        },
        576: {
          items: 2,
        },
        768: {
          items: 3,
        },
      },
    });
});

// Toaster Js 
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(()=>{
    if(document.getElementById('dismiss-toast')){   
      document.getElementById('dismiss-toast').classList.add('hs-removing'); 
      document.getElementById('dismiss-toast').classList.remove('show-toast'); 
      setTimeout(() => {
        document.getElementById('dismiss-toast').remove();
      }, 300);  
    }
    else{}
  },5000)

  setTimeout(()=>{
    document.getElementById('dismiss-toast').classList.add('show-toast'); 
  },1000)
});

  