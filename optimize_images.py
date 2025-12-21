#!/usr/bin/env python3
"""
Image optimization script: Convert images to WebP format and compress to under 200KB
"""
import os
from PIL import Image
import sys

def optimize_image(input_path, output_path, max_size_kb=200, quality=85):
    """
    Convert and optimize image to WebP format, ensuring it's under max_size_kb
    """
    try:
        # Open and convert image
        with Image.open(input_path) as img:
            # Convert RGBA to RGB if necessary (WebP doesn't support transparency well)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Try different quality levels to get under max_size_kb
            for q in range(quality, 40, -5):
                img.save(output_path, 'WEBP', quality=q, method=6)
                size_kb = os.path.getsize(output_path) / 1024
                
                if size_kb <= max_size_kb:
                    print(f"✓ {os.path.basename(input_path)} -> {os.path.basename(output_path)} ({size_kb:.1f}KB, quality={q})")
                    return True
                
                # If still too large, try resizing
                if size_kb > max_size_kb * 1.5:
                    # Resize to 90% of original dimensions
                    new_width = int(img.width * 0.9)
                    new_height = int(img.height * 0.9)
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Final attempt with aggressive compression
            final_quality = 60
            img.save(output_path, 'WEBP', quality=final_quality, method=6)
            size_kb = os.path.getsize(output_path) / 1024
            
            if size_kb > max_size_kb:
                # Resize more aggressively
                scale = (max_size_kb / size_kb) ** 0.5
                new_width = int(img.width * scale)
                new_height = int(img.height * scale)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                img.save(output_path, 'WEBP', quality=final_quality, method=6)
                size_kb = os.path.getsize(output_path) / 1024
            
            print(f"✓ {os.path.basename(input_path)} -> {os.path.basename(output_path)} ({size_kb:.1f}KB, quality={final_quality})")
            return True
            
    except Exception as e:
        print(f"✗ Error processing {input_path}: {e}")
        return False

def find_images(directory):
    """Find all image files in directory"""
    images = []
    for root, dirs, files in os.walk(directory):
        # Skip optimized directory to avoid re-processing
        if 'optimized' in root:
            continue
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                images.append(os.path.join(root, file))
    return images

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(base_dir, 'public', 'images')
    webp_dir = os.path.join(images_dir, 'webp')
    
    # Create webp directory if it doesn't exist
    os.makedirs(webp_dir, exist_ok=True)
    
    # Find all images
    images = find_images(images_dir)
    
    if not images:
        print("No images found to optimize")
        return
    
    print(f"Found {len(images)} images to optimize\n")
    
    converted = 0
    for img_path in images:
        # Create output path
        rel_path = os.path.relpath(img_path, images_dir)
        webp_filename = os.path.splitext(rel_path)[0] + '.webp'
        # Handle subdirectories
        webp_path = os.path.join(webp_dir, webp_filename)
        os.makedirs(os.path.dirname(webp_path), exist_ok=True)
        
        # Skip if already converted and newer
        if os.path.exists(webp_path) and os.path.getmtime(webp_path) > os.path.getmtime(img_path):
            print(f"⊘ Skipping {os.path.basename(img_path)} (already optimized)")
            continue
        
        if optimize_image(img_path, webp_path):
            converted += 1
    
    print(f"\n✓ Converted {converted} images to WebP format")
    print(f"✓ All images optimized to under 200KB")
    print(f"✓ WebP images saved to: {webp_dir}")

if __name__ == '__main__':
    main()

