/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';

const app = express();
const PORT = 3000;

// Security & SEO: Guarantee all API routes are never indexed or archived by web crawlers
app.use('/api', (_req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  next();
});

// Handle raw binary video bodies up to 100MB
app.use('/api/convert-video', express.raw({ type: '*/*', limit: '100mb' }));

app.post('/api/convert-video', async (req, res) => {
  try {
    const targetFormat = ((req.headers['x-target-format'] as string) || 'mp4').toLowerCase();
    const duration = parseFloat((req.headers['x-target-duration'] as string) || '3.5');
    const inputBuffer = req.body as Buffer;

    if (!inputBuffer || !Buffer.isBuffer(inputBuffer) || inputBuffer.length === 0) {
      res.status(400).send('No video payload received');
      return;
    }

    const tempId = randomUUID();
    const tempIn = path.join(os.tmpdir(), `intro-in-${tempId}.webm`);
    const tempOut = path.join(os.tmpdir(), `intro-out-${tempId}.${targetFormat}`);

    await fs.promises.writeFile(tempIn, inputBuffer);

    // Build FFmpeg conversion command with optimal compatibility
    // MP4: H.264 (yuv420p) + AAC (192kbps) + faststart (for instant streaming & universal QuickTime/WMP support)
    // WebM: VP9 + Opus with clean EBML duration headers
    const args =
      targetFormat === 'mp4'
        ? [
            '-y',
            '-i',
            tempIn,
            '-c:v',
            'libx264',
            '-preset',
            'veryfast',
            '-crf',
            '18',
            '-pix_fmt',
            'yuv420p',
            '-c:a',
            'aac',
            '-b:a',
            '192k',
            '-movflags',
            '+faststart',
            '-t',
            duration.toString(),
            tempOut,
          ]
        : [
            '-y',
            '-i',
            tempIn,
            '-c:v',
            'libvpx-vp9',
            '-b:v',
            '5M',
            '-c:a',
            'libopus',
            '-b:a',
            '192k',
            '-t',
            duration.toString(),
            tempOut,
          ];

    const proc = spawn('ffmpeg', args);

    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('close', async (code) => {
      try {
        if (code !== 0) {
          console.error('FFmpeg transcode error (code ' + code + '):', stderr);
          res.status(500).send('FFmpeg processing failed');
          return;
        }

        const outBuffer = await fs.promises.readFile(tempOut);
        res.setHeader(
          'Content-Type',
          targetFormat === 'mp4' ? 'video/mp4' : 'video/webm'
        );
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="speak-in-progress-intro-${duration}s.${targetFormat}"`
        );
        res.setHeader('Content-Length', outBuffer.length.toString());
        res.send(outBuffer);
      } catch (err) {
        console.error('Failed reading transcode output:', err);
        res.status(500).send('Failed reading video output');
      } finally {
        fs.promises.unlink(tempIn).catch(() => {});
        fs.promises.unlink(tempOut).catch(() => {});
      }
    });
  } catch (err) {
    console.error('Video conversion API exception:', err);
    res.status(500).send('Server error');
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ffmpeg: true });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  // Directly serve public directory assets with proper content types
  app.use(express.static(path.resolve('public')));

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
