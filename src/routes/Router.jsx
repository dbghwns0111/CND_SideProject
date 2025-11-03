import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ChatPage from '../pages/ChatPage';
import MainLayout from '../components/MainLayout';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/c/:id" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
