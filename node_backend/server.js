const { Pool } = require('pg');
const express = require('express');
const path = require('path');
const app = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initServer = (app) => {

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

