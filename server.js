const express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });
const s3 = new AWS.S3();

app.use(cors());

AWS.config.update({
  accessKeyId: 'AKIATXZTYS4KKVIWCPX5',
  secretAccessKey: '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',
  region: 'us-east-2'
});

const PETS_FILE = '/var/www/html/pets.json';

app.use(express.json());
app.use(express.static('public'));


app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const fileContent = fs.readFileSync(req.file.path);
    const s3Params = {
      Bucket: 'raymondprojectbucket',
      Key: `pets/${Date.now()}_${req.file.originalname}`,
      Body: fileContent,
      ContentType: req.file.mimetype
    };

    const s3Upload = await s3.upload(s3Params).promise();
    
    const petData = {
      name: req.body.name,
      age: req.body.age,
      breed: req.body.breed,
      imageUrl: s3Upload.Location
    };

    let pets = [];
    if (fs.existsSync(PETS_FILE)) {
      pets = JSON.parse(fs.readFileSync(PETS_FILE));
    }
    pets.push(petData);
    fs.writeFileSync(PETS_FILE, JSON.stringify(pets, null, 2));

    res.json({ success: true, pet: petData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/pets', (req, res) => {
  if (fs.existsSync(PETS_FILE)) {
    res.sendFile(PETS_FILE);
  } else {
    res.json([]);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));