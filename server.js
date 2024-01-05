const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/dropbox', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fileSchema = new mongoose.Schema({
  fileName: String,
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

app.post('/upload', upload.array('file'), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded.' });
    }

    const fileObjects = files.map(file => ({
      fileName: file.originalname,
    }));

    const savedFiles = await File.insertMany(fileObjects);

    res.json({ success: true, files: savedFiles });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
