require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setupBucket() {
  const BUCKET_NAME = 'post-thumbnails';
  
  console.log(`Checking if bucket "${BUCKET_NAME}" exists...`);
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }
  
  const bucketExists = buckets.some(b => b.name === BUCKET_NAME);
  
  if (!bucketExists) {
    console.log(`Creating bucket "${BUCKET_NAME}"...`);
    const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (error) {
      console.error('Failed to create bucket:', error);
    } else {
      console.log('Bucket created successfully!');
    }
  } else {
    console.log(`Bucket "${BUCKET_NAME}" already exists.`);
  }
}

setupBucket();
