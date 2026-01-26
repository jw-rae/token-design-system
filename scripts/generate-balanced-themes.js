/**
 * Theme Generator Script
 * Creates balanced color scales and systematic theme definitions
 */

const fs = require('fs');
const path = require('path');

// Color scale generation utilities
function interpolateColor(color1, color2, factor) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);

    const r = Math.round(c1.r + factor * (c2.r - c1.r));
    const g = Math.round(c1.g + factor * (c2.g - c1.g));
    const b = Math.round(c1.b + factor * (c2.b - c1.b));

    return rgbToHex(r, g, b);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Generate proportional color scale
function generateColorScale(lightColor, darkColor) {
    // Non-linear scaling for better visual balance
    const steps = [
        { key: '50', factor: 0.03 },    // Lightest
        { key: '100', factor: 0.08 },
        { key: '200', factor: 0.15 },
        { key: '300', factor: 0.25 },
        { key: '400', factor: 0.40 },   // More balanced jump
        { key: '500', factor: 0.55 },   // Middle
        { key: '600', factor: 0.70 },
        { key: '700', factor: 0.82 },
        { key: '800', factor: 0.91 },
        { key: '900', factor: 0.96 },
        { key: '950', factor: 0.99 }    // Darkest
    ];

    const scale = {};
    steps.forEach(step => {
        scale[step.key] = interpolateColor(lightColor, darkColor, step.factor);
    });

    return scale;
}

// Theme configurations
const themeConfigs = {
    warm: {
        light: '#faf9f7',
        dark: '#0c0a09',
        accent: {
            success: '#6b8e5a',
            warning: '#8c7860',
            error: '#8a6660',
            info: '#65758c'
        }
    },
    cool: {
        light: '#f8fafc',
        dark: '#020617',
        accent: {
            success: '#6d8570',
            warning: '#8c7555',
            error: '#8a5f5f',
            info: '#5f748c'
        }
    },
    pink: {
        light: '#fdf2f8',
        dark: '#3d1429',
        accent: {
            success: '#7a9b7a',
            warning: '#d4a679',
            error: '#a67a7a',
            info: '#b8829e'
        }
    },
    green: {
        light: '#f9faf9',
        dark: '#151815',
        accent: {
            success: '#7a8f7a',
            warning: '#c4b370',
            error: '#a67a7a',
            info: '#7ba3a3'
        }
    },
    blue: {
        light: '#f8fafd',
        dark: '#0a1426',
        accent: {
            success: '#7ba8a0',
            warning: '#b8a885',
            error: '#a87a7a',
            info: '#6b9fd9'
        }
    }
};

// Generate systematic theme CSS
function generateThemeCSS() {
    let css = `/* Generated Theme CSS - Balanced Color Scales */\n\n`;

    // Base theme structure
    css += `:root {\n`;
    css += `  --theme-contrast-ratio: 0.15;\n`;
    css += `  --theme-border-opacity: 0.2;\n`;
    css += `  --theme-surface-opacity: 0.05;\n`;
    css += `}\n\n`;

    Object.entries(themeConfigs).forEach(([themeName, config]) => {
        const scale = generateColorScale(config.light, config.dark);

        css += `/* ${themeName.toUpperCase()} THEME */\n`;
        css += `[data-theme="${themeName}"] {\n`;

        // Primary color scale
        Object.entries(scale).forEach(([step, color]) => {
            css += `  --color-brand-primary-${step}: ${color};\n`;
        });

        css += `\n`;

        // Systematic semantic mappings using the scale
        const semanticMappings = {
            'background-primary': '50',
            'background-secondary': '100',
            'background-tertiary': '200',
            'background-inverse': '950',
            'surface-primary': '#ffffff',
            'surface-secondary': 'var(--color-brand-primary-50)',
            'surface-tertiary': 'var(--color-brand-primary-100)',
            'surface-elevated': '#ffffff',
            'text-primary': 'var(--color-brand-primary-950)',
            'text-secondary': 'var(--color-brand-primary-800)',
            'text-tertiary': 'var(--color-brand-primary-700)',
            'text-inverse': 'var(--color-brand-primary-50)',
            'text-disabled': 'var(--color-brand-primary-300)',
            'border-primary': 'var(--color-brand-primary-300)',
            'border-secondary': 'var(--color-brand-primary-400)',
            'border-interactive': 'var(--color-brand-primary-500)',
            'border-focus': 'var(--color-brand-primary-600)'
        };

        Object.entries(semanticMappings).forEach(([semantic, value]) => {
            const colorValue = value.startsWith('var(') || value.startsWith('#')
                ? value
                : `var(--color-brand-primary-${value})`;
            css += `  --color-${semantic}: ${colorValue};\n`;
        });

        css += `\n`;

        // Accent colors
        Object.entries(config.accent).forEach(([type, color]) => {
            css += `  --color-${type}-500: ${color};\n`;
        });

        css += `}\n\n`;
    });

    // Dark mode overrides
    css += `/* DARK MODE SYSTEMATIC OVERRIDES */\n`;
    css += `[data-theme][data-color-scheme="dark"] {\n`;
    css += `  --color-background-primary: var(--color-brand-primary-950);\n`;
    css += `  --color-background-secondary: var(--color-brand-primary-900);\n`;
    css += `  --color-background-tertiary: var(--color-brand-primary-800);\n`;
    css += `  --color-background-inverse: var(--color-brand-primary-50);\n`;
    css += `  \n`;
    css += `  --color-surface-primary: var(--color-brand-primary-950);\n`;
    css += `  --color-surface-secondary: var(--color-brand-primary-900);\n`;
    css += `  --color-surface-tertiary: var(--color-brand-primary-800);\n`;
    css += `  --color-surface-elevated: var(--color-brand-primary-900);\n`;
    css += `  --color-surface-overlay: color-mix(in srgb, var(--color-brand-primary-950) 80%, transparent);\n`;
    css += `  \n`;
    css += `  --color-text-primary: var(--color-brand-primary-50);\n`;
    css += `  --color-text-secondary: var(--color-brand-primary-200);\n`;
    css += `  --color-text-tertiary: var(--color-brand-primary-300);\n`;
    css += `  --color-text-inverse: var(--color-brand-primary-950);\n`;
    css += `  --color-text-disabled: var(--color-brand-primary-600);\n`;
    css += `  --color-text-link: var(--color-brand-primary-400);\n`;
    css += `  --color-text-link-hover: var(--color-brand-primary-300);\n`;
    css += `  \n`;
    css += `  --color-border-primary: var(--color-brand-primary-700);\n`;
    css += `  --color-border-secondary: var(--color-brand-primary-600);\n`;
    css += `  --color-border-interactive: var(--color-brand-primary-500);\n`;
    css += `  --color-border-focus: var(--color-brand-primary-400);\n`;
    css += `}\n\n`;

    css += `@media (prefers-color-scheme: dark) {\n`;
    css += `  [data-theme]:not([data-color-scheme="light"]) {\n`;
    css += `    --color-background-primary: var(--color-brand-primary-950);\n`;
    css += `    --color-background-secondary: var(--color-brand-primary-900);\n`;
    css += `    --color-background-tertiary: var(--color-brand-primary-800);\n`;
    css += `    --color-background-inverse: var(--color-brand-primary-50);\n`;
    css += `    \n`;
    css += `    --color-surface-primary: var(--color-brand-primary-950);\n`;
    css += `    --color-surface-secondary: var(--color-brand-primary-900);\n`;
    css += `    --color-surface-tertiary: var(--color-brand-primary-800);\n`;
    css += `    --color-surface-elevated: var(--color-brand-primary-900);\n`;
    css += `    --color-surface-overlay: color-mix(in srgb, var(--color-brand-primary-950) 80%, transparent);\n`;
    css += `    \n`;
    css += `    --color-text-primary: var(--color-brand-primary-50);\n`;
    css += `    --color-text-secondary: var(--color-brand-primary-200);\n`;
    css += `    --color-text-tertiary: var(--color-brand-primary-300);\n`;
    css += `    --color-text-inverse: var(--color-brand-primary-950);\n`;
    css += `    --color-text-disabled: var(--color-brand-primary-600);\n`;
    css += `    --color-text-link: var(--color-brand-primary-400);\n`;
    css += `    --color-text-link-hover: var(--color-brand-primary-300);\n`;
    css += `    \n`;
    css += `    --color-border-primary: var(--color-brand-primary-700);\n`;
    css += `    --color-border-secondary: var(--color-brand-primary-600);\n`;
    css += `    --color-border-interactive: var(--color-brand-primary-500);\n`;
    css += `    --color-border-focus: var(--color-brand-primary-400);\n`;

    return css;
}

// Generate and write the CSS
const generatedCSS = generateThemeCSS();
fs.writeFileSync(
    path.join(__dirname, '../css/themes.css'),
    generatedCSS
);

console.log('✅ Generated balanced theme CSS with proportional color scales');

// Also generate a theme analysis report
const report = {
    timestamp: new Date().toISOString(),
    themes: Object.keys(themeConfigs).length,
    colorSteps: 11,
    features: [
        'Proportional color scaling using non-linear factors',
        'Systematic semantic color mappings',
        'Automatic dark mode support',
        'Consistent accent color system',
        'Mathematical color interpolation'
    ],
    maintainability: [
        'Single source of truth for theme configurations',
        'Automated color scale generation',
        'No hardcoded repetition between themes',
        'Easy to add new themes by defining light/dark endpoints'
    ]
};

fs.writeFileSync(
    path.join(__dirname, '../theme-analysis-report.json'),
    JSON.stringify(report, null, 2)
);

console.log('📊 Generated theme analysis report');