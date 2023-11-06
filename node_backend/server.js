const { Pool } = require('pg');
const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initServer = (app) => {

  // CORS 미들웨어를 전체 앱에 적용
  const corsOptions = {
    origin: 'http://144.24.92.232:3000',
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));
  app.use(fileUpload());

  
  // multer를 사용하여 이미지 저장 설정
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // 'uploads/' 폴더에 파일 저장
    },
    filename: function (req, file, cb) {
      // 파일 이름 설정 (여기서는 원본 파일 이름 사용)
      cb(null, file.originalname);
    }
  });

  const upload = multer({ storage: storage });

  // 이미지 업로드를 위한 라우트
  app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // 'sampleFile'은 클라이언트에서 input의 name 속성값입니다.
    let sampleFile = req.files.sampleFile;
  
    // 파일을 'uploads/' 폴더 안에 저장합니다.
    sampleFile.mv(`${__dirname}/uploads/${sampleFile.name}`, (err) => {
      if (err)
        return res.status(500).send(err);
  
      res.send('File uploaded!');
    });
  });

  app.get('/api', (req, res) => {
    pool.query('SELECT * FROM your_table', (err, dbRes) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(dbRes.rows);
      }
    });
  });

  // '/hello' 경로에 대한 처리 추가
  app.get('/hello', (req, res) => {
    res.status(200).send('Hello, world!');
  });

  // React 앱 빌드 폴더를 정적 파일로 설정
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // 모든 다른 요청을 React 앱으로 라우팅
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
  });
  

};

module.exports = initServer;

