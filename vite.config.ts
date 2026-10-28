import react from '@vitejs/plugin-react'
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'

const SOUNDS = join(import.meta.dirname, 'public/sounds')

// Only while running `npm run dev`: lets the letter-sound recorder save clips into public/sounds,
// so they ship with the app. PUT /__sounds/en/M saves a WAV, DELETE removes it.
// public/sounds/index.json lists what exists, so the app knows which clips to play.
function letterSoundRecorder(): Plugin {
  return {
    name: 'letter-sound-recorder',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__sounds', async (req, res) => {
        const match = req.url?.match(/^\/(en|it)\/([A-Z])$/)
        if (!match || (req.method !== 'PUT' && req.method !== 'DELETE')) {
          res.statusCode = 400
          res.end('expected PUT or DELETE /__sounds/<en|it>/<LETTER>')
          return
        }
        const [, lang, letter] = match
        const file = join(SOUNDS, lang, `${letter}.wav`)

        if (req.method === 'PUT') {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          await mkdir(join(SOUNDS, lang), { recursive: true })
          await writeFile(file, Buffer.concat(chunks))
        } else {
          await rm(file, { force: true })
        }
        // Reply with the new list: the dev server takes a moment to notice new files in public/,
        // so asking for index.json straight away could give the old one.
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(await writeIndex()))
      })
    },
  }
}

async function writeIndex() {
  const index: Record<string, string[]> = {}
  for (const lang of ['en', 'it']) {
    const files = await readdir(join(SOUNDS, lang)).catch(() => [])
    index[lang] = files.filter((f) => f.endsWith('.wav')).map((f) => f.replace('.wav', '')).sort()
  }
  await mkdir(SOUNDS, { recursive: true })
  await writeFile(join(SOUNDS, 'index.json'), JSON.stringify(index, null, 2) + '\n')
  return index
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), letterSoundRecorder()],
})
