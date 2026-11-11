/* =========================================================
   The shell
   The music lives here, in the top window, so it keeps playing
   while the visitor walks from screen to screen. The scenes run
   inside a frame; the frame never carries the music away.
   ========================================================= */
(function () {
  'use strict';

  var frame = document.getElementById('shell-frame');
  var audio = document.getElementById('bgm');
  if (!frame || !audio) return;

  var list = (window.Records && window.Records.list) || [];
  var current = -1;
  var wanted = true;          /* true unless the visitor stopped it by hand */

  function srcOf(i) {
    return (list[i] && list[i].src) || '';
  }

  function tell() {
    try {
      if (frame.contentWindow) {
        frame.contentWindow.postMessage({
          type: 'music:state',
          playing: !audio.paused && !audio.ended,
          index: current,
          current: audio.currentTime || 0,
          duration: audio.duration || 0
        }, '*');
      }
    } catch (e) {}
  }

  function playIndex(i) {
    if (!list.length) return;
    if (typeof i !== 'number' || i < 0 || i >= list.length) i = 0;
    /* one sound at a time: the record that was playing stops before the
       next one starts */
    audio.pause();
    if (i !== current) {
      current = i;
      audio.setAttribute('src', srcOf(i));
      audio.currentTime = 0;
    }
    audio.loop = true;
    wanted = true;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { /* the browser waits for a gesture */ });
    tell();
  }

  function pause() {
    wanted = false;
    audio.pause();
    tell();
  }

  /* A browser will not let a page make noise before the visitor has
     touched it. Start the first record silently, and let it sing the
     moment the first hand arrives. */
  function start() {
    if (!list.length) return;
    current = 0;
    audio.loop = true;
    audio.setAttribute('src', srcOf(0));
    var p = audio.play();
    if (p && p.then) {
      p.then(function () {
        if (audio.muted) audio.muted = false;
        tell();
      }).catch(function () {
        audio.muted = true;
        var q = audio.play();
        if (q && q.catch) q.catch(function () {});
      });
    } else {
      tell();
    }
  }

  function unlock() {
    if (!wanted) return;
    if (audio.muted) audio.muted = false;
    if (audio.paused) {
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type === 'music:play') playIndex(d.index | 0);
    else if (d.type === 'music:pause') pause();
    else if (d.type === 'music:toggle') { if (audio.paused) playIndex(current); else pause(); }
    else if (d.type === 'music:gesture') unlock();
    else if (d.type === 'scene:title') { if (d.title) document.title = d.title; }
  });

  audio.addEventListener('play', tell);
  audio.addEventListener('pause', tell);
  /* the little bar under the disc follows the music */
  audio.addEventListener('timeupdate', tell);
  audio.addEventListener('loadedmetadata', tell);

  /* the first touch of the page is the key the browser is waiting for */
  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('keydown', unlock, true);

  /* the scenes run in the frame; the backspace key belongs to them */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Backspace') return;
    var win = null;
    try { win = frame.contentWindow; } catch (err) { return; }
    if (!win || !win.document) return;
    if (win.document.hasFocus && win.document.hasFocus()) return;  /* they have it already */
    e.preventDefault();
    try {
      var ev = new win.KeyboardEvent('keydown', {
        key: 'Backspace', code: 'Backspace', bubbles: true, cancelable: true
      });
      win.document.dispatchEvent(ev);
    } catch (err) {}
  });

  frame.addEventListener('load', function () {
    var doc = null;
    try { doc = frame.contentDocument; } catch (e) { doc = null; }
    if (doc) {
      /* the little helper of the host does not belong in the scenes */
      try {
        var style = doc.createElement('style');
        style.textContent = '[class*="minimax"], [id*="minimax"] { display: none !important; }';
        (doc.head || doc.documentElement).appendChild(style);
      } catch (e) {}
      /* the tab carries the name of the room the visitor is in */
      try { if (doc.title) document.title = doc.title; } catch (e) {}
    }
    /* the new scene has to be told what the music is doing right now */
    tell();
    try { frame.contentWindow.focus(); } catch (e) {}
  });

  /* let the scenes know the house is open */
  window.RecordsShell = {
    unlock: unlock,
    play: playIndex,
    pause: pause
  };

  start();
})();
