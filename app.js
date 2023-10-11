const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const width = parseInt(req.query.width)
        const height = parseInt(req.query.height)
        const quality = parseInt(req.query.quality)

        const imageBuffer = req.file.buffer;
        let sharpInstance = sharp(imageBuffer)

        if (width && height) {
            sharpInstance = sharpInstance.resize({width, height})
        } else {
            sharpInstance = sharpInstance.resize({ width: 300, height: 300 })
        }
        if (quality) {
            sharpInstance = sharpInstance.jpeg({ quality })
        }

        sharpInstance
            .toBuffer()
            .then((outputBuffer) => {
                res.set('Content-Type', 'image/jpeg');
                res.send(outputBuffer);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: 'Image processing error' });
            });
    } catch (e) {
        console.log({e})
    }
});

app.listen(port, () => {
    console.log(`Server started ${port}`);
});