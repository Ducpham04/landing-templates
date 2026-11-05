import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ApiError } from "./api/client";
import { Layout, RequireAdmin } from "./components/Layout";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { LeadDetailPage } from "./features/leads/LeadDetailPage";
import { LeadsPage } from "./features/leads/LeadsPage";
import { SitesPage } from "./features/sites/SitesPage";
import { UsersPage } from "./features/users/UsersPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, err) => !(err instanceof ApiError && err.status >= 400 && err.status < 500) && count < 2,
      refetchOnWindowFocus: true,
    },
  },
});

function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-lg font-semibold">Không tìm thấy trang</p>
      <Link to="/" className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4">Về Tổng quan</Link>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="leads/:id" element={<LeadDetailPage />} />
                <Route path="sites" element={<RequireAdmin><SitesPage /></RequireAdmin>} />
                <Route path="users" element={<RequireAdmin><UsersPage /></RequireAdmin>} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}
