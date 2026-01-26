/**
 * Build script to process and validate design tokens
 */
const fs = require('fs')
const path = require('path')

const tokensPath = path.join(__dirname, '../tokens/tokens.json')
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'))

// Validate token structure
function validateTokens(obj, path = '') {
    const errors = []

    for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key

        if (value && typeof value === 'object') {
            if ('value' in value && 'type' in value) {
                // This is a token - validate it
                if (!value.value) {
                    errors.push(`Missing value for token: ${currentPath}`)
                }
                if (!value.type) {
                    errors.push(`Missing type for token: ${currentPath}`)
                }
            } else {
                // This is a nested object - recurse
                const nestedErrors = validateTokens(value, currentPath)
                errors.push(...nestedErrors)
            }
        }
    }

    return errors
}

console.log('🔍 Validating design tokens...')
const errors = validateTokens(tokens)

if (errors.length > 0) {
    console.error('❌ Token validation failed:')
    errors.forEach(error => console.error(`  - ${error}`))
    process.exit(1)
}

console.log('✅ All tokens are valid!')

// Generate flattened token map for easier access
function flattenTokens(obj, prefix = '', result = {}) {
    for (const [key, value] of Object.entries(obj)) {
        const currentPath = prefix ? `${prefix}.${key}` : key

        if (value && typeof value === 'object') {
            if ('value' in value && 'type' in value) {
                // This is a token
                result[currentPath] = value.value
            } else {
                // This is a nested object
                flattenTokens(value, currentPath, result)
            }
        }
    }

    return result
}

const flatTokens = flattenTokens(tokens)

// Write flattened tokens for easier JS access
const outputPath = path.join(__dirname, '../tokens/tokens-flat.json')
fs.writeFileSync(outputPath, JSON.stringify(flatTokens, null, 2))

console.log(`📝 Generated flat token map: ${flatTokens.length} tokens`)
console.log('🎉 Token build complete!')