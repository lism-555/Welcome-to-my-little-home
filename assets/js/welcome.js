/* Doorstep: a click anywhere — the picture zooms out of the middle, out of
   focus, and pulls into focus as it carries the visitor into the living room. */
(function () {
  'use strict';

  var stage = document.querySelector('.stage');
  if (!stage) return;

  var zooming = false;

  function stepInside() {
    if (zooming) return;
    zooming = true;
    document.body.classList.add('is-zooming');
    window.setTimeout(function () { window.location.href = 'room.html'; }, 2150);
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('a, button')) return;
    stepInside();
  });

  /* keyboard: Enter or Space on the page steps inside as well */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    var active = document.activeElement;
    if (active && active.closest('a, button')) return;
    e.preventDefault();
    stepInside();
  });
})();
