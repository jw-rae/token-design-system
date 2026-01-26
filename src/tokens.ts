import type { TokenCollection } from './types'
import tokenData from '../tokens/tokens.json'

/**
 * Design token utilities - Framework-agnostic token access
 */

// Load tokens from JSON
export const tokens: TokenCollection = tokenData as TokenCollection

/**
 * Get a design token value by path
 * @example getToken('color.brand.primary.500') // returns '#3b82f6'
 */
export function getToken(path: string): string | undefined {
    const keys = path.split('.')
    let current: any = tokens

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key]
        } else {
            return undefined
        }
    }

    return current?.value || current
}

/**
 * Get multiple token values by paths
 * @example getTokens(['color.brand.primary.500', 'space.md']) // returns ['#3b82f6', '1rem']
 */
export function getTokens(paths: string[]): (string | undefined)[] {
    return paths.map(path => getToken(path))
}

/**
 * Convert design tokens to CSS custom properties
 * @example tokenToCSS('color.brand.primary.500') // returns '--color-brand-primary-500'
 */
export function tokenToCSS(path: string): string {
    return `--${path.replace(/\./g, '-')}`
}

/**
 * Get CSS custom property for a token path
 * @example getTokenCSS('color.brand.primary.500') // returns 'var(--color-brand-primary-500)'
 */
export function getTokenCSS(path: string): string {
    return `var(${tokenToCSS(path)})`
}

/**
 * Generate CSS custom properties from tokens
 */
export function generateTokenCSS(): string {
    const cssVars: string[] = []

    function traverse(obj: any, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
            const currentPath = prefix ? `${prefix}-${key}` : key

            if (value && typeof value === 'object') {
                if ('value' in value && 'type' in value) {
                    // This is a token object
                    cssVars.push(`  --${currentPath}: ${value.value};`)
                } else {
                    // This is a nested object, recurse
                    traverse(value, currentPath)
                }
            }
        }
    }

    traverse(tokens)

    return `:root {\n${cssVars.join('\n')}\n}`
}

/**
 * Color utilities
 */
export const colorTokens = {
    // Brand colors
    brand: {
        primary: {
            50: () => getToken('color.brand.primary.50'),
            100: () => getToken('color.brand.primary.100'),
            200: () => getToken('color.brand.primary.200'),
            300: () => getToken('color.brand.primary.300'),
            400: () => getToken('color.brand.primary.400'),
            500: () => getToken('color.brand.primary.500'),
            600: () => getToken('color.brand.primary.600'),
            700: () => getToken('color.brand.primary.700'),
            800: () => getToken('color.brand.primary.800'),
            900: () => getToken('color.brand.primary.900'),
            950: () => getToken('color.brand.primary.950'),
        }
    },

    // Semantic colors
    success: {
        50: () => getToken('color.semantic.success.50'),
        100: () => getToken('color.semantic.success.100'),
        200: () => getToken('color.semantic.success.200'),
        300: () => getToken('color.semantic.success.300'),
        400: () => getToken('color.semantic.success.400'),
        500: () => getToken('color.semantic.success.500'),
        600: () => getToken('color.semantic.success.600'),
        700: () => getToken('color.semantic.success.700'),
        800: () => getToken('color.semantic.success.800'),
        900: () => getToken('color.semantic.success.900'),
    },

    warning: {
        50: () => getToken('color.semantic.warning.50'),
        100: () => getToken('color.semantic.warning.100'),
        200: () => getToken('color.semantic.warning.200'),
        300: () => getToken('color.semantic.warning.300'),
        400: () => getToken('color.semantic.warning.400'),
        500: () => getToken('color.semantic.warning.500'),
        600: () => getToken('color.semantic.warning.600'),
        700: () => getToken('color.semantic.warning.700'),
        800: () => getToken('color.semantic.warning.800'),
        900: () => getToken('color.semantic.warning.900'),
    },

    error: {
        50: () => getToken('color.semantic.error.50'),
        100: () => getToken('color.semantic.error.100'),
        200: () => getToken('color.semantic.error.200'),
        300: () => getToken('color.semantic.error.300'),
        400: () => getToken('color.semantic.error.400'),
        500: () => getToken('color.semantic.error.500'),
        600: () => getToken('color.semantic.error.600'),
        700: () => getToken('color.semantic.error.700'),
        800: () => getToken('color.semantic.error.800'),
        900: () => getToken('color.semantic.error.900'),
    },

    info: {
        50: () => getToken('color.semantic.info.50'),
        100: () => getToken('color.semantic.info.100'),
        200: () => getToken('color.semantic.info.200'),
        300: () => getToken('color.semantic.info.300'),
        400: () => getToken('color.semantic.info.400'),
        500: () => getToken('color.semantic.info.500'),
        600: () => getToken('color.semantic.info.600'),
        700: () => getToken('color.semantic.info.700'),
        800: () => getToken('color.semantic.info.800'),
        900: () => getToken('color.semantic.info.900'),
    }
}

/**
 * Space utilities
 */
export const spaceTokens = {
    xs: () => getToken('space.xs'),
    sm: () => getToken('space.sm'),
    md: () => getToken('space.md'),
    lg: () => getToken('space.lg'),
    xl: () => getToken('space.xl'),
    '2xl': () => getToken('space.2xl'),
    '3xl': () => getToken('space.3xl'),
}

/**
 * Typography utilities
 */
export const typographyTokens = {
    fontFamily: {
        sans: () => getToken('fontFamily.sans'),
        serif: () => getToken('fontFamily.serif'),
        mono: () => getToken('fontFamily.mono'),
    },
    fontSize: {
        xs: () => getToken('fontSize.xs'),
        sm: () => getToken('fontSize.sm'),
        base: () => getToken('fontSize.base'),
        lg: () => getToken('fontSize.lg'),
        xl: () => getToken('fontSize.xl'),
        '2xl': () => getToken('fontSize.2xl'),
        '3xl': () => getToken('fontSize.3xl'),
        '4xl': () => getToken('fontSize.4xl'),
        '5xl': () => getToken('fontSize.5xl'),
        '6xl': () => getToken('fontSize.6xl'),
        '7xl': () => getToken('fontSize.7xl'),
        '8xl': () => getToken('fontSize.8xl'),
        '9xl': () => getToken('fontSize.9xl'),
    },
    fontWeight: {
        thin: () => getToken('fontWeight.thin'),
        extralight: () => getToken('fontWeight.extralight'),
        light: () => getToken('fontWeight.light'),
        normal: () => getToken('fontWeight.normal'),
        medium: () => getToken('fontWeight.medium'),
        semibold: () => getToken('fontWeight.semibold'),
        bold: () => getToken('fontWeight.bold'),
        extrabold: () => getToken('fontWeight.extrabold'),
        black: () => getToken('fontWeight.black'),
    },
    lineHeight: {
        none: () => getToken('lineHeight.none'),
        tight: () => getToken('lineHeight.tight'),
        snug: () => getToken('lineHeight.snug'),
        normal: () => getToken('lineHeight.normal'),
        relaxed: () => getToken('lineHeight.relaxed'),
        loose: () => getToken('lineHeight.loose'),
    }
}

/**
 * Shadow utilities
 */
export const shadowTokens = {
    sm: () => getToken('boxShadow.sm'),
    base: () => getToken('boxShadow.base'),
    md: () => getToken('boxShadow.md'),
    lg: () => getToken('boxShadow.lg'),
    xl: () => getToken('boxShadow.xl'),
    '2xl': () => getToken('boxShadow.2xl'),
    inner: () => getToken('boxShadow.inner'),
    none: () => getToken('boxShadow.none'),
}

/**
 * Border utilities
 */
export const borderTokens = {
    radius: {
        none: () => getToken('borderRadius.none'),
        sm: () => getToken('borderRadius.sm'),
        base: () => getToken('borderRadius.base'),
        md: () => getToken('borderRadius.md'),
        lg: () => getToken('borderRadius.lg'),
        xl: () => getToken('borderRadius.xl'),
        '2xl': () => getToken('borderRadius.2xl'),
        '3xl': () => getToken('borderRadius.3xl'),
        full: () => getToken('borderRadius.full'),
    },
    width: {
        0: () => getToken('borderWidth.0'),
        1: () => getToken('borderWidth.1'),
        2: () => getToken('borderWidth.2'),
        4: () => getToken('borderWidth.4'),
        8: () => getToken('borderWidth.8'),
    }
}

/**
 * Create a CSS-in-JS styles object using design tokens
 */
export function createStyles<T extends Record<string, any>>(
    stylesFn: (tokens: {
        color: typeof colorTokens
        space: typeof spaceTokens
        typography: typeof typographyTokens
        shadow: typeof shadowTokens
        border: typeof borderTokens
        getToken: typeof getToken
        getTokenCSS: typeof getTokenCSS
    }) => T
): T {
    return stylesFn({
        color: colorTokens,
        space: spaceTokens,
        typography: typographyTokens,
        shadow: shadowTokens,
        border: borderTokens,
        getToken,
        getTokenCSS
    })
}

/**
 * Media query helpers using tokens
 */
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
}

export function mediaQuery(breakpoint: keyof typeof breakpoints): string {
    return `@media (min-width: ${breakpoints[breakpoint]})`
}

/**
 * Validation helpers
 */
export function isValidToken(path: string): boolean {
    return getToken(path) !== undefined
}

export function validateTokens(paths: string[]): { valid: string[]; invalid: string[] } {
    const valid: string[] = []
    const invalid: string[] = []

    paths.forEach(path => {
        if (isValidToken(path)) {
            valid.push(path)
        } else {
            invalid.push(path)
        }
    })

    return { valid, invalid }
}