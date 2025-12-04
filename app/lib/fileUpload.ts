import sharp from 'sharp';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const PROFILE_PICTURE_WIDTH = 400; // Resize to 400px width
const PROFILE_PICTURE_QUALITY = 85; // JPEG quality

/**
 * Process and save profile picture as base64 string for database storage
 * Returns data URI format: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
 */
export async function saveProfilePicture(file: File): Promise<string> {
  // 1. Validate file type (MIME type)
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
  }

  // 2. Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Maximum size is 5MB.');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 3. Validate it's actually an image (content-based check)
  let metadata;
  try {
    metadata = await sharp(buffer).metadata(); // Throws if not a valid image
  } catch (error) {
    throw new Error('Invalid image file. File may be corrupted.');
  }

  // 4. Process image: resize, optimize, strip EXIF, convert to JPEG
  const processedImage = await sharp(buffer)
    .resize(PROFILE_PICTURE_WIDTH, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
    .jpeg({ quality: PROFILE_PICTURE_QUALITY })
    .toBuffer();

  // 5. Convert to base64 and return as data URI
  const base64 = processedImage.toString('base64');
  const mimeType = 'image/jpeg'; // Always JPEG after processing
  return `data:${mimeType};base64,${base64}`;
}

/**
 * No longer needed - images are stored in database
 * Kept for backward compatibility but does nothing
 */
export async function deleteProfilePicture(_filePath: string): Promise<void> {
  // Images are now stored in database, no file deletion needed
  return;
}
