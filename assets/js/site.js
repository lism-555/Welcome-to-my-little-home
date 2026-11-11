/* Shared behaviour: the backspace key walks back one level, the screens
   turn softly and settle in when they arrive. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* one level up: the fireside goes back to the doorstep, every scene
     goes back to the fireside. Each screen declares its own parent, so the
     key always means the same thing, even mid turn. */
  var PARENT = {
    'room.html': 'index.html',
    'desk.html': 'room.html',
    'gramophone.html': 'room.html',
    'tree.html': 'room.html'
  };

  /* the scenes run inside the frame of the shell */
  function inFrame() {
    try { return window.top !== window.self; } catch (e) { return true; }
  }

  function parentOf() {
    var body = document.body;
    if (body) {
      var declared = body.getAttribute('data-parent');
      if (declared) return declared;
    }
    var path = window.location.pathname.split('/').pop();
    var parent = PARENT[path] || '';
    /* inside the shell the way back is the doorstep, not the shell itself */
    if (parent === 'index.html' && inFrame()) return 'doorstep.html';
    return parent;
  }

  function busy() {
    return document.body && document.body.getAttribute('data-busy') === '1';
  }

  function go(href) {
    if (reduce) { window.location.href = href; return; }
    document.body.setAttribute('data-busy', '1');
    document.body.classList.add('is-leaving');
    window.setTimeout(function () { window.location.href = href; }, 340);
  }

  /* keyboard: Backspace steps back one level */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Backspace') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (busy()) return;                     /* a turn is already on its way */
    /* a screen can hold something open (the album photograph, the record);
       it takes the key first, and only then does the key walk back a level */
    if (!document.dispatchEvent(new CustomEvent('home:backspace', { cancelable: true }))) return;
    var parent = parentOf();
    if (!parent) return;
    e.preventDefault();
    go(parent);
  });

  /* the screens settle in when they arrive */
  window.requestAnimationFrame(function () {
    document.body.classList.add('is-entering');
  });

  /* the shell keeps the music alive; it may only make a sound once the
     visitor has touched the page, so the first touch is passed on */
  function firstTouch() {
    document.removeEventListener('pointerdown', firstTouch, true);
    document.removeEventListener('keydown', firstTouch, true);
    if (!inFrame()) return;
    try { window.parent.postMessage({ type: 'music:gesture' }, '*'); } catch (e) {}
  }
  document.addEventListener('pointerdown', firstTouch, true);
  document.addEventListener('keydown', firstTouch, true);

  /* the shell carries the name of the room in the tab */
  if (inFrame()) {
    try { window.parent.postMessage({ type: 'scene:title', title: document.title }, '*'); } catch (e) {}
  }
})();
