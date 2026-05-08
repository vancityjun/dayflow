import http from 'node:http';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const babel = require('@babel/core');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const designDir = path.join(repoRoot, 'design');
const port = Number(process.env.PORT || 4310);

const reactCdn = 'https://unpkg.com/react@18/umd/react.development.js';
const reactDomCdn = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js';

const files = listDesignFiles();

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/') {
    return sendHtml(response, renderIndex(files));
  }

  if (pathname === '/health') {
    return send(response, 200, 'text/plain', 'ok');
  }

  if (pathname.startsWith('/html/')) {
    const fileName = decodePathSegment(pathname.slice('/html/'.length));
    return sendHtml(response, renderHtmlPreview(fileName));
  }

  if (pathname.startsWith('/source/html/')) {
    const fileName = decodePathSegment(pathname.slice('/source/html/'.length));
    return serveRawDesignFile(response, fileName, 'text/html; charset=utf-8');
  }

  if (pathname.startsWith('/jsx/')) {
    const fileName = decodePathSegment(pathname.slice('/jsx/'.length));
    return sendHtml(response, renderJsxPreview(fileName));
  }

  if (pathname.startsWith('/render/')) {
    const fileName = decodePathSegment(pathname.slice('/render/'.length).replace(/\.js$/, ''));
    return serveCompiledJsx(response, fileName);
  }

  send(response, 404, 'text/plain', 'Not found');
});

server.listen(port, () => {
  console.log(`Design preview running at http://localhost:${port}`);
});

function listDesignFiles() {
  return readdirSync(designDir)
    .filter((file) => file.endsWith('.html') || file.endsWith('.jsx'))
    .sort((a, b) => a.localeCompare(b));
}

function renderIndex(fileNames) {
  const htmlFiles = fileNames.filter((file) => file.endsWith('.html'));
  const jsxFiles = fileNames.filter((file) => file.endsWith('.jsx'));

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DayFlow Design Preview</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; background: #faf8f4; color: #232422; }
      main { max-width: 1080px; margin: 0 auto; padding: 32px 24px 80px; }
      h1 { font-size: 40px; margin: 0; }
      p { color: #8a857a; line-height: 1.6; max-width: 760px; }
      section { margin-top: 32px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
      a { display: block; padding: 16px 18px; border-radius: 16px; background: white; text-decoration: none; color: inherit; border: 1px solid #e8e3d7; }
      .eyebrow { font-size: 12px; text-transform: uppercase; letter-spacing: 0.16em; color: #8a857a; margin-bottom: 8px; }
      .name { font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">Temporary tooling</div>
      <h1>DayFlow design preview</h1>
      <p>Browser-only preview for raw design references. This tool is isolated from the Expo app and can be deleted after MVP without touching production app code.</p>

      <section>
        <div class="eyebrow">HTML references</div>
        <div class="grid">
          ${htmlFiles
            .map(
              (file) => `
            <a href="/html/${encodeURIComponent(file)}">
              <div class="name">${escapeHtml(file)}</div>
            </a>`,
            )
            .join('')}
        </div>
      </section>

      <section>
        <div class="eyebrow">JSX references</div>
        <div class="grid">
          ${jsxFiles
            .map(
              (file) => `
            <a href="/jsx/${encodeURIComponent(file)}">
              <div class="name">${escapeHtml(file)}</div>
            </a>`,
            )
            .join('')}
        </div>
      </section>
    </main>
  </body>
</html>`;
}

function renderHtmlPreview(fileName) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(fileName)}</title>
    <style>
      body { margin: 0; font-family: system-ui, sans-serif; background: #111; color: white; }
      header { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; background: #1b1b1a; }
      a { color: #d7fe03; text-decoration: none; }
      iframe { border: 0; width: 100vw; height: calc(100vh - 52px); background: white; }
    </style>
  </head>
  <body>
    <header>
      <div>${escapeHtml(fileName)}</div>
      <a href="/">Back</a>
    </header>
    <iframe src="/source/html/${encodeURIComponent(fileName)}"></iframe>
  </body>
</html>`;
}

function renderJsxPreview(fileName) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(fileName)}</title>
    <style>
      html, body { margin: 0; min-height: 100%; background: #111; }
      body { font-family: Inter, system-ui, sans-serif; }
      header { padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; background: #1b1b1a; color: white; }
      a { color: #d7fe03; text-decoration: none; }
      #root { min-height: calc(100vh - 52px); }
    </style>
    <script src="${reactCdn}"></script>
    <script src="${reactDomCdn}"></script>
  </head>
  <body>
    <header>
      <div>${escapeHtml(fileName)}</div>
      <a href="/">Back</a>
    </header>
    <div id="root"></div>
    <script src="/render/${encodeURIComponent(fileName)}.js"></script>
  </body>
</html>`;
}

function serveCompiledJsx(response, fileName) {
  const fullPath = path.join(designDir, fileName);
  if (!existsSync(fullPath) || !fileName.endsWith('.jsx')) {
    return send(response, 404, 'text/plain', 'JSX file not found');
  }

  const source = readFileSync(fullPath, 'utf8');
  const supportFiles = getSupportFiles(fileName, source);
  const compiled = babel.transformSync(
    [
      ...supportFiles.map((support) => readFileSync(path.join(designDir, support), 'utf8')),
      source,
    ].join('\n\n'),
    {
      presets: [['@babel/preset-react', { runtime: 'classic' }]],
      filename: fileName,
      babelrc: false,
      configFile: false,
      comments: false,
    },
  );

  send(response, 200, 'application/javascript; charset=utf-8', compiled?.code || '');
}

function getSupportFiles(fileName, source) {
  const supports = [];

  if (
    fileName !== 'ios-frame.jsx' &&
    /(IOSDevice|IOSStatusBar|IOSNavBar|IOSGlassPill|IOSKeyboard)/.test(source)
  ) {
    supports.push('ios-frame.jsx');
  }

  if (
    fileName !== 'tweaks-panel.jsx' &&
    /(useTweaks|TweaksPanel|TweakSection|TweakToggle)/.test(source)
  ) {
    supports.push('tweaks-panel.jsx');
  }

  return supports;
}

function serveRawDesignFile(response, fileName, type) {
  const fullPath = path.join(designDir, fileName);
  if (!existsSync(fullPath)) {
    return send(response, 404, 'text/plain', 'File not found');
  }

  send(response, 200, type, readFileSync(fullPath, 'utf8'));
}

function sendHtml(response, html) {
  send(response, 200, 'text/html; charset=utf-8', html);
}

function send(response, statusCode, contentType, body) {
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.end(body);
}

function decodePathSegment(value) {
  return decodeURIComponent(value);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
