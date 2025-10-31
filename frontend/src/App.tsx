import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import VirtualClassroom from "./pages/VirtualClassroom";
import Assignments from "./pages/Assignments";
import Announcements from "./pages/Announcements";
import DigitalNotebook from "./pages/DigitalNotebook";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Students from "./pages/Students";
import StudentForm from "./pages/StudentForm";
import Teachers from "./pages/Teachers";
import Subject from "./pages/Subject";
import TeacherForm from "./pages/TeacherForm";
import SubjectForm from "./pages/SubjectForm";
import Course from "./pages/Course";
import CourseForm from "./pages/CourseForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/classroom" element={<VirtualClassroom />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/notebook" element={<DigitalNotebook />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/add" element={<StudentForm />} />
          <Route path="/students/edit/:id" element={<StudentForm />} />
          
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/add" element={<TeacherForm />} />
          <Route path="/teachers/edit/:id" element={<TeacherForm />} />
          <Route path="/subject" element={<Subject />} />
          <Route path="/subject/add" element={<SubjectForm />} />
          <Route path="/subject/edit/:id" element={<SubjectForm />} />
          <Route path="/course" element={<Course />} />
          <Route path="/course/add" element={<CourseForm />} />
          <Route path="/course/edit/:id" element={<CourseForm />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
