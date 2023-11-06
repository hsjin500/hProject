import React, { useState } from 'react';
import './App.css';

function App() {
  // 이미지 상태를 저장하기 위한 state
  const [image, setImage] = useState(null);
  // 미리보기 URL을 저장하기 위한 state
  const [previewUrl, setPreviewUrl] = useState('');

  // 사용자가 이미지를 선택했을 때 호출될 함수
  const handleImageChange = (e) => {
    // 파일을 선택했다면
    if (e.target.files && e.target.files[0]) {
      // 이미지 상태를 업데이트
      setImage(e.target.files[0]);

      // 이미지를 미리 볼 수 있는 URL 생성
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // 이미지 업로드 버튼 클릭 처리
  const handleUpload = async () => {
    // FormData 인스턴스 생성
    const formData = new FormData();
    // 'image' 키에 파일 데이터 추가
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert('이미지가 성공적으로 업로드 되었습니다!');
      } else {
        alert('업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('업로드 중 에러 발생:', error);
      alert('업로드 중 에러가 발생했습니다.');
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        {/* 숨겨진 파일 인풋 */}
        <input type="file" id="fileInput" onChange={handleImageChange} style={{ display: 'none' }} />
        {/* 사용자 정의 업로드 버튼 */}
        <label htmlFor="fileInput" className="App-upload-btn">
          이미지 선택하기
        </label>
        <button className="App-button" onClick={handleUpload}>이미지 업로드</button>
        
        {/* 이미지 미리보기 */}
        {previewUrl && <img src={previewUrl} alt="Preview" className="preview-img" />}
      </header>
    </div>
  );
}

export default App;
