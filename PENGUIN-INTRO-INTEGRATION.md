# Penguin Skiing Intro Animation - Integration Guide

This guide explains how to add the 3D animated penguin skiing intro to your existing `index.html` page.

## Quick Integration Steps

### Step 1: Add Three.js CDN (in `<head>`)
Add this line in your `<head>` section, after your meta tags:

```html
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
```

### Step 2: Add CSS Styles (in `<head>`)
Copy the CSS from `penguin-intro-animation.html` (the `<style>` block) and paste it before your closing `</head>` tag.

### Step 3: Add HTML Overlay (before `</body>`)
Add this HTML structure before your closing `</body>` tag:

```html
<div id="penguin-intro-overlay">
  <button id="skip-intro-btn" aria-label="Skip intro animation">Skip Intro</button>
  <canvas id="penguin-canvas"></canvas>
</div>
```

### Step 4: Add JavaScript (before `</body>`)
Copy the JavaScript code from `penguin-intro-animation.html` (the `<script>` block) and paste it before your closing `</body>` tag, after your existing scripts.

## Features

✅ **3D Animation**: Low-poly penguin skiing across snowy slopes  
✅ **Performance Optimized**: WebGL rendering, limited pixel ratio, efficient particle system  
✅ **Accessibility**: Skip button, respects `prefers-reduced-motion`  
✅ **Mobile Friendly**: Disabled by default on mobile (battery saving)  
✅ **Smooth Transitions**: 6-second animation with 1.5s fade-out  
✅ **Auto Cleanup**: Properly disposes Three.js resources after animation  

## Configuration

You can customize the animation by modifying the `CONFIG` object in the JavaScript:

```javascript
const CONFIG = {
  duration: 6000,        // Animation duration in ms (default: 6 seconds)
  fadeOutDuration: 1500, // Fade out duration in ms
  penguinSpeed: 0.02,    // Penguin movement speed
  snowCount: 200,        // Number of snow particles
  skipMobile: true,      // Skip animation on mobile devices
};
```

## Testing

1. Open your `index.html` in a browser
2. The animation should play automatically on page load
3. Click "Skip Intro" to test the skip functionality
4. The animation should fade out after 6 seconds
5. On mobile devices, the animation should be hidden by default

## Browser Support

- Modern browsers with WebGL support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (animation disabled by default)

## Notes

- The penguin is created programmatically (no external 3D model files needed)
- All Three.js resources are properly cleaned up after the animation
- The overlay uses `z-index: 9999` to ensure it appears above all content
- Animation respects user preferences for reduced motion

