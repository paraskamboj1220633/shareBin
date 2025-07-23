// ===== server.js =====

const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/pastebin', {
mongoose.connect('mongodb+srv://paras:ebarRSrXstptuiMA@cluster.qu4yv9d.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose schema
const pasteSchema = new mongoose.Schema({
  pasteId: { type: String, required: true, unique: true },
  content: String,
  contentType: { type: String, default: 'text/plain' },
  fileUrl: String,
  createdAt: { type: Date, default: Date.now },
});
const Paste = mongoose.model('Paste', pasteSchema);

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${nanoid(6)}-${file.originalname}`),
});
const upload = multer({ storage });

// POST /api/paste - text or file
app.post('/api/paste', upload.single('file'), async (req, res) => {
  const pasteId = nanoid(2);
  const { content, contentType } = req.body;
  let fileUrl = null;
  let mime = null;

  if (req.file) {
    fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    mime = req.file.mimetype;
  }

  const paste = new Paste({
    pasteId,
    content: content || null,
    contentType: contentType || 'text/plain',
    fileUrl,
  });

  await paste.save();
  res.json({ pasteId });
});

// GET /api/paste/:id
app.get('/api/paste/:id', async (req, res) => {
  const paste = await Paste.findOne({ pasteId: req.params.id });
  if (!paste) return res.status(404).json({ error: 'Paste not found' });
  res.json(paste);
});

app.get('/', async (req, res) => {
  res.send("pasteBin API Working")
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
