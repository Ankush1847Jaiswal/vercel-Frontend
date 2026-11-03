import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import StudyMaterials from './pages/StudyMaterials';
import CurrentAffairs from './pages/CurrentAffairs';
import MockTests from './pages/MockTests';
import Syllabus from './pages/Syllabus';
import Notes from './pages/Notes';
import PhotosGallery from './pages/notes/PhotosGallery';
import Letters from './pages/notes/Letters';
import LetterDetail from './pages/notes/LetterDetail';
import SpecialMoments from './pages/notes/SpecialMoments';
import Diary from './pages/notes/Diary';
import DiaryEntry from './pages/notes/DiaryEntry';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '10px', fontFamily: 'Inter, sans-serif' },
        }}
      />
      <Routes>
        {/* Admin routes - no main nav */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Main site routes */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/study-materials" element={<StudyMaterials />} />
                  <Route path="/current-affairs" element={<CurrentAffairs />} />
                  <Route path="/mock-tests" element={<MockTests />} />
                  <Route path="/syllabus" element={<Syllabus />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/notes/photos" element={<PhotosGallery />} />
                  <Route path="/notes/letters" element={<Letters />} />
                  <Route path="/notes/letters/:id" element={<LetterDetail />} />
                  <Route path="/notes/moments" element={<SpecialMoments />} />
                  <Route path="/notes/diary" element={<Diary />} />
                  <Route path="/notes/diary/:id" element={<DiaryEntry />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
