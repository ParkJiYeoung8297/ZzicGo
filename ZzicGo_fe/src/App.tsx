import { useState, useEffect } from 'react';
import apiClient from './api/axios';
import './App.css'

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    apiClient
    .get<string>('api/z1/test')
    .then((res) => {
      console.log('✅ 서버 응답:', res.data);
      setMessage(res.data);

    })
    .catch((err) => {
      console.error('❌요청 실패:',err)
    });
  }, []);



  return (
    <div>
      <h1>React + Spring 연결 테스트</h1>
      <p>서버 응답: {message}</p>
    </div>
  );
}

export default App
