/* The three records of the house. The shell keeps the music alive between
   the screens; the gramophone screen asks it for a different record. */
(function () {
  'use strict';

  var RECORDS = [
    {
      title: 'The Christmas Waltz',
      artist: 'Laufey',
      cover: 'assets/img/cover-1.jpg',
      src: 'assets/audio/the-christmas-waltz.mp3',
      alt: 'A little girl in a pink dress dancing beside a Christmas tree'
    },
    {
      title: 'Sweet Dreams',
      artist: 'TOMORROW X TOGETHER',
      cover: 'assets/img/cover-2.jpg',
      src: 'assets/audio/sweet-dreams.mp3',
      alt: 'Five young men sitting together in a Christmas living room'
    },
    {
      title: 'Better Than Snow',
      artist: 'Norah Jones & Laufey',
      cover: 'assets/img/cover-3.jpg',
      src: 'assets/audio/better-than-snow.mp3',
      alt: 'A snowy window with a little Christmas tree and red gifts behind it'
    }
  ];

  window.Records = { list: RECORDS };
})();
