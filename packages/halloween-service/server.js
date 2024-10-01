const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const cors = require('cors');
app.use(cors());

const staticPath = path.join('ui/dist');
app.use(express.static(staticPath));

const assetsPath = `${staticPath}/assets`;
// @Todo: move out corresponding code to middleware and controller
app.get('/api/animals', (req, res) => {
  const directoryPath = path.join(
    assetsPath,
    'animals'
  );

  fs.readdir(directoryPath, (err, files) => {
    if (err) return res.status(500).send('Unable to scan directory');
    const images = filterImages(files);

    res.json(images);
  });
});

app.get('/api/costumes', (req, res) => {
  const animalName = req.query.name;
  if (!animalName) return res.status(400).send('Animal name is required');

  const animalPath = path.join(assetsPath, 'photo', animalName);

  if (!fs.existsSync(animalPath)) return res.status(404).send('Animal not found');

  fs.readdir(animalPath, {withFileTypes: true}, (err, folders) => {
    if (err) return res.status(500).send('Unable to read costume folders');

    const costumes = [];

    folders.forEach(folder => {
      if (folder.isDirectory()) {
        const costumeFolder = path.join(animalPath, folder.name);
        const files = fs.readdirSync(costumeFolder);
        const imageFiles = filterImages(files);

        if (imageFiles.length > 0) {
          costumes.push({image: `${animalName}/${folder.name}/${imageFiles[0]}`, name: folder.name});
        }
      }
    });

    res.json(costumes);
  });
});

app.get('/api/dress', (req, res) => {
  const { animal, costume } = req.query;
  if (!animal || ! costume) return res.status(400).send('Animal and costume names are required');

  const costumePhotoFolderPath = path.join(assetsPath, 'photo', animal, costume);
  const costumeVideoFolderPath = path.join(assetsPath, 'video', animal, costume);

  const photoExists = fs.existsSync(costumePhotoFolderPath);
  const videoExists = fs.existsSync(costumeVideoFolderPath);

  if (!photoExists && !videoExists) {
    return res.status(404).send('No costume images or videos found for the given animal and costume');
  }

  let photoFiles = [];
  if (photoExists) {
    const files = fs.readdirSync(costumePhotoFolderPath);
    photoFiles = filterImages(files);
  }

  let videoFiles = [];
  if (videoExists) {
    videoFiles = fs.readdirSync(costumeVideoFolderPath).filter(file => file.endsWith('.mp4'));
  }

  const isVideo = Math.random() < 0.7;

  if (isVideo && videoFiles.length > 0) {
    const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];
    res.json({ path: `video/${animal}/${costume}/${randomVideo}` });
  } else if (photoFiles.length > 0) {
    const randomPhoto = photoFiles[Math.floor(Math.random() * photoFiles.length)];
    res.json({ path: `photo/${animal}/${costume}/${randomPhoto}` });
  } else {
    res.status(404).send('No suitable image or video file found');
  }
});

app.get('/api/costumes-audio', (req, res) => {
  const audioDirectory = path.join(assetsPath, 'audio');
  fs.readdir(audioDirectory, (err, files) => {
    if (err) return res.status(500).send('Unable to read audio directory');

    const audioFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav'));
    if (audioFiles.length > 0) {
      res.json({ path: `audio/${audioFiles[0]}` });
    } else {
      res.status(404).send('No audio files found');
    }
  });
});

app.get('/api/dress-audio', (req, res) => {
  const audioDirectory = path.join(assetsPath, 'audio');
  fs.readdir(audioDirectory, (err, files) => {
    if (err) return res.status(500).send('Unable to read audio directory');

    const audioFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav'));

    if (audioFiles.length > 0) {
      const validAudioFiles = audioFiles.slice(1, 3);
      const randomIndex = Math.floor(Math.random() * validAudioFiles.length);
      res.json({ path: `audio/${validAudioFiles[randomIndex]}` });
    } else {
      res.status(404).send('No audio files found');
    }
  });
});

app.get('/api/costume-items', (req, res) => {
  const costumeName = req.query.costume;
  if (!costumeName) return res.status(400).send('Costume name is required');

  const costumeItemsPath = path.join(assetsPath, 'elements', costumeName);

  if (!fs.existsSync(costumeItemsPath)) return res.status(404).send('Costume items folder not found');

  fs.readdir(costumeItemsPath, (err, items) => {
    if (err) return res.status(500).send('Unable to read costume items folder');

    const costumeItems = filterImages(items).map(image => `elements/${costumeName}/${image}`);
    res.json(costumeItems);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function filterImages(files) {
  return files.filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.svg'));
}
