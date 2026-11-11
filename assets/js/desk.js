/* =========================================================
   The Writing Desk · making a cup of coffee
   Click the beans or the sugar: it swings up over the empty
   cup in an arc, trembles a little, and travels back to the
   place it started from. While the beans tremble the empty
   cup turns into the cup full of coffee.
   ========================================================= */

(function () {
  'use strict';

  var stage = document.querySelector('.stage');
  var cupEmpty = document.querySelector('.brew__shot--empty');
  var cupFull = document.querySelector('.brew__shot--full');
  var picks = Array.prototype.slice.call(document.querySelectorAll('.brew__pick'));

  if (!stage || !cupEmpty || !cupFull || !picks.length) return;

  var cupIsFull = false;
  var busy = false;

  /* the beans and the sugar stop just above the rim of the cup */
  var HOVER_BOTTOM = 0.264;  /* of the stage height */
  var ARC_LIFT = 0.08;       /* how high the path bows */

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function animate(duration, easing, onFrame) {
    return new Promise(function (resolve) {
      var start = null;
      function frame(now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / duration, 1);
        onFrame(easing ? easing(t) : t, t);
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(frame);
    });
  }

  function place(el, dx, dy, rot) {
    el.style.setProperty('--dx', dx.toFixed(2) + 'px');
    el.style.setProperty('--dy', dy.toFixed(2) + 'px');
    el.style.setProperty('--rot', (rot || 0).toFixed(2) + 'deg');
  }

  function bezier(p0, p1, p2, t) {
    var u = 1 - t;
    return {
      x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
      y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y
    };
  }

  function plan(el) {
    var stageRect = stage.getBoundingClientRect();
    var rect = el.getBoundingClientRect();
    var p0 = {
      x: rect.left - stageRect.left + rect.width / 2,
      y: rect.top - stageRect.top + rect.height / 2
    };
    var p2 = {
      x: stageRect.width * 0.5,
      y: stageRect.height * HOVER_BOTTOM - rect.height / 2
    };
    var p1 = {
      x: (p0.x + p2.x) / 2,
      y: (p0.y + p2.y) / 2 - stageRect.height * ARC_LIFT
    };
    return { p0: p0, p1: p1, p2: p2 };
  }

  function fillTheCup() {
    if (cupIsFull) return;
    cupIsFull = true;
    cupEmpty.classList.remove('is-on');
    cupFull.classList.add('is-on');
  }

  function pour(el) {
    if (busy) return;
    busy = true;

    var path = plan(el);
    var stageRect = stage.getBoundingClientRect();
    var dx = path.p2.x - path.p0.x;
    var dy = path.p2.y - path.p0.y;

    animate(850, easeInOut, function (t) {
      var p = bezier(path.p0, path.p1, path.p2, t);
      place(el, p.x - path.p0.x, p.y - path.p0.y, 0);
    })
    .then(function () {
      if (el.getAttribute('data-kind') === 'beans') fillTheCup();
      var amp = stageRect.width * 0.009;
      return animate(680, null, function (eased, t) {
        var fade = 1 - t;
        var wave = t * Math.PI * 14;
        place(
          el,
          dx + Math.sin(wave) * amp * fade,
          dy + Math.cos(wave * 0.85) * amp * 0.35 * fade,
          Math.sin(wave * 0.5) * 2.4 * fade
        );
      });
    })
    .then(function () {
      return animate(850, easeInOut, function (t) {
        var p = bezier(path.p0, path.p1, path.p2, 1 - t);
        place(el, p.x - path.p0.x, p.y - path.p0.y, 0);
      });
    })
    .then(function () {
      place(el, 0, 0, 0);
      busy = false;
    });
  }

  picks.forEach(function (el) {
    el.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      pour(el);
    });
  });
})();
