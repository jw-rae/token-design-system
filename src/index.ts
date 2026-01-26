// Main exports for the design system
export * from './types'
export * from './theme-manager'
export * from './tokens'

// Re-export for convenience
export { themeManager as default } from './theme-manager'

// Version info
export const VERSION = '1.0.0'

/**
 * Initialize the design system
 * Call this once in your application to set up the theme system
 */
export function initializeDesignSystem(options?: {
    defaultTheme?: string
    defaultColorScheme?: 'light' | 'dark' | 'auto'
}): void {
    const { themeManager } = require('./theme-manager')

    if (options?.defaultTheme && themeManager.isThemeAvailable(options.defaultTheme)) {
        themeManager.setTheme(options.defaultTheme)
    }

    if (options?.defaultColorScheme) {
        themeManager.setColorScheme(options.defaultColorScheme)
    }

    // Dispatch ready event
    if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('theme:loaded'))
    }
}

// Framework-specific exports for tree-shaking
export { createThemeService } from './theme-manager'  // Angular
export { useTheme, useThemeVue } from './theme-manager'  // React/Vue
export { createStyles } from './tokens'  // CSS-in-JS libraries