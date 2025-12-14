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
import Grade from "./pages/Grade";
import GradeForm from "./pages/GradeForm";
import ProtectedRoute from "./components/ProtectedRoute";

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
          <Route
            path="/login"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classroom"
            element={
              <ProtectedRoute>
                <VirtualClassroom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <Assignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <Announcements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notebook"
            element={
              <ProtectedRoute>
                <DigitalNotebook />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <Help />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/add"
            element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/edit/:id"
            element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers/add"
            element={
              <ProtectedRoute>
                <TeacherForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers/edit/:id"
            element={
              <ProtectedRoute>
                <TeacherForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subject"
            element={
              <ProtectedRoute>
                <Subject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subject/add"
            element={
              <ProtectedRoute>
                <SubjectForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subject/edit/:id"
            element={
              <ProtectedRoute>
                <SubjectForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grade"
            element={
              <ProtectedRoute>
                <Grade />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grade/add"
            element={
              <ProtectedRoute>
                <GradeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grade/edit/:id"
            element={
              <ProtectedRoute>
                <GradeForm />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
