/* =========================================================
   The Records
   Three album covers slide into the middle of the gramophone
   screen. Choose one and it grows into the middle, and the
   black disc slides out of its sleeve. The eye of the disc is
   the key: it starts the music and stops it again.
   ========================================================= */
(function () {
  'use strict';

  var row = document.getElementById('record-row');
  var cover = document.getElementById('record-cover');
  var face = document.getElementById('record-disc-face');
  var play = document.getElementById('record-play');
  var bar = document.getElementById('record-progress');
  var fill = document.getElementById('record-progress-fill');
  var localAudio = document.getElementById('record-audio');
  var items = Array.prototype.slice.call(document.querySelectorAll('.record'));

  if (!row || !cover || !face || !play || !items.length) return;

  var list = (window.Records && window.Records.list) || [];
  var open = -1;
  var playing = false;
  var position = 0;
  var duration = 0;

  function inShell() {
    try { return window.parent && window.parent !== window; } catch (e) { return false; }
  }

  function send(type, extra) {
    var msg = { type: type };
    if (extra) for (var k in extra) msg[k] = extra[k];
    if (inShell()) {
      try { window.parent.postMessage(msg, '*'); } catch (e) {}
    } else {
      local(msg);
    }
  }

  /* only used when the screen is opened on its own, without the shell */
  function local(msg) {
    if (!localAudio) return;
    if (msg.type === 'music:play') {
      var r = list[msg.index];
      if (r) {
        if (localAudio.getAttribute('src') !== r.src) localAudio.setAttribute('src', r.src);
        localAudio.currentTime = 0;
      }
      localAudio.loop = true;
      var p = localAudio.play();
      if (p && p.catch) p.catch(function () {});
      show(true);
    } else if (msg.type === 'music:pause') {
      localAudio.pause();
      show(false);
    }
  }

  function show(isPlaying) {
    playing = !!isPlaying;
    document.body.classList.toggle('is-record-playing', playing);
    play.setAttribute('aria-label', playing ? 'Pause the record' : 'Play the record');
  }

  /* the little bar under the disc: how far the record has come */
  function setProgress(cur, dur) {
    if (typeof cur === 'number' && isFinite(cur) && cur >= 0) position = cur;
    if (typeof dur === 'number' && isFinite(dur) && dur > 0) duration = dur;
    var pct = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;
    if (fill) fill.style.width = pct.toFixed(2) + '%';
    if (bar) bar.setAttribute('aria-valuenow', String(Math.round(pct)));
  }

  function choose(i) {
    var r = list[i];
    if (!r) return;
    open = i;
    position = 0;
    duration = 0;
    setProgress(0, 0);
    cover.setAttribute('src', r.cover);
    cover.setAttribute('alt', r.alt || r.title);
    face.style.backgroundImage = 'url("' + r.cover + '")';
    document.body.classList.add('is-record-open');
    /* only one song may sound: the record that was playing stops here */
    if (localAudio && !inShell()) localAudio.pause();
    send('music:play', { index: i });
  }

  function close() {
    if (open < 0) return;
    open = -1;
    document.body.classList.remove('is-record-open');
  }

  items.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      choose(parseInt(item.getAttribute('data-index'), 10) || 0);
    });
  });

  /* the eye of the disc starts and stops the music */
  play.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (playing) send('music:pause', { index: open });
    else send('music:play', { index: open < 0 ? 0 : open });
  });

  /* the sleeve takes the record back */
  cover.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    close();
  });

  /* the backspace key puts the record back into its sleeve first */
  document.addEventListener('home:backspace', function (event) {
    if (open < 0) return;
    event.preventDefault();
    close();
  });

  /* the shell tells us what the music is doing, and how far it has come */
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.type !== 'music:state') return;
    show(d.playing);
    setProgress(d.current, d.duration);
  });

  /* the same bar when the screen plays on its own */
  if (localAudio) {
    localAudio.addEventListener('timeupdate', function () {
      setProgress(localAudio.currentTime, localAudio.duration);
    });
    localAudio.addEventListener('loadedmetadata', function () {
      setProgress(localAudio.currentTime, localAudio.duration);
    });
  }

  /* the covers slide in when the screen arrives */
  window.setTimeout(function () {
    document.body.classList.add('is-records-in');
  }, 120);
})();
