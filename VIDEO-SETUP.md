# How to Add Your MP4 Video

## ✅ What I've Added:

1. **Video Section** - A dedicated "See Us in Action" section between Hero and Gallery
2. **Video Background Option** - Commented code in the hero section for background video
3. **Custom Play Button** - Styled play overlay that matches your brand

## 📹 How to Add Your Video:

### Option 1: Video in Dedicated Section (Recommended)

1. **Place your video file** in the same folder as `index.html`
   - Name it something like: `borz-detailing-video.mp4`

2. **Update the video source** in `index.html`:
   - Find line with: `<source src="your-video.mp4" type="video/mp4" />`
   - Change to: `<source src="borz-detailing-video.mp4" type="video/mp4" />`

3. **Optional: Add a poster image** (thumbnail shown before play):
   - Find: `poster="https://images.unsplash.com/..."`
   - Replace with your own image URL or local file

### Option 2: Video as Background in Hero Section

1. **Find the hero section** (around line 333-343)

2. **Uncomment the video code**:
   ```html
   <video
     autoplay
     muted
     loop
     playsinline
     class="h-full w-full object-cover opacity-35"
     poster="your-poster.jpg"
   >
     <source src="your-video.mp4" type="video/mp4" />
   </video>
   ```

3. **Comment out or remove the image**:
   ```html
   <!-- <img ... /> -->
   ```

4. **Update the video source** to your file path

## 📁 File Organization:

```
Borz Detailing/
  ├── index.html
  ├── borz-detailing-video.mp4  ← Your video file here
  └── video-poster.jpg          ← Optional thumbnail
```

## 🌐 Hosting Options:

### If hosting on a server:
- Just upload the video file alongside `index.html`
- Use relative path: `src="borz-detailing-video.mp4"`

### If using external hosting:
- Upload to YouTube, Vimeo, or cloud storage
- Use the direct video URL:
  ```html
  <source src="https://your-domain.com/videos/borz-video.mp4" type="video/mp4" />
  ```

### Recommended: Use a CDN or video hosting:
- **Cloudflare Stream** - Free tier available
- **Vimeo** - Embed or direct link
- **AWS S3** - For large files
- **YouTube** - Free, but shows YouTube branding

## ⚙️ Video Settings Explained:

- `controls` - Shows play/pause/volume controls
- `preload="metadata"` - Loads video info but not full video (faster)
- `poster` - Image shown before video plays
- `autoplay` - Auto-plays (only works with `muted`)
- `muted` - Starts muted (required for autoplay)
- `loop` - Repeats video continuously
- `playsinline` - Plays inline on mobile (not fullscreen)

## 🎬 Video Best Practices:

1. **File Size**: Keep under 10MB for fast loading
2. **Format**: MP4 (H.264 codec) is most compatible
3. **Resolution**: 1920x1080 (1080p) is ideal
4. **Duration**: 30-90 seconds for hero background
5. **Compression**: Use HandBrake or similar to optimize

## 🔧 Troubleshooting:

**Video won't play?**
- Check file path is correct
- Ensure video is MP4 format
- Check browser console for errors

**Video too large?**
- Compress using HandBrake (free)
- Or use video hosting service

**Want to hide controls?**
- Remove `controls` attribute
- Use custom play button (already included)

## 📱 Mobile Considerations:

- Videos autoplay on mobile only if muted
- Large files may be slow on mobile data
- Consider separate mobile-optimized video

---

**Current Setup:**
- ✅ Video section added after hero
- ✅ Custom play button overlay
- ✅ Responsive design
- ✅ Fallback poster image
- ⚠️ **You need to add your video file path**

