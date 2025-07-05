import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminAvif from 'imagemin-avif';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

interface OptimizedImage {
  original: string;
  webp: string;
  avif?: string;
  optimized: string;
}

class ImageOptimizer {
  private cache: Map<string, OptimizedImage> = new Map();
  private publicDir: string;
  private optimizedDir: string;

  constructor() {
    this.publicDir = path.join(process.cwd(), 'public');
    this.optimizedDir = path.join(this.publicDir, 'optimized');
    this.ensureOptimizedDirectory();
  }

  private ensureOptimizedDirectory() {
    if (!fs.existsSync(this.optimizedDir)) {
      fs.mkdirSync(this.optimizedDir, { recursive: true });
    }
  }

  async optimizeImage(imagePath: string): Promise<OptimizedImage> {
    const fullPath = path.join(this.publicDir, imagePath);
    
    // Check cache first
    if (this.cache.has(imagePath)) {
      return this.cache.get(imagePath)!;
    }

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Image not found: ${imagePath}`);
    }

    const ext = path.extname(imagePath).toLowerCase();
    const basename = path.basename(imagePath, ext);
    const dirname = path.dirname(imagePath);
    
    const outputDir = path.join(this.optimizedDir, dirname);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const result: OptimizedImage = {
      original: imagePath,
      webp: '',
      optimized: ''
    };

    try {
      // Generate WebP version
      const webpOutput = await imagemin([fullPath], {
        destination: outputDir,
        plugins: [
          imageminWebp({
            quality: 85,
            method: 6,
            lossless: false,
            nearLossless: false
          })
        ]
      });

      if (webpOutput.length > 0) {
        const webpPath = path.join(dirname, `${basename}.webp`);
        result.webp = `/optimized/${webpPath}`;
      }

      // Generate AVIF version (if supported)
      try {
        const avifOutput = await imagemin([fullPath], {
          destination: outputDir,
          plugins: [
            imageminAvif({
              quality: 80,
              effort: 4
            })
          ]
        });

        if (avifOutput.length > 0) {
          const avifPath = path.join(dirname, `${basename}.avif`);
          result.avif = `/optimized/${avifPath}`;
        }
      } catch (avifError) {
        console.warn('AVIF compression failed, continuing without AVIF:', avifError);
      }

      // Optimize original format
      let optimizedOutput;
      if (ext === '.jpg' || ext === '.jpeg') {
        optimizedOutput = await imagemin([fullPath], {
          destination: outputDir,
          plugins: [
            imageminMozjpeg({
              quality: 85,
              progressive: true
            })
          ]
        });
      } else if (ext === '.png') {
        optimizedOutput = await imagemin([fullPath], {
          destination: outputDir,
          plugins: [
            imageminOptipng({
              optimizationLevel: 7,
              bitDepthReduction: true,
              colorTypeReduction: true,
              paletteReduction: true
            })
          ]
        });
      }

      if (optimizedOutput && optimizedOutput.length > 0) {
        const optimizedPath = path.join(dirname, `${basename}${ext}`);
        result.optimized = `/optimized/${optimizedPath}`;
      } else {
        result.optimized = imagePath; // Fall back to original if optimization fails
      }

      // Cache the result
      this.cache.set(imagePath, result);
      return result;

    } catch (error) {
      console.error(`Image optimization failed for ${imagePath}:`, error);
      // Return original path as fallback
      result.optimized = imagePath;
      result.webp = imagePath;
      return result;
    }
  }

  async optimizeAllImages() {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    
    const findImages = (dir: string): string[] => {
      const images: string[] = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && item !== 'optimized') {
          images.push(...findImages(fullPath));
        } else if (stat.isFile() && imageExtensions.includes(path.extname(item).toLowerCase())) {
          const relativePath = path.relative(this.publicDir, fullPath);
          images.push(relativePath);
        }
      }
      
      return images;
    };

    const allImages = findImages(this.publicDir);
    console.log(`Found ${allImages.length} images to optimize`);
    
    const results = await Promise.allSettled(
      allImages.map(imagePath => this.optimizeImage(imagePath))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    console.log(`Successfully optimized ${successful}/${allImages.length} images`);
    
    return { total: allImages.length, successful };
  }

  getOptimizedImageInfo(imagePath: string): OptimizedImage | null {
    return this.cache.get(imagePath) || null;
  }

  generateSrcSet(imagePath: string): string {
    const optimized = this.cache.get(imagePath);
    if (!optimized) return '';

    const srcSet: string[] = [];
    
    if (optimized.avif) {
      srcSet.push(`${optimized.avif} (type: image/avif)`);
    }
    
    if (optimized.webp) {
      srcSet.push(`${optimized.webp} (type: image/webp)`);
    }
    
    srcSet.push(`${optimized.optimized} (type: image/${path.extname(optimized.original).slice(1)})`);
    
    return srcSet.join(', ');
  }
}

export const imageOptimizer = new ImageOptimizer();