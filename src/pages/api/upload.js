import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

// Disable Next.js body parser (formidable handles it)
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Parse the form data
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    })

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Upload error:', err)
        return res.status(500).json({ error: 'Upload failed' })
      }

      const file = files.image
      if (!file) {
        return res.status(400).json({ error: 'No file provided' })
      }

      // Get the uploaded file
      const uploadedFile = Array.isArray(file) ? file[0] : file
      
      // Generate unique filename
      const timestamp = Date.now()
      const originalName = uploadedFile.originalFilename || 'image.jpg'
      const ext = path.extname(originalName)
      const newFileName = `patient-${timestamp}${ext}`
      const newPath = path.join(uploadsDir, newFileName)

      // Rename the file
      fs.renameSync(uploadedFile.filepath, newPath)

      // Return public URL
      const url = `/uploads/${newFileName}`
      res.status(200).json({ url })
    })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}