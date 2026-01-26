/**
 * Build script to generate CSS from tokens and themes
 */
const fs = require('fs')
const path = require('path')

// Ensure output directories exist
const cssDir = path.join(__dirname, '../css')
if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true })
}

console.log('✅ CSS build complete!')
console.log('Files generated:')
console.log('  - css/foundations.css')
console.log('  - css/themes.css')
console.log('  - css/utilities.css')

// Create a combined CSS file for convenience
const foundationsCSS = fs.readFileSync(path.join(cssDir, 'foundations.css'), 'utf8')
const themesCSS = fs.readFileSync(path.join(cssDir, 'themes.css'), 'utf8')
const utilitiesCSS = fs.readFileSync(path.join(cssDir, 'utilities.css'), 'utf8')

const combinedCSS = `/* Design System - Combined CSS */
/* This file combines all design system styles for convenience */

${foundationsCSS}

${themesCSS}

${utilitiesCSS}
`

fs.writeFileSync(path.join(cssDir, 'design-system.css'), combinedCSS)
console.log('  - css/design-system.css (combined)')

// Generate CSS import file
const importCSS = `/* Design System - CSS Imports */
@import './foundations.css';
@import './themes.css'; 
@import './utilities.css';
`

fs.writeFileSync(path.join(cssDir, 'index.css'), importCSS)
console.log('  - css/index.css (imports)')
console.log('🎉 Build complete!')