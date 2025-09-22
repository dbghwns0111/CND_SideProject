import './styles/global.css';

function App() {
  console.log(import.meta.env.VITE_API_URL) // "https://api.example.com"
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500">
      <h1 className="text-3xl font-bold text-black mb-4">Vite + React + Tailwind 스타터</h1>
      <p className="text-white">Tailwind가 정상 적용되면 이 화면이 파란 배경에 흰 글씨로 보입니다.</p>
    </div>
  );
}

export default App
