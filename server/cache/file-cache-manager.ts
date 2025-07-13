import fs from 'fs/promises';
import path from 'path';

interface CacheData {
  data: any;
  timestamp: number;
  expiry: number;
}

export class FileCacheManager {
  private cacheDir: string;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private readonly OLD_CACHE_DURATION = 20 * 60 * 1000; // 20 minutes

  constructor() {
    this.cacheDir = path.join(process.cwd(), 'cache-storage');
    this.ensureCacheDir();
  }

  private async ensureCacheDir(): Promise<void> {
    try {
      await fs.access(this.cacheDir);
    } catch {
      await fs.mkdir(this.cacheDir, { recursive: true });
      console.log('📁 Cache directory created:', this.cacheDir);
    }
  }

  private getCacheFilePath(key: string): string {
    return path.join(this.cacheDir, `${key}.json`);
  }

  async set(key: string, data: any): Promise<void> {
    try {
      const now = Date.now();
      const cacheData: CacheData = {
        data,
        timestamp: now,
        expiry: now + this.CACHE_DURATION
      };

      const filePath = this.getCacheFilePath(key);
      await fs.writeFile(filePath, JSON.stringify(cacheData, null, 2));
      console.log(`💾 Cache saved to file: ${key} (expires in ${this.CACHE_DURATION / 1000}s)`);
    } catch (error) {
      console.error('❌ Failed to save cache to file:', error);
    }
  }

  async get(key: string): Promise<{ data: any; age: number; expired: boolean } | null> {
    try {
      const filePath = this.getCacheFilePath(key);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const cacheData: CacheData = JSON.parse(fileContent);
      
      const now = Date.now();
      const age = now - cacheData.timestamp;
      const expired = now > cacheData.expiry;

      console.log(`📖 Cache read from file: ${key} (age: ${Math.round(age / 1000)}s, expired: ${expired})`);
      
      return {
        data: cacheData.data,
        age,
        expired
      };
    } catch (error) {
      console.log(`📭 No cache file found for: ${key}`);
      return null;
    }
  }

  async getOldCache(key: string): Promise<any | null> {
    try {
      const filePath = this.getCacheFilePath(key);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const cacheData: CacheData = JSON.parse(fileContent);
      
      const now = Date.now();
      const age = now - cacheData.timestamp;
      
      // Return old cache if it's within 20 minutes
      if (age <= this.OLD_CACHE_DURATION) {
        console.log(`🗄️ Using old cache: ${key} (age: ${Math.round(age / 1000)}s)`);
        return cacheData.data;
      } else {
        console.log(`🗑️ Old cache too old: ${key} (age: ${Math.round(age / 1000)}s > ${this.OLD_CACHE_DURATION / 1000}s)`);
        return null;
      }
    } catch (error) {
      console.log(`📭 No old cache available for: ${key}`);
      return null;
    }
  }

  async clearExpiredCache(): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir);
      const now = Date.now();
      let clearedCount = 0;

      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const filePath = path.join(this.cacheDir, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const cacheData: CacheData = JSON.parse(fileContent);
            
            const age = now - cacheData.timestamp;
            if (age > this.OLD_CACHE_DURATION) {
              await fs.unlink(filePath);
              clearedCount++;
              console.log(`🗑️ Cleared expired cache: ${file}`);
            }
          } catch (error) {
            console.error(`❌ Error processing cache file ${file}:`, error);
          }
        }
      }

      if (clearedCount > 0) {
        console.log(`🧹 Cleared ${clearedCount} expired cache files`);
      }
    } catch (error) {
      console.error('❌ Failed to clear expired cache:', error);
    }
  }

  async getAllCacheKeys(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.cacheDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      console.error('❌ Failed to get cache keys:', error);
      return [];
    }
  }
}

export const fileCacheManager = new FileCacheManager();