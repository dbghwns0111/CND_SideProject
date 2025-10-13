import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home';
import LoadingPage from '../pages/LoadingPage';
function Router() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/c/:id" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
