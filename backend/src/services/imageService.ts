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
  const optimized = await sharp(buffer)
    .resize(800, 450, { fit: 'cover', position: 'center' })
    .webp({ quality: 82 })
    .toBuffer();

  const fileName = `${slug}-${Date.now()}.webp`;
  const filePath = `thumbnails/${fileName}`;

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, optimized, {
      contentType: 'image/webp',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
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
  try {
    processed = await sharp(buffer)
      .resize(1200, undefined, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch { /* use original */ }

  const filePath = `uploads/${name.replace(ext, '.webp')}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, processed, { contentType: 'image/webp', upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
