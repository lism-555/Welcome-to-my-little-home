/* Fireside: the three glowing marks. Each one steps into its own scene. */
(function () {
  'use strict';

  var stage = document.querySelector('.stage');
  var spots = document.querySelectorAll('.hotspot');
  if (!stage) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  for (var i = 0; i < spots.length; i++) {
    spots[i].addEventListener('click', function (e) {
      var spot = e.currentTarget;
      var href = spot.getAttribute('data-href');
      if (!href) return;
      if (reduce) { window.location.href = href; return; }

      /* push in towards the thing that was touched, then turn the page */
      stage.style.transformOrigin = spot.style.left + ' ' + spot.style.top;
      document.body.setAttribute('data-busy', '1');
      document.body.classList.add('is-leaving', 'is-zooming-hotspot');
      window.setTimeout(function () { window.location.href = href; }, 420);
    });
  }
})();
