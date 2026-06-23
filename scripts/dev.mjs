import { spawn } from 'node:child_process';
import net from 'node:net';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const node = process.execPath;
const apiPort = process.env.API_DEV_PORT || '3001';
const vitePort = process.env.VITE_DEV_PORT || '3000';
const viteEntry = new URL('../node_modules/vite/bin/vite.js', import.meta.url);
const tsxEntry = new URL('../node_modules/tsx/dist/cli.mjs', import.meta.url);
const workspace = fileURLToPath(new URL('..', import.meta.url));

const children = [];

const api = spawn(node, [fileURLToPath(tsxEntry), 'server.ts'], {
  cwd: workspace,
  env: { ...process.env, PORT: apiPort },
  stdio: 'inherit',
});
children.push(api);

const waitForPort = (port, timeoutMs = 30000) => new Promise((resolve, reject) => {
  const startedAt = Date.now();
  const check = () => {
    const socket = net.createConnection({ host: '127.0.0.1', port: Number(port) });
    socket.once('connect', () => {
      socket.destroy();
      resolve();
    });
    socket.once('error', () => {
      socket.destroy();
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error(`API server did not start on port ${port} within ${timeoutMs}ms.`));
      } else {
        setTimeout(check, 250);
      }
    });
  };
  check();
});

await waitForPort(apiPort);

const vite = spawn(node, [fileURLToPath(viteEntry), `--port=${vitePort}`, '--host=0.0.0.0'], {
  cwd: workspace,
  env: { ...process.env, API_DEV_URL: `http://127.0.0.1:${apiPort}` },
  stdio: 'inherit',
});
children.push(vite);

let stopping = false;
const stop = (code = 0) => {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  setTimeout(() => process.exit(code), 100);
};

for (const child of children) {
  child.on('exit', code => {
    if (!stopping && code && code !== 0) stop(code);
  });
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
