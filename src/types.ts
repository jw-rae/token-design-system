// Core design token types
export interface DesignToken<T = string> {
    value: T
    type?: string
    description?: string
}

export interface ColorToken extends DesignToken {
    value: string
    type: 'color'
}

export interface SpaceToken extends DesignToken {
    value: string
    type: 'dimension'
}

export interface ShadowToken extends DesignToken {
    value: string
    type: 'shadow'
}

export interface FontFamilyToken extends DesignToken<string[]> {
    value: string[]
    type: 'fontFamily'
}

// Theme system types
export type ThemeName = 'default' | 'warm' | 'cool' | 'pink' | 'green' | 'blue'
export type ColorScheme = 'light' | 'dark' | 'auto'

export interface ThemeConfig {
    name: ThemeName
    colorScheme: ColorScheme
}

export interface TokenCollection {
    color: {
        brand: {
            primary: Record<string, ColorToken>
        }
        neutral: Record<string, ColorToken>
        semantic: {
            success: Record<string, ColorToken>
            warning: Record<string, ColorToken>
            error: Record<string, ColorToken>
            info: Record<string, ColorToken>
        }
    }
    space: Record<string, SpaceToken>
    fontSize: Record<string, SpaceToken>
    fontWeight: Record<string, DesignToken<string>>
    lineHeight: Record<string, DesignToken<string>>
    letterSpacing: Record<string, SpaceToken>
    borderRadius: Record<string, SpaceToken>
    borderWidth: Record<string, SpaceToken>
    boxShadow: Record<string, ShadowToken>
    fontFamily: Record<string, FontFamilyToken>
    opacity: Record<string, DesignToken<string>>
    zIndex: Record<string, DesignToken<string>>
    transition: {
        duration: Record<string, DesignToken<string>>
        timingFunction: Record<string, DesignToken<string>>
    }
}

// Event system for theme changes
export type ThemeChangeEvent = CustomEvent<ThemeConfig>

export interface ThemeEventMap {
    'theme:change': ThemeChangeEvent
    'theme:loaded': CustomEvent<void>
}

// CSS variable names
export const CSS_VARS = {
    // Color variables
    COLOR_TEXT_PRIMARY: '--color-text-primary',
    COLOR_TEXT_SECONDARY: '--color-text-secondary',
    COLOR_TEXT_TERTIARY: '--color-text-tertiary',
    COLOR_BACKGROUND_PRIMARY: '--color-background-primary',
    COLOR_BACKGROUND_SECONDARY: '--color-background-secondary',
    COLOR_BORDER_PRIMARY: '--color-border-primary',
    COLOR_BRAND_PRIMARY: '--color-brand-primary-500',

    // Space variables
    SPACE_XS: '--space-xs',
    SPACE_SM: '--space-sm',
    SPACE_MD: '--space-md',
    SPACE_LG: '--space-lg',
    SPACE_XL: '--space-xl',

    // Typography variables
    FONT_SIZE_BASE: '--font-size-base',
    FONT_FAMILY_SANS: '--font-family-sans',
    LINE_HEIGHT_NORMAL: '--line-height-normal',

    // Other variables
    BORDER_RADIUS_BASE: '--border-radius-base',
    SHADOW_BASE: '--shadow-base',
} as const

// Utility function types
export type CSSCustomPropertyName = typeof CSS_VARS[keyof typeof CSS_VARS]
export type BreakpointName = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface MediaQueryOptions {
    breakpoint?: BreakpointName
    minWidth?: string
    maxWidth?: string
    prefersColorScheme?: 'light' | 'dark'
    prefersReducedMotion?: boolean
}