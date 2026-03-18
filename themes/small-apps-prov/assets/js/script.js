(function ($) {
  'use strict';

  // Preloader js
  $(window).on('load', function () {
      $('.preloader').fadeOut(100);
  });

  $(function () {
      // Owl Carousel is only loaded on the homepage; guard to avoid errors on other pages
      if ($.fn.owlCarousel) {
          // -----------------------------
          //  Testimonial Slider
          // -----------------------------
          $('.testimonial-slider').owlCarousel({
              loop: true,
              margin: 20,
              dots: true,
              autoplay: true,
              responsive: {
                  0: {
                      items: 1
                  },
                  400: {
                      items: 1
                  },
                  600: {
                      items: 1
                  },
                  1000: {
                      items: 2
                  }
              }
          });
          // -----------------------------
          //  Story Slider
          // -----------------------------
          $('.about-slider').owlCarousel({
              loop: true,
              margin: 20,
              dots: true,
              autoplay: true,
              items: 1
          });
          // -----------------------------
          //  Quote Slider
          // -----------------------------
          $('.quote-slider').owlCarousel({
              loop: true,
              autoplay: true,
              items: 1
          });
          // -----------------------------
          //  Client Slider
          // -----------------------------
          $('.client-slider').owlCarousel({
              loop: true,
              autoplay: true,
              margin: 50,
              responsive: {
                  0: {
                      items: 1,
                      dots: false
                  },
                  400: {
                      items: 2,
                      dots: false
                  },
                  600: {
                      items: 2,
                      dots: false
                  },
                  1000: {
                      items: 4
                  }
              }
          });
          // -----------------------------
          //  Mockup Slider
          // -----------------------------
          $('.mockup-slider').owlCarousel({
              loop: true,
              margin: 30,
              dots: true,
              autoplay: true,
              autoplayTimeout: 4000,
              autoplayHoverPause: true,
              responsive: {
                  0: {
                      items: 1
                  },
                  600: {
                      items: 2
                  },
                  1000: {
                      items: 3
                  }
              }
          });
      } // end if owlCarousel
      // -----------------------------
      //  Video Replace
      // -----------------------------
      $('.video-box i').click(function () {
          var video = '<iframe allowfullscreen src="' + $(this).attr('data-video') + '"></iframe>';
          $(this).replaceWith(video);
      });
      // -----------------------------
      //  Count Down JS
      // -----------------------------
      if ($.fn.syotimer) {
          $('#simple-timer').syotimer({
              year: 2019,
              month: 9,
              day: 1,
              hour: 0,
              minute: 0
          });
      }

      // ----------------------------
      // AOS (homepage-only; JS not loaded on other pages)
      // ----------------------------
      if (typeof AOS !== 'undefined') {
          AOS.init({
              once: true
          });
      }

      // ----------------------------
      // Lazy-load App Store QR code
      // Only fetch from api.qrserver.com when the modal is actually opened,
      // avoiding a third-party request on every page load.
      // ----------------------------
      $('#appStoreQRModal').on('show.bs.modal', function () {
          var $img = $(this).find('img[data-qr-url]');
          if ($img.length && !$img.attr('src')) {
              $img.attr('src', $img.data('qr-url'));
          }
      });

  });

})(jQuery);
