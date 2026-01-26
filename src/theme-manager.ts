import type {
    ThemeName,
    ColorScheme,
    ThemeConfig,
    ThemeChangeEvent,
    CSSCustomPropertyName
} from './types'

/**
 * Theme Manager - Framework-agnostic theme switching
 * Works with vanilla JS, React, Vue, Angular, Svelte, etc.
 */
export class ThemeManager {
    private currentTheme: ThemeName = 'default'
    private currentColorScheme: ColorScheme = 'auto'
    private mediaQuery: MediaQuery | null = null
    private listeners: Set<(config: ThemeConfig) => void> = new Set()

    constructor() {
        this.initializeTheme()
        this.setupColorSchemeListener()
    }

    /**
     * Set the active theme
     */
    setTheme(theme: ThemeName): void {
        if (this.currentTheme === theme) return

        this.currentTheme = theme
        this.applyTheme()
        this.notifyListeners()
    }

    /**
     * Set the color scheme (light/dark/auto)
     */
    setColorScheme(scheme: ColorScheme): void {
        if (this.currentColorScheme === scheme) return

        this.currentColorScheme = scheme
        this.applyColorScheme()
        this.notifyListeners()
    }

    /**
     * Get current theme configuration
     */
    getTheme(): ThemeConfig {
        return {
            name: this.currentTheme,
            colorScheme: this.currentColorScheme
        }
    }

    /**
     * Get the resolved color scheme (handles 'auto')
     */
    getResolvedColorScheme(): 'light' | 'dark' {
        if (this.currentColorScheme === 'auto') {
            return this.mediaQuery?.matches ? 'dark' : 'light'
        }
        return this.currentColorScheme
    }

    /**
     * Subscribe to theme changes
     */
    subscribe(callback: (config: ThemeConfig) => void): () => void {
        this.listeners.add(callback)
        return () => {
            this.listeners.delete(callback)
        }
    }

    /**
     * Get available themes
     */
    getAvailableThemes(): ThemeName[] {
        return ['default', 'warm', 'cool', 'pink', 'green', 'blue']
    }

    /**
     * Check if a theme is available
     */
    isThemeAvailable(theme: string): theme is ThemeName {
        return this.getAvailableThemes().includes(theme as ThemeName)
    }

    /**
     * Initialize theme from localStorage or system preferences
     */
    private initializeTheme(): void {
        // Try to restore from localStorage
        const savedTheme = this.getStoredTheme()
        const savedColorScheme = this.getStoredColorScheme()

        if (savedTheme && this.isThemeAvailable(savedTheme)) {
            this.currentTheme = savedTheme
        }

        if (savedColorScheme) {
            this.currentColorScheme = savedColorScheme
        }

        this.applyTheme()
        this.applyColorScheme()
    }

    /**
     * Apply the current theme to the document
     */
    private applyTheme(): void {
        const root = document.documentElement

        // Remove all theme classes
        this.getAvailableThemes().forEach(theme => {
            root.removeAttribute(`data-theme`)
        })

        // Apply current theme
        if (this.currentTheme !== 'default') {
            root.setAttribute('data-theme', this.currentTheme)
        }

        // Store in localStorage
        this.storeTheme(this.currentTheme)

        // Dispatch custom event
        this.dispatchThemeChangeEvent()
    }

    /**
     * Apply the current color scheme
     */
    private applyColorScheme(): void {
        const root = document.documentElement

        if (this.currentColorScheme === 'auto') {
            root.removeAttribute('data-color-scheme')
        } else {
            root.setAttribute('data-color-scheme', this.currentColorScheme)
        }

        // Store in localStorage
        this.storeColorScheme(this.currentColorScheme)

        // Update CSS class for compatibility
        root.classList.toggle('dark', this.getResolvedColorScheme() === 'dark')
    }

    /**
     * Setup listener for system color scheme changes
     */
    private setupColorSchemeListener(): void {
        if (typeof window === 'undefined') return

        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = () => {
            if (this.currentColorScheme === 'auto') {
                this.applyColorScheme()
                this.notifyListeners()
            }
        }

        // Modern browsers
        if (this.mediaQuery.addEventListener) {
            this.mediaQuery.addEventListener('change', handleChange)
        } else {
            // Legacy support
            this.mediaQuery.addListener(handleChange)
        }
    }

    /**
     * Notify all subscribers of theme change
     */
    private notifyListeners(): void {
        const config = this.getTheme()
        this.listeners.forEach(callback => callback(config))
    }

    /**
     * Dispatch theme change event
     */
    private dispatchThemeChangeEvent(): void {
        const event = new CustomEvent('theme:change', {
            detail: this.getTheme()
        }) as ThemeChangeEvent

        document.dispatchEvent(event)
    }

    /**
     * Storage helpers
     */
    private getStoredTheme(): ThemeName | null {
        try {
            return localStorage.getItem('theme') as ThemeName
        } catch {
            return null
        }
    }

    private storeTheme(theme: ThemeName): void {
        try {
            localStorage.setItem('theme', theme)
        } catch {
            // localStorage not available
        }
    }

    private getStoredColorScheme(): ColorScheme | null {
        try {
            return localStorage.getItem('colorScheme') as ColorScheme
        } catch {
            return null
        }
    }

    private storeColorScheme(scheme: ColorScheme): void {
        try {
            localStorage.setItem('colorScheme', scheme)
        } catch {
            // localStorage not available
        }
    }
}

// Create singleton instance
export const themeManager = new ThemeManager()

// Convenience functions
export function setTheme(theme: ThemeName): void {
    themeManager.setTheme(theme)
}

export function setColorScheme(scheme: ColorScheme): void {
    themeManager.setColorScheme(scheme)
}

export function getTheme(): ThemeConfig {
    return themeManager.getTheme()
}

export function subscribeToThemeChanges(callback: (config: ThemeConfig) => void): () => void {
    return themeManager.subscribe(callback)
}

/**
 * Get CSS custom property value
 */
export function getCSSCustomProperty(property: CSSCustomPropertyName): string {
    if (typeof window === 'undefined') return ''

    return getComputedStyle(document.documentElement)
        .getPropertyValue(property)
        .trim()
}

/**
 * Set CSS custom property value
 */
export function setCSSCustomProperty(property: CSSCustomPropertyName, value: string): void {
    if (typeof window === 'undefined') return

    document.documentElement.style.setProperty(property, value)
}

/**
 * Remove CSS custom property
 */
export function removeCSSCustomProperty(property: CSSCustomPropertyName): void {
    if (typeof window === 'undefined') return

    document.documentElement.style.removeProperty(property)
}

/**
 * Framework-specific helpers
 */

// React hook (if React is available)
export function useTheme() {
    if (typeof window === 'undefined') {
        return {
            theme: themeManager.getTheme(),
            setTheme,
            setColorScheme,
            availableThemes: themeManager.getAvailableThemes()
        }
    }

    // This would typically use React.useState and React.useEffect
    // but we keep it framework-agnostic
    const theme = themeManager.getTheme()

    return {
        theme,
        setTheme,
        setColorScheme,
        availableThemes: themeManager.getAvailableThemes()
    }
}

// Vue composition function (if Vue is available)
export function useThemeVue() {
    // This would typically use Vue's reactivity system
    // but we keep it framework-agnostic
    return useTheme()
}

// Angular service helper
export function createThemeService() {
    return {
        themeManager,
        setTheme,
        setColorScheme,
        getTheme,
        subscribe: subscribeToThemeChanges
    }
}