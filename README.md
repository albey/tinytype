# TinyType

A simple typing game for toddlers. A word appears in big capital letters, and your child copies it underneath, one letter at a time, on a real keyboard. When the word is finished, TinyType says it out loud and celebrates.

![TinyType: the word MOM with three empty slots underneath and a colour picker on the right](docs/screenshot.png)

- **Big, uppercase letters**, the same as the ones printed on the keyboard, whether Caps Lock is on or not
- **One slot per letter**, with a blinking cursor showing which letter comes next
- **Colour picker**: each letter comes out in the colour chosen when it was typed
- **Gentle mistakes**: a wrong letter wobbles and plays a soft "bonk"
- **English and Italian**, with matching words and voice
- **No accounts, no tracking**: nothing leaves your computer. Settings are saved in your browser.

Made for a toddler who loves banging on the laptop keyboard. Works best on a laptop or desktop with a physical keyboard. A tablet version is planned.

## How to play

| Control | What it does |
|---|---|
| Letter keys | Type the next letter |
| Backspace | Delete the last letter |
| Coloured circles | Choose the colour of the next letters |
| 🇬🇧 EN / 🇮🇹 IT | Switch language (words and voice) |
| **Copy** | A wrong letter wobbles and isn't kept, so the child tries again |
| **Free play** | Any letter is kept. Wrong ones show faded with a "bonk", and the child deletes them with Backspace |
| Next word → | Skip to the next word |
| ⛶ Full screen | Hides the browser bars so little hands can't click them |

**Tip:** use Full screen and stay nearby. A web page can't block shortcuts like Cmd+Q or Cmd+W.

## Install and run it on your computer

You need **Node.js**, the free program that runs TinyType's tools. You only install it once.

### 1. Install Node.js

- **Mac / Windows:** download the "LTS" installer from [nodejs.org](https://nodejs.org) and run it.
- **Mac with Homebrew:** `brew install node`

To check it worked, open a terminal (on Mac: the **Terminal** app; on Windows: **PowerShell**) and type:

```sh
node -v
```

You should see a version number, such as `v24.x.x`.

### 2. Download TinyType

Either:

- **No git:** on this page, click the green **Code** button → **Download ZIP**, then unzip it, or
- **With git:**
  ```sh
  git clone https://github.com/albey/tinytype.git
  ```

### 3. Start it

In the terminal, go into the TinyType folder and run two commands:

```sh
cd tinytype        # or wherever you unzipped it, e.g. cd ~/Downloads/tinytype-main
npm install        # first time only: downloads what TinyType needs
npm run dev        # starts TinyType
```

The terminal prints an address. Open **http://localhost:5173** in your browser and start typing.

To stop TinyType, click the terminal window and press **Ctrl+C**. Next time, you only need `npm run dev`.

## Change the words

The words live in [`src/words.ts`](src/words.ts). Open it in any text editor and add or change words in capitals:

```ts
export const WORDS = {
  en: ['MOM', 'DAD', 'BABY', 'CAT', 'DOG', 'BALL'],
  it: ['MAMMA', 'PAPÀ', 'NONNA', 'CANE', 'GATTO', 'PALLA'],
}
```

Save the file and the page updates by itself. Accented letters are fine: a plain **A** on the keyboard counts for **À**.

A settings screen for adding words without editing code is coming next.

## Roadmap

- [x] Copy a word letter by letter, colours, English and Italian, read-aloud
- [ ] Add your own words in the app, random order, repeat each word a few times
- [ ] Tap a letter to hear it ("A for Apple")
- [ ] Memory mode: hide the word, or show a picture to spell
- [ ] Online version, nothing to install
- [ ] iPad / tablet app with a big on-screen keyboard

## For developers

Built with [Vite](https://vite.dev), [React](https://react.dev) and TypeScript. No backend: settings are stored in `localStorage`, speech uses the browser's built-in Web Speech API, and sounds are generated with the Web Audio API.

```sh
npm run dev       # development server with live reload
npm run build     # type-check and build to dist/
npm run lint      # lint with oxlint
```

| File | What it does |
|---|---|
| `src/App.tsx` | Game state and keyboard handling |
| `src/components/WordRows.tsx` | The word and the typing slots |
| `src/components/ColourPicker.tsx` | Colour swatches |
| `src/components/Toolbar.tsx` | Language, mode, next word, full screen |
| `src/words.ts` | Word lists and letter matching |
| `src/speech.ts`, `src/sounds.ts` | Read-aloud and the "bonk" sound |

## Licence

[MIT](LICENSE): free to use, change and share.
