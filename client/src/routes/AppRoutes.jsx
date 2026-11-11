import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { HOME_BY_ROLE, ROLES } from "../lib/constants";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout";
import ForbiddenPage from "../pages/common/ForbiddenPage";
import NotFoundPage from "../pages/common/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LandingPage from "../pages/public/LandingPage";
import AboutPage from "../pages/public/AboutPage";
import FeaturesPage from "../pages/public/FeaturesPage";
import HelpCenterPage from "../pages/public/HelpCenterPage";
import FAQPage from "../pages/public/FAQPage";
import DocumentationPage from "../pages/public/DocumentationPage";
import PrivacyPolicyPage from "../pages/legal/PrivacyPolicyPage";
import TermsPage from "../pages/legal/TermsPage";
import CookiePolicyPage from "../pages/legal/CookiePolicyPage";
import DataProtectionPage from "../pages/legal/DataProtectionPage";
import AcceptableUsePage from "../pages/legal/AcceptableUsePage";
import SecurityPolicyPage from "../pages/legal/SecurityPolicyPage";
import DataRetentionPage from "../pages/legal/DataRetentionPage";
import DisclaimerPage from "../pages/legal/DisclaimerPage";
import AccountAccessPolicyPage from "../pages/legal/AccountAccessPolicyPage";
import CustomerDashboardPage from "../pages/customer/CustomerDashboardPage";
import MyTicketsPage from "../pages/customer/MyTicketsPage";
import CreateTicketPage from "../pages/customer/CreateTicketPage";
import TicketDetailsPage from "../pages/customer/TicketDetailsPage";
import AgentDashboardPage from "../pages/agent/AgentDashboardPage";
import AssignedTicketsPage from "../pages/agent/AssignedTicketsPage";
import AgentTicketPage from "../pages/agent/AgentTicketPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AllTicketsPage from "../pages/admin/AllTicketsPage";
import AdminTicketPage from "../pages/admin/AdminTicketPage";
import SuperAdminDashboardPage from "../pages/superAdmin/SuperAdminDashboardPage";
import StaffManagementPage from "../pages/superAdmin/StaffManagementPage";
import CreateStaffPage from "../pages/superAdmin/CreateStaffPage";
import CustomerManagementPage from "../pages/superAdmin/CustomerManagementPage";
import WorkspacePlaceholder from "../pages/WorkspacePlaceholder";
import ProtectedRoute from "../components/ProtectedRoute";

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading)
    return <LoadingSpinner fullScreen label="Restoring your session" />;
  if (user) return <Navigate to={HOME_BY_ROLE[user.role] || "/403"} replace />;
  return <LandingPage />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return <LoadingSpinner fullScreen label="Restoring your session" />;
  if (user) return <Navigate to={HOME_BY_ROLE[user.role] || "/403"} replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomeRoute />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/data-protection" element={<DataProtectionPage />} />
        <Route path="/acceptable-use" element={<AcceptableUsePage />} />
        <Route path="/security-policy" element={<SecurityPolicyPage />} />
        <Route path="/data-retention" element={<DataRetentionPage />} />
        <Route path="/disclaimer" element={<DisclaimerPage />} />
        <Route
          path="/account-access-policy"
          element={<AccountAccessPolicyPage />}
        />
      </Route>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.CUSTOMER]} />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/customer/dashboard"
            element={<CustomerDashboardPage />}
          />
          <Route path="/customer/tickets" element={<MyTicketsPage />} />
          <Route
            path="/customer/tickets/create"
            element={<CreateTicketPage />}
          />
          <Route
            path="/customer/tickets/:ticketId"
            element={<TicketDetailsPage />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.AGENT]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
          <Route path="/agent/tickets" element={<AssignedTicketsPage />} />
          <Route
            path="/agent/tickets/:ticketId"
            element={<AgentTicketPage />}
          />
        </Route>
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]} />
        }
      >
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/tickets" element={<AllTicketsPage />} />
          <Route
            path="/admin/tickets/:ticketId"
            element={<AdminTicketPage />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/staff" element={<StaffManagementPage />} />
          <Route
            path="/super-admin/dashboard"
            element={<SuperAdminDashboardPage />}
          />
          <Route path="/super-admin/staff" element={<StaffManagementPage />} />
          <Route
            path="/super-admin/staff/create"
            element={<CreateStaffPage />}
          />
          <Route
            path="/super-admin/customers"
            element={<CustomerManagementPage />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/profile"
            element={
              <WorkspacePlaceholder
                title="Profile"
                description="Your account details."
              />
            }
          />
        </Route>
      </Route>

      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
