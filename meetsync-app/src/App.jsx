import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import DashboardPage       from './pages/DashboardPage';
import CreateMeetingPage   from './pages/CreateMeetingPage';
import InvitationsPage     from './pages/InvitationsPage';
import RemindersPage       from './pages/RemindersPage';
import ProfilePage         from './pages/ProfilePage';
import MeetingDetailPage   from './pages/MeetingDetailPage';
import CalendarPage        from './pages/CalendarPage';
import PrivateRoute        from './components/PrivateRoute';
import Layout              from './components/Layout';

const Private = ({ children }) => (
  <PrivateRoute>
    <Layout>{children}</Layout>
  </PrivateRoute>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Navigate to="/login" />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/dashboard"       element={<Private><DashboardPage /></Private>} />
        <Route path="/meetings/create" element={<Private><CreateMeetingPage /></Private>} />
        <Route path="/meetings/:id"    element={<Private><MeetingDetailPage /></Private>} />
        <Route path="/invitations"     element={<Private><InvitationsPage /></Private>} />
        <Route path="/reminders"       element={<Private><RemindersPage /></Private>} />
        <Route path="/profile"         element={<Private><ProfilePage /></Private>} />
        <Route path="/calendar"        element={<Private><CalendarPage /></Private>} />
      </Routes>
    </BrowserRouter>
  );
}