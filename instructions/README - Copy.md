# Token-Based Design System

A framework-agnostic design system built on design tokens. Provides consistent styling across projects while maintaining flexibility and avoiding vendor lock-in.

## Installation

```bash
npm install @jwrae/design-tokens
```

## Usage

### CSS-only implementation
```css
@import '@jwrae/design-tokens';

/* Or import individually */
@import '@jwrae/design-tokens/foundations';
@import '@jwrae/design-tokens/themes';
@import '@jwrae/design-tokens/utilities';
```

### JavaScript integration
```javascript
import '@jwrae/design-tokens';

// Use theme switching via JavaScript
const html = document.documentElement;
html.setAttribute('data-theme', 'warm');
html.setAttribute('data-color-scheme', 'dark');
```

## Features

- Framework-agnostic architecture
- Consistent design language through tokens
- Multiple theme support with light/dark modes
- CSS custom properties for maintainability
- Tree-shakable imports
- Full TypeScript support
- Zero runtime dependencies

## Architecture

### CSS Files Purpose

**foundations.css** - Core design tokens as CSS custom properties, base element styling, and CSS reset. This file defines all the foundational design decisions.

**themes.css** - Color theme variations. Contains 5 predefined themes (warm, cool, pink, green, blue) with automatic dark mode adaptations.

**utilities.css** - Atomic utility classes for rapid prototyping and common styling patterns. Similar to Tailwind but token-based.

**design-system.css** - Single combined file containing all above styles for convenience.

**index.css** - Import file for modular loading of individual stylesheets.
## Token-Based Architecture

Replace hardcoded values with semantic design tokens:

```css
/* Instead of hardcoded values */
.card {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
}

/* Use semantic tokens */
.card {
  background: var(--color-surface-primary);
  padding: var(--space-md);
  border-radius: var(--border-radius-lg);
}
```

## Framework Integration

### React
```jsx
import '@jwrae/design-tokens';
import { useEffect } from 'react';

function ThemeToggle() {
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  };
  
  return (
    <select onChange={(e) => setTheme(e.target.value)}>
      <option value="default">Default</option>
      <option value="warm">Warm</option>
      <option value="cool">Cool</option>
    </select>
  );
}
```

### Vue 3
```vue
<template>
  <select v-model="currentTheme" @change="updateTheme">
    <option value="warm">Warm</option>
    <option value="cool">Cool</option>
  </select>
</template>

<script setup>
import { ref } from 'vue';
import '@jwrae/design-tokens';

const currentTheme = ref('warm');
const updateTheme = () => {
  document.documentElement.setAttribute('data-theme', currentTheme.value);
};
</script>
```

## Known Limitations

### Browser Support
- Requires CSS custom property support (IE 11+)
- Some advanced features require modern browsers

### Performance Considerations
- CSS custom property inheritance can impact rendering performance at scale
- Theme switching causes style recalculation across entire document
- Large token sets increase CSS bundle size

### Design Constraints
- Utility-first approach may lead to verbose HTML
- Token abstraction can obscure actual values during debugging
- Requires discipline to maintain token consistency across teams

### Framework Limitations
- JavaScript theme management adds complexity for CSS-only projects
- SSR applications need careful theme initialization
- Some CSS-in-JS libraries have limited CSS custom property support

## License

MIT