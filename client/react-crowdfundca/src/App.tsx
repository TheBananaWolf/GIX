import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProjectDetail from './components/ProjectDetail';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import ForgotPassword from './components/ForgotPassword';
import ProfilePage from './components/ProfilePage';      // 导入新的ProfilePage组件
import ProfilePageAdmin from './components/ProfilePageAdmin';
import ProjectEdit from './components/ProjectEdit';
import ProjectList from './components/ProjectList';
import ProjectSearchList from './components/ProjectSearchList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project-list" element={<ProjectList />} />
      <Route path="/project-search-list" element={<ProjectSearchList />} />
      <Route path="/project-detail" element={<ProjectDetail />} />
      <Route path="/project-edit" element={<ProjectEdit />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin-profile" element={<ProfilePageAdmin />} /> {/* 添加新路由 */}
    </Routes>
  );
}

export default App;
