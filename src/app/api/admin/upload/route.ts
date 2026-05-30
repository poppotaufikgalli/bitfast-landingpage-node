import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import { join, parse } from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return Response.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Your upload logic here (e.g., S3, Cloudinary, local disk)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const now = new Date();
        const timestamp = now.toISOString()
            .replace(/[-T:]/g, '')     // Remove dashes, T, and colons
            .split('.')[0];            // Remove milliseconds

        // 2. Break down the original filename to inject the timestamp safely
        const fileDetails = parse(file.name);
        // fileDetails.name = "document"
        // fileDetails.ext = ".pdf"

        // Clean the original name to remove spaces or unsafe characters
        const cleanBaseName = fileDetails.name.replace(/[^a-zA-Z0-9-_]/g, '_');

        // Combine: "document-20261025143022.pdf"
        const newFileName = `${cleanBaseName}-${timestamp}${fileDetails.ext}`;

        // Define the destination path (e.g., public/uploads folder)
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        const filePath = join(uploadDir, newFileName);

        // Save the file to disk
        await writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            name: newFileName,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
