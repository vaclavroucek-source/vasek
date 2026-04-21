import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage }          from './pages/HomePage';
import { CreateProfilePage } from './pages/CreateProfilePage';
import { TimelinePage }      from './pages/TimelinePage';
import { ComparePage }       from './pages/ComparePage';
import { SharePage }         from './pages/SharePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                           element={<HomePage />} />
        <Route path="/profile/create"             element={<CreateProfilePage />} />
        <Route path="/profile/:profileId/edit"    element={<CreateProfilePage />} />
        <Route path="/timeline/:id"               element={<TimelinePage />} />
        <Route path="/compare"                    element={<ComparePage />} />
        <Route path="/share/:shareId"             element={<SharePage />} />
        <Route path="*"                           element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
