(function ($) {
  'use strict';

  // Preloader js
  $(window).on('load', function () {
      $('.preloader').fadeOut(100);
  });

  $(function () {
      // Owl Carousel is only loaded on the homepage; guard to avoid errors on other pages
      if ($.fn.owlCarousel) {
          // Helper: initialise an owl carousel when its element enters the viewport.
          // Using IntersectionObserver defers heavy carousel JS until actually needed,
          // keeping the main thread free during initial load (reduces TBT).
          function lazyOwl(selector, options) {
              var el = document.querySelector(selector);
              if (!el) return;
              if ('IntersectionObserver' in window) {
                  var obs = new IntersectionObserver(function (entries, observer) {
                      if (entries[0].isIntersecting) {
                          $(el).owlCarousel(options);
                          observer.disconnect();
                      }
                  }, { rootMargin: '200px' });
                  obs.observe(el);
              } else {
                  // Fallback for browsers without IntersectionObserver
                  $(el).owlCarousel(options);
              }
          }

          // -----------------------------
          //  Testimonial Slider
          // -----------------------------
          lazyOwl('.testimonial-slider', {
              loop: true,
              margin: 20,
              dots: true,
              autoplay: true,
              responsive: {
                  0: { items: 1 },
                  400: { items: 1 },
                  600: { items: 1 },
                  1000: { items: 2 }
              }
          });
          // -----------------------------
          //  Story Slider
          // -----------------------------
          lazyOwl('.about-slider', {
              loop: true,
              margin: 20,
              dots: true,
              autoplay: true,
              items: 1
          });
          // -----------------------------
          //  Quote Slider
          // -----------------------------
          lazyOwl('.quote-slider', {
              loop: true,
              autoplay: true,
              items: 1
          });
          // -----------------------------
          //  Client Slider
          // -----------------------------
          lazyOwl('.client-slider', {
              loop: true,
              autoplay: true,
              margin: 50,
              responsive: {
                  0: { items: 1, dots: false },
                  400: { items: 2, dots: false },
                  600: { items: 2, dots: false },
                  1000: { items: 4 }
              }
          });
          // -----------------------------
          //  Mockup Slider
          // -----------------------------
          lazyOwl('.mockup-slider', {
              loop: true,
              margin: 30,
              dots: true,
              autoplay: true,
              autoplayTimeout: 4000,
              autoplayHoverPause: true,
              responsive: {
                  0: { items: 1 },
                  600: { items: 2 },
                  1000: { items: 3 }
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

  });

})(jQuery);
