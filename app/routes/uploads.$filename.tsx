import { promises as fs } from 'fs';
import path from 'path';
import type { Route } from './+types/uploads.$filename';

export async function loader({ params }: Route.LoaderArgs) {
  const { filename } = params;

  try {
    // Try profile pictures (new location), old profile pictures, and form uploads directories
    const profilesPath = path.join(process.cwd(), 'public', 'uploads', 'profiles', filename);
    const oldProfilePath = path.join(process.cwd(), 'public', 'uploads', filename);
    const formPath = path.join(process.cwd(), 'public', 'uploads', 'forms', filename);

    let filePath: string = '';
    let fileExists = false;

    // Check new profiles directory first
    try {
      await fs.access(profilesPath);
      filePath = profilesPath;
      fileExists = true;
    } catch {
      // Check old profile pictures location (for backward compatibility)
      try {
        await fs.access(oldProfilePath);
        filePath = oldProfilePath;
        fileExists = true;
      } catch {
        // Check form uploads
        try {
          await fs.access(formPath);
          filePath = formPath;
          fileExists = true;
        } catch {
          fileExists = false;
        }
      }
    }

    if (!fileExists) {
      return new Response('File not found', { status: 404 });
    }

    // Read the file
    const fileBuffer = await fs.readFile(filePath);

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';

    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
    }

    return new Response(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new Response('File not found', { status: 404 });
  }
}
