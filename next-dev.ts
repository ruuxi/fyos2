import ms from 'ms';
import { Sandbox } from '@vercel/sandbox';
import { setTimeout } from 'timers/promises';
import { spawn } from 'child_process';
 
async function main() {
  const sandbox = await Sandbox.create({
    teamId: process.env.VERCEL_TEAM_ID!,
    projectId: process.env.VERCEL_PROJECT_ID!,
    token: process.env.VERCEL_TOKEN!,
    source: {
      url: 'https://github.com/ruuxi/fyos2.git',
      type: 'git',
    },
    resources: { vcpus: 4 },
    // Timeout in milliseconds: ms('10m') = 600000
    // Defaults to 5 minutes. The maximum is 45 minutes.
    timeout: ms('10m'),
    ports: [3000],
    runtime: 'node22',
  });
 
  console.log(`Installing dependencies...`);
  const install = await sandbox.runCommand({
    cmd: 'npm',
    args: ['install', '--loglevel', 'info'],
    stderr: process.stderr,
    stdout: process.stdout,
  });
 
  if (install.exitCode != 0) {
    console.log('installing packages failed');
    process.exit(1);
  }
 
  console.log(`Starting the development server...`);
  await sandbox.runCommand({
    cmd: 'npm',
    args: ['run', 'dev'],
    stderr: process.stderr,
    stdout: process.stdout,
    detached: true,
  });
 
  await setTimeout(500);
  spawn('open', [sandbox.domain(3000)]);
}
 
main().catch(console.error);