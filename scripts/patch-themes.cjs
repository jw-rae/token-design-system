#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const themesPath = path.join(__dirname, '..', 'css', 'themes.css');

if (!fs.existsSync(themesPath)) {
  process.exit(0);
}

const css = fs.readFileSync(themesPath, 'utf8');
const open = (css.match(/{/g) || []).length;
const close = (css.match(/}/g) || []).length;
const diff = open - close;

if (diff > 0) {
  const padding = css.endsWith('\n') ? '' : '\n';
  const closing = '}\n'.repeat(diff);
  fs.writeFileSync(themesPath, css + padding + closing);
  console.log(`patch-themes: fixed ${diff} missing brace(s) in themes.css`);
}
