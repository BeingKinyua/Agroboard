#!/usr/bin/env node
import { spawn } from 'child_process';

const rawArgs = process.argv.slice(2);
const nextArgs = [];

for (let i = 0; i < rawArgs.length; i++) {
  const arg = rawArgs[i];
  if (arg === '--host') {
    nextArgs.push('-H');
    if (i + 1 < rawArgs.length && !rawArgs[i + 1].startsWith('-')) {
      nextArgs.push(rawArgs[++i]);
    } else {
      nextArgs.push('0.0.0.0');
    }
  } else if (arg.startsWith('--host=')) {
    nextArgs.push('-H', arg.slice(7));
  } else {
    nextArgs.push(arg);
  }
}

if (!nextArgs.includes('-p') && !nextArgs.includes('--port')) {
  nextArgs.push('-p', '3000');
}
if (!nextArgs.includes('-H') && !nextArgs.includes('--hostname')) {
  nextArgs.push('-H', '0.0.0.0');
}

const child = spawn('npx', ['next', 'dev', ...nextArgs], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
