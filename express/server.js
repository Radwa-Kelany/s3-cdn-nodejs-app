import express from 'express';

import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { uploadFile, getObjectSignedUrl, deleteFile } from './s3.js';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

dotenv.config();
const cdn_url = process.env.CDN_URL;

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  express.json({
    limit: '50mb', // Increase payload limit
  })
);

app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 100000, // Increase number of parameters
  })
);

const prisma = new PrismaClient();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

app.post('/api/posts', upload.single('image'), async (req, res) => {
  const file = req.file;
  const caption = req.body.caption;
  const imageName = generateFileName();

  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 600, width: 400, fit: 'contain' })
    .toBuffer();
  await uploadFile(fileBuffer, imageName, file.mimetype);

  const post = await prisma.posts.create({
    data: {
      imageName,
      caption,
    },
  });

  res.status(201).send(post);
});

app.get('/api/posts', async (req, res) => {
  const posts = await prisma.posts.findMany({ orderBy: [{ created: 'desc' }] });

  for (let post of posts) {
    // post.imageUrl = await getObjectSignedUrl(post.imageName);  //s3 directly
    // post.imageUrl = `${cdn_url}${post.imageName}`; // cloudfront url
    // this is CDN signed url 
    post.imageUrl = await getSignedUrl({
      url: `${cdn_url}${post.imageName}`,
      dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24),
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    });
  }
  res.status(201).send(posts);
});

app.delete('/api/posts/:id', async (req, res) => {
  const imageId = +req.params.id;
  const post = await prisma.posts.findUnique({ where: { id: imageId } });

  await deleteFile(post.imageName);
  await prisma.posts.delete({ where: { id: post.id } });

  res.status(201).send();
});

app.listen(8080, () => console.log('listening on port 8080'));
