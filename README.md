# 🎄 My Little Home

A retro Christmas house, built as a static site — plain HTML, CSS and JavaScript.
No frameworks, no build step, nothing to install.

> Welcome to My Little Home — snow, warm windows, a fire, a gramophone and a tree.

---

## The five screens

Every screen is **one picture and nothing else**: no header, no navigation bar, no
footer, no captions, no bars above or below. The picture keeps its original 4:3
proportion and is always shown whole — it fills the window in one direction and leaves
the deep brown wall showing in the other, so nothing in the picture, not even the
writing desk at the bottom of the fireside, can fall out of reach.

| Screen | File | What it is |
| --- | --- | --- |
| Doorstep | `doorstep.html` | The snowy house with the script title in the middle. Click anywhere and the picture zooms out of the centre, out of focus, and pulls into focus on the living room. |
| Fireside | `room.html` | The living room with three small glowing marks: the writing desk, the gramophone in the top left corner, the Christmas tree in the middle right. |
| Writing Desk | `desk.html` | The fourth picture, recoloured to `#332116`, with an empty cup in the middle and a sack of beans on its left and a jar of sugar on its right. |
| Gramophone | `gramophone.html` | The fifth picture — the turntable, covered with a translucent evergreen at 70% — with three Christmas records to choose from. |
| Christmas Tree | `tree.html` | The sixth picture, covered with a translucent evergreen at 70%, with a Christmas tree cut out of its own photograph in the middle of it. |

**Getting back.** The backspace key on the keyboard steps back one level: the fireside
returns to the doorstep, and every scene returns to the fireside. A screen that holds
something open — the album photograph, the record on the deck — takes the key first
and closes it, and only then does the key walk back a level.

---

## The shell and the music

`index.html` is the shell of the house. It holds the music and it never lets go of
it: the scenes run inside a frame, and the frame never carries the sound away with
it. So the record you put on in the gramophone keeps playing while you walk back to
the fireside, or on to the tree, or out to the snow.

- The first record starts by itself as soon as the house opens. A browser that will
  not let a page make a sound before the visitor has touched it gets the music
  silently first and the voice the moment the first hand arrives.
- Choosing a record in the gramophone hands the track to the shell, which loops it
  for as long as the page is open.
- The eye of the disc is the key: touch it and the music stops, touch it again and
  it starts. Nothing else in the house can stop the music.

---

## Rules the site follows

**One palette.** Wine red, vintage green, dark brown, cream yellow — declared once at the top of `assets/css/style.css` and used by every screen:

```
wine     #2e0d14 / #3e1119 / #5e1c28 / #8c2f3c
green    #1a241c / #223327 / #33503c / #4e7355
brown    #160e09 / #241710 / #38261a / #4e3626
cream    #f2e3bc / #e2ce9e / #c4ac7c   + gold #d9b45f
```

**Every picture is exactly 4:3.** The source photographs were cropped — never
scaled — until each one measured precisely 4:3. The stage on every screen keeps that
ratio and fits the window (`width: min(100vw, 133.33vh)` with `aspect-ratio: 4 / 3`),
so the picture is shown whole and undistorted; the window never crops it. Everything
inside a picture is measured in `cqw`, the width of the stage, so the furniture keeps
its proportions whatever shape the window is. Nothing is stretched or blown out of shape.

**Nothing is written over the picture.** The only text on the site is the script title
on the doorstep, which belongs to the photograph itself, and the script title of the
gramophone screen. Each page keeps one `h1` for screen readers only.

**The middle zoom.** On the doorstep, a click anywhere grows the next picture out of
the centre of the screen. The picture we leave goes out of focus behind it while the
new one arrives, sharpens, and fills the window — a slow depth-of-field turn.

**The three touches.** On the fireside screen the three marks sit exactly on the
objects. Their positions were measured against the photograph itself, so they stay on
the desk, on the gramophone and on the tree at every window size. Touching one pushes
the picture in towards it and turns to that scene.

**The cup of coffee.** On the desk screen the empty cup, the sack of beans and the jar
of sugar are cut out of their photographs, so they sit on the brown ground with no
background at all. Touch the beans or the sugar and it swings up over the cup in an
arc, trembles a little, and travels back to the place it came from. While the beans
tremble, the empty cup turns into the cup full of coffee.

**The christmas album.** On the tree screen the tree is cut out of its own photograph
and stands in the middle of the picture, with the words *Christmas Album* along the
left edge. Six of its gold baubles can be touched. Touch one and its photograph grows
out of the bauble, out of focus and pulling into focus, in a polaroid frame over the
tree, while the tree steps aside and softens behind it. The photograph keeps the
proportion it was taken in. The backspace key takes the photograph back to the tree.

**The three records.** On the gramophone screen the words *Choose a Record* stand at
the top in the same script as the doorstep, and three album covers slide into the
middle of the picture. Choose one and the sleeve grows into the middle while the
black disc slides out of it; the eye of the disc is the key that starts and stops the
music, and the disc turns while the music plays. The covers keep the square
proportion of the real sleeves. The backspace key puts the record back into its
sleeve.

**English only.** Every word on the site is English.

---

## Running it locally

```bash
python -m http.server 8123
# or
npx serve .
```

Then open <http://127.0.0.1:8123/index.html>.

---

## Layout of the project

```
christmas-home/
├─ index.html          the shell: the frame and the music that never stops
├─ doorstep.html       the doorstep, with the script title
├─ room.html           fireside, with the three marks
├─ desk.html           writing desk, with the cup of coffee
├─ gramophone.html     gramophone, with the three records
├─ tree.html           christmas tree
├─ assets/
│  ├─ css/style.css    the palette and every rule
│  ├─ js/
│  │  ├─ shell.js      the shell: the music, and the frame
│  │  ├─ records.js    the three records, shared by the shell and the gramophone
│  │  ├─ site.js       backspace, page turn, entrance
│  │  ├─ welcome.js    the middle zoom
│  │  ├─ room.js       the three marks
│  │  ├─ desk.js       the cup of coffee
│  │  ├─ album.js      the christmas album
│  │  └─ gramophone.js the three records and the disc
│  ├─ audio/           the three records, as they were given
│  └─ img/             the photographs, all cropped to 4:3,
│                      plus the cut-out objects of the desk,
│                      the cut-out tree and the three album covers
└─ docs/requirements.png   the brief, kept for reference
```

---

## Against the brief

| Requirement | Here |
| --- | --- |
| At least four pages with working navigation | Five screens; the marks and the middle zoom lead forwards, the backspace key leads back |
| Their own content | Each scene has its own picture and its own screen |
| Semantic, accessible markup | `main`, one `h1` per page, descriptive names on every mark, visible focus ring |
| Responsive layout | One fluid 4:3 stage that fits the window whole |
| At least one interactive element | The middle zoom, the three marks, the cup of coffee, the album and the records |
| Live at a real address | Published as a static site — see the deployment note below |
| A Git history showing the work develop over the semester | Staged commits across the semester — see `git log` |

---

## Deployment

The house is published as a static site on GitHub Pages, straight from the root of
the `main` branch — the files in this repository are the files that are served.

**Live address:** <https://lism-555.github.io/Welcome-to-my-little-home/>

Every path inside the site is relative, so the repository can be served from a
sub-path (as it is here) or from a domain of its own without a single change.
There is no build step: pushing to `main` is the deployment.
