const { Pool } = require('pg');
const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const moment = require('moment');
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

  
  // 파일 저장을 위한 설정
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // 저장할 경로
    },
    filename: function (req, file, cb) {
      // 파일명 설정 - 'sampleFile-20231106-153052.png'와 같은 형태
      cb(null, file.fieldname + '-' + moment().format('YYYYMMDD-HHmmss') + path.extname(file.originalname));
    }
  });

  // multer 인스턴스 생성
  const upload = multer({ storage: storage });

  // 이미지 업로드를 위한 라우트
  app.post('/upload', upload.single('sampleFile'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // 업로드된 파일의 정보는 req.file에 있음
    res.send('File uploaded: ' + req.file.filename);
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

