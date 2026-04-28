import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    // Filter out non-File entries (empty strings, etc.)
    const validFiles = files.filter(
      (f): f is File => f instanceof File && f.size > 0
    );

    if (validFiles.length === 0) {
      return NextResponse.json(
        { error: 'No valid files uploaded. Please select image files.' },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    for (const file of validFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Convert buffer to base64 string
      const base64Data = buffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      const fileUri = `data:${mimeType};base64,${base64Data}`;

      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(fileUri, {
        folder: 'primelooks_products',
        resource_type: 'auto',
      });

      urls.push(uploadResponse.secure_url);
    }

    return NextResponse.json({ urls });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Upload error:', message);
    return NextResponse.json(
      { error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
