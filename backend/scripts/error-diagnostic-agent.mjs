import { execSync } from 'node:child_process';
import { accessSync, constants, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const checks = [
  { name: 'TypeScript Check', command: 'npm run lint', timeoutMs: 180000 },
  { name: 'Production Build', command: 'npm run build', timeoutMs: 300000 },
  { name: 'Unit Tests', command: 'npm run test:ci -- --runInBand', timeoutMs: 300000 },
];

function runPreflightChecks() {
  const findings = [];

  if (!existsSync(resolve(process.cwd(), 'node_modules'))) {
    findings.push('Dependencies are not installed (`node_modules` folder is missing).');
  }

  const expectedBins = ['tsc', 'next', 'jest'];
  for (const bin of expectedBins) {
    const binPath = resolve(process.cwd(), 'node_modules/.bin', bin);
    if (!existsSync(binPath)) {
      findings.push(`Missing local binary: node_modules/.bin/${bin}`);
      continue;
    }

    try {
      accessSync(binPath, constants.X_OK);
    } catch {
      findings.push(`Binary exists but is not executable: node_modules/.bin/${bin}`);
    }
  }

  return findings;
}

function runCheck(name, command, timeoutMs) {
  try {
    const output = execSync(command, {
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
    });

    return {
      name,
      command,
      success: true,
      output,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown command failure';

    const stdout =
      typeof error === 'object' && error && 'stdout' in error
        ? String(error.stdout ?? '')
        : '';

    const stderr =
      typeof error === 'object' && error && 'stderr' in error
        ? String(error.stderr ?? '')
        : '';

    return {
      name,
      command,
      success: false,
      output: `${message}\n${stdout}\n${stderr}`,
    };
  }
}

function normalizeLine(line) {
  return line
    .replace(/\x1b\[[0-9;]*m/g, '')
    .replace(/\/root\/studio\/testing\/damianwebsite\/damianwebsite\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isSignalLine(line) {
  const lowered = line.toLowerCase();
  if (!line) return false;

  return (
    lowered.includes('error') ||
    lowered.includes('failed') ||
    lowered.includes('cannot find') ||
    lowered.includes('is not assignable') ||
    lowered.includes('timed out') ||
    lowered.includes('expected') ||
    lowered.includes('received') ||
    /^\s*at\s/.test(line)
  );
}

function collectSignatures(results) {
  const signatures = new Map();

  for (const result of results) {
    if (result.success) continue;

    const lines = result.output
      .split('\n')
      .map(normalizeLine)
      .filter((line) => line.length > 0)
      .filter((line) => isSignalLine(line));

    for (const line of lines) {
      const signature = line
        .replace(/\b\d+\b/g, '#')
        .replace(/\((\d+,\d+)\)/g, '(#,#)')
        .replace(/["'][^"']+["']/g, '"<value>"')
        .slice(0, 220);

      signatures.set(signature, (signatures.get(signature) ?? 0) + 1);
    }
  }

  return signatures;
}

function topSignatures(signatures, limit = 12) {
  return [...signatures.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([signature, count], index) => `${index + 1}. (${count}x) ${signature}`);
}

function writeReport(results, preflightFindings) {
  const signatures = collectSignatures(results);
  const failing = results.filter((result) => !result.success);
  const reportPath = resolve(process.cwd(), 'docs/ERROR_DIAGNOSTIC_REPORT.md');

  mkdirSync(resolve(process.cwd(), 'docs'), { recursive: true });

  const summaryLines = [
    '# Error Diagnostic Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Check Results',
    '',
    ...results.map(
      (result) =>
        `- ${result.name}: ${result.success ? 'PASS' : 'FAIL'} (\`${result.command}\`)`
    ),
    '',
    '## Preflight Environment Findings',
    '',
    ...(preflightFindings.length
      ? preflightFindings.map((finding) => `- ${finding}`)
      : ['- No preflight environment problems detected.']),
    '',
    '## Likely Root Cause',
    '',
    ...(preflightFindings.length
      ? [
          '- Most failures are caused by local tooling setup issues, not application code.',
          '- Install dependencies and ensure local binaries are executable before debugging code-level errors.',
        ]
      : ['- Failures appear to be code or test related (not environment bootstrap related).']),
    '',
    '## Recommended Fix Steps',
    '',
    '- Run `npm install`',
    '- Re-run `npm run diagnose:errors`',
    '- If executable errors persist, run `chmod +x node_modules/.bin/*` and retry',
    '',
    '## Most Frequent Failure Signatures',
    '',
    ...(signatures.size
      ? topSignatures(signatures)
      : ['No repeated failure signatures were detected.']),
    '',
    '## Raw Failure Snippets',
    '',
    ...(failing.length
      ? failing.flatMap((result) => [
          `### ${result.name}`,
          '',
          '```',
          result.output.slice(0, 4000),
          '```',
          '',
        ])
      : ['All selected checks passed.']),
  ];

  writeFileSync(reportPath, `${summaryLines.join('\n')}\n`, 'utf8');

  return reportPath;
}

function main() {
  console.log('Running diagnostic checks...');

  const preflightFindings = runPreflightChecks();
  if (preflightFindings.length) {
    console.log('Preflight findings detected:');
    for (const finding of preflightFindings) {
      console.log(`  - ${finding}`);
    }
  }

  const results = checks.map((check) => {
    console.log(`- ${check.name}`);
    return runCheck(check.name, check.command, check.timeoutMs);
  });

  const reportPath = writeReport(results, preflightFindings);
  const failedCount = results.filter((result) => !result.success).length;

  console.log(`\nDiagnostic report written to: ${reportPath}`);
  console.log(`Failed checks: ${failedCount}/${results.length}`);

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

main();
