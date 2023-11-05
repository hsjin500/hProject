const express = require('express');
const initServer = require('./server');

const app = express();
const port = 5000;

// 초기 설정과 미들웨어
app.use(express.json());

// 서버 로직을 초기화
initServer(app);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});

