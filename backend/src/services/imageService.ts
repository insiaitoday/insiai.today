// Service: Image download, optimize, and upload to Supabase Storage
import axios from 'axios';
import sharp from 'sharp';
import { supabase } from '../lib/supabase';
import path from 'path';

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'post-thumbnails';

/**
 * Download an external image, optimize to WebP, and upload to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function downloadAndUploadThumbnail(imageUrl: string, slug: string): Promise<string> {
  // Download image
  const response = await axios.get(imageUrl, {
    responseType: 'arraybuffer',
    timeout: 10000,
    headers: { 'User-Agent': 'LeviAIToday/1.0' },
  });

  const buffer = Buffer.from(response.data);

  // Optimize: resize to 800x450 WebP
  let optimized = buffer;
  try {
    optimized = await sharp(buffer)
      .resize(800, 450, { fit: 'cover', position: 'center' })
      .webp({ quality: 82 })
      .toBuffer();
  } catch (err) {
    console.warn('Sharp download-and-upload optimization failed, uploading raw file:', err);
  }

  const fileName = `${slug}-${Date.now()}.webp`;
  const filePath = `thumbnails/${fileName}`;

  let activeBucket = BUCKET;
  let { error } = await supabase.storage
    .from(activeBucket)
    .upload(filePath, optimized, {
      contentType: 'image/webp',
      upsert: false,
    });

  if (error) {
    console.error(`Failed uploading to primary bucket ${activeBucket}:`, error);
    const altBucket = BUCKET === 'post-thumbnail' ? 'post-thumbnails' : 'post-thumbnail';
    console.log(`Retrying upload with alternative bucket ${altBucket}...`);
    const { error: altError } = await supabase.storage
      .from(altBucket)
      .upload(filePath, optimized, {
        contentType: 'image/webp',
        upsert: false,
      });
    if (altError) throw error; // Throw original error if fallback also fails
    activeBucket = altBucket;
  }

  // Get public URL
  const { data } = supabase.storage.from(activeBucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Upload a raw image buffer (from multer) to Supabase Storage.
 */
export async function uploadImage(buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
  const ext  = path.extname(originalName) || '.jpg';
  const name = `upload-${Date.now()}${ext}`;

  // Optimize if it's an image
  let processed = buffer;
  let contentType = 'image/webp';
  let finalExt = '.webp';
  try {
    processed = await sharp(buffer)
      .resize(1200, undefined, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch (err) {
    console.warn('Sharp image optimization failed, uploading raw file:', err);
    contentType = mimeType;
    finalExt = ext;
  }

  const filePath = `uploads/${name.replace(ext, finalExt)}`;

  let activeBucket = BUCKET;
  let { error } = await supabase.storage
    .from(activeBucket)
    .upload(filePath, processed, { contentType, upsert: false });

  if (error) {
    console.error(`Failed uploading image to primary bucket ${activeBucket}:`, error);
    const altBucket = BUCKET === 'post-thumbnail' ? 'post-thumbnails' : 'post-thumbnail';
    console.log(`Retrying upload with alternative bucket ${altBucket}...`);
    const { error: altError } = await supabase.storage
      .from(altBucket)
      .upload(filePath, processed, { contentType, upsert: false });
    if (altError) throw error;
    activeBucket = altBucket;
  }

  const { data } = supabase.storage.from(activeBucket).getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Optimize a raw file buffer to 1200x630 WebP and upload to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadThumbnail(
  buffer: Buffer,
  postId: string,
  originalName: string = 'thumbnail.jpg',
  mimeType: string = 'image/jpeg'
): Promise<string> {
  let processed = buffer;
  let contentType = 'image/webp';
  let ext = '.webp';

  try {
    processed = await sharp(buffer)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 85 })
      .toBuffer();
  } catch (err) {
    console.warn('Sharp thumbnail optimization failed, uploading raw file:', err);
    contentType = mimeType;
    ext = path.extname(originalName) || '.jpg';
  }

  const fileName = `${postId}-${Date.now()}${ext}`;
  const filePath = `thumbnails/${fileName}`;

  let activeBucket = BUCKET;
  let { error } = await supabase.storage
    .from(activeBucket)
    .upload(filePath, processed, {
      contentType: contentType,
      upsert: false,
    });

  if (error) {
    console.error(`Failed uploading thumbnail to primary bucket ${activeBucket}:`, error);
    const altBucket = BUCKET === 'post-thumbnail' ? 'post-thumbnails' : 'post-thumbnail';
    console.log(`Retrying upload with alternative bucket ${altBucket}...`);
    const { error: altError } = await supabase.storage
      .from(altBucket)
      .upload(filePath, processed, {
        contentType: contentType,
        upsert: false,
      });
    if (altError) throw error;
    activeBucket = altBucket;
  }

  const { data } = supabase.storage.from(activeBucket).getPublicUrl(filePath);
  return data.publicUrl;
}
