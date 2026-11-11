/* =========================================================
   The Christmas Album
   Six gold baubles on the tree. Touch one and its photograph
   grows out of the bauble, out of focus, and pulls into focus
   over the tree while the tree steps aside and softens. The
   backspace key takes the photograph back to the tree.
   ========================================================= */

(function () {
  'use strict';

  var stage = document.querySelector('.stage');
  var tree = document.getElementById('album-tree');
  var shot = document.getElementById('album-shot');
  var photo = document.getElementById('album-photo');
  var balls = Array.prototype.slice.call(document.querySelectorAll('.album__ball'));

  if (!stage || !tree || !shot || !photo || !balls.length) return;

  var open = null;

  /* where the touched bauble sits, measured from the middle of the picture */
  function anchorOf(ball) {
    var s = stage.getBoundingClientRect();
    var b = ball.getBoundingClientRect();
    return {
      x: (b.left + b.width / 2) - (s.left + s.width / 2),
      y: (b.top + b.height / 2) - (s.top + s.height / 2)
    };
  }

  function show(ball) {
    var src = ball.getAttribute('data-photo');
    var alt = ball.getAttribute('data-alt') || '';
    var at = anchorOf(ball);

    photo.setAttribute('src', src);
    photo.setAttribute('alt', alt);
    shot.setAttribute('--fx', at.x.toFixed(1) + 'px');
    shot.setAttribute('--fy', at.y.toFixed(1) + 'px');

    if (open) {
      /* another bauble is touched: the photograph turns into the new one */
      shot.classList.remove('is-open');
      window.setTimeout(function () {
        shot.classList.add('is-open');
      }, 30);
      open = ball;
      return;
    }

    shot.hidden = false;
    void shot.offsetWidth;          /* let the browser paint the closed state first */
    shot.classList.add('is-open');
    document.body.classList.add('is-album-open');
    open = ball;
  }

  function close() {
    if (!open) return;
    shot.classList.remove('is-open');
    document.body.classList.remove('is-album-open');
    open = null;
    window.setTimeout(function () {
      if (!open) shot.hidden = true;
    }, 950);
  }

  balls.forEach(function (ball) {
    ball.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      show(ball);
    });
  });

  /* the backspace key closes the photograph before it leaves the screen */
  document.addEventListener('home:backspace', function (event) {
    if (!open) return;
    event.preventDefault();
    close();
  });
})();
