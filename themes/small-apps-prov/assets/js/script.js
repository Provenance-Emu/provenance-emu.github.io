(function ($) {
  'use strict';

  // Preloader js    
  $(window).on('load', function () {
      $('.preloader').fadeOut(100);
  });

  $(document).on('ready', function () {
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
      //  Video Replace
      // -----------------------------
      $('.video-box i').click(function () {
          var video = '<iframe allowfullscreen src="' + $(this).attr('data-video') + '"></iframe>';
          $(this).replaceWith(video);
      });
      // -----------------------------
      //  Count Down JS
      // -----------------------------
      $('#simple-timer').syotimer({
          year: 2019,
          month: 9,
          day: 1,
          hour: 0,
          minute: 0
      });

      // ----------------------------
      // AOS
      // ----------------------------
      AOS.init({
          once: true
      });

  });

})(jQuery);