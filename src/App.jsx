import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import AudioStories from './pages/AudioStories';
import Quotes from './pages/Quotes';
import AboutWriter from './pages/AboutWriter';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyLibrary from './pages/MyLibrary';
import CreateStory from './pages/CreateStory';
import TermsAndConditions from './pages/TermsAndConditions';
import Help from './pages/Help';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStories from './pages/admin/AdminStories';
import AdminAudioStories from './pages/admin/AdminAudioStories';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminUsers from './pages/admin/AdminUsers';
import AdminComments from './pages/admin/AdminComments';
import AdminApprovals from './pages/admin/AdminApprovals';
import AdminWriterProfile from './pages/admin/AdminWriterProfile';
import AdminSocialLinks from './pages/admin/AdminSocialLinks';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 160px)', paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/audio-stories" element={<AudioStories />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/about" element={<AboutWriter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-library" element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} />
          <Route path="/create-story" element={<ProtectedRoute><CreateStory /></ProtectedRoute>} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/help" element={<Help />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/stories" element={<AdminRoute><AdminStories /></AdminRoute>} />
          <Route path="/admin/audio-stories" element={<AdminRoute><AdminAudioStories /></AdminRoute>} />
          <Route path="/admin/quotes" element={<AdminRoute><AdminQuotes /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/comments" element={<AdminRoute><AdminComments /></AdminRoute>} />
          <Route path="/admin/approvals" element={<AdminRoute><AdminApprovals /></AdminRoute>} />
          <Route path="/admin/writer-profile" element={<AdminRoute><AdminWriterProfile /></AdminRoute>} />
          <Route path="/admin/social-links" element={<AdminRoute><AdminSocialLinks /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
    </div>
  );
}

export default App;
