import { GitBranch, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import FooterColumn from "./FooterColumn";
import FooterLink from "./FooterLink";
import FooterNewsletter from "./FooterNewsletter";
import FooterBottomBar from "./FooterBottomBar";

/**
 * Footer - Main site footer for the HelpDesk application.
 *
 * Features:
 *  - 5-column navigation grid (responsive: 1 col mobile → 2-3 tablet → 5 desktop)
 *  - Role-aware "Submit Support Request" link (auth users → /customer/tickets/create)
 *  - Security feature list with Shield icons
 *  - FooterNewsletter + security section in a mid row
 *  - FooterBottomBar with copyright and legal links
 */
export default function Footer() {
  const { user } = useAuth();

  const submitRequestPath = user ? "/customer/tickets/create" : "/login";

  const securityFeatures = [
    "Secure Authentication",
    "Role-Based Access Control",
    "Password Hashing with Argon2",
    "Protected API Endpoints",
    "JWT Session Management",
    "Controlled Ticket Access",
  ];

  return (
    <footer
      className="w-full text-white"
      style={{ backgroundColor: "#0f1f1e" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* ── 5-column navigation grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Column 1 – PRODUCT */}
          <FooterColumn title="Product">
            <FooterLink to="/">Overview</FooterLink>
            <FooterLink to="/features">Features</FooterLink>
            <FooterLink to="/features">Ticket Management</FooterLink>
            <FooterLink to="/features">Assignment</FooterLink>
            <FooterLink to="/features">Priority & Status</FooterLink>
            <FooterLink to="/features">Real-Time Notifications</FooterLink>
            <FooterLink to="/customer/dashboard">Customer Portal</FooterLink>
            <FooterLink to="/agent/dashboard">Agent Workspace</FooterLink>
            <FooterLink to="/admin/dashboard">Admin Dashboard</FooterLink>
            <FooterLink to="/super-admin/dashboard">Super Admin</FooterLink>
          </FooterColumn>

          {/* Column 2 – SOLUTIONS */}
          <FooterColumn title="Solutions">
            <FooterLink to="/features">Customer Support Mgmt</FooterLink>
            <FooterLink to="/features">IT Help Desk</FooterLink>
            <FooterLink to="/features">Ticket Tracking</FooterLink>
            <FooterLink to="/features">Team Collaboration</FooterLink>
            <FooterLink to="/features">Support Team Mgmt</FooterLink>
            <FooterLink to="/features">Issue Management</FooterLink>
            <FooterLink to="/features">Service Request Mgmt</FooterLink>
          </FooterColumn>

          {/* Column 3 – RESOURCES */}
          <FooterColumn title="Resources">
            <FooterLink to="/documentation">Documentation</FooterLink>
            <FooterLink to="/documentation">Getting Started</FooterLink>
            <FooterLink to="/documentation">User Guide</FooterLink>
            <FooterLink to="/documentation">API Documentation</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink href="https://github.com/Vikramsindra/help-desk.git">
              <span className="inline-flex items-center gap-1.5">
                <GitBranch size={13} />
                GitHub
              </span>
            </FooterLink>
          </FooterColumn>

          {/* Column 4 – HELP & SUPPORT */}
          <FooterColumn title="Help & Support">
            <FooterLink to="/help">Help Center</FooterLink>
            <FooterLink to="/help">Contact Support</FooterLink>
            <FooterLink to={submitRequestPath}>
              Submit Support Request
            </FooterLink>
            <FooterLink href="https://github.com/Vikramsindra/help-desk/issues">
              Report a Bug
            </FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/help">Troubleshooting</FooterLink>
          </FooterColumn>

          {/* Column 5 – COMPANY */}
          <FooterColumn title="Company">
            <FooterLink to="/about">About HelpDesk</FooterLink>
            <FooterLink to="/about">About the Developer</FooterLink>
            <FooterLink to="/about">Our Mission</FooterLink>
            <FooterLink to="/about">Tech Stack</FooterLink>
            <FooterLink href="https://github.com/Vikramsindra/help-desk.git">
              <span className="inline-flex items-center gap-1.5">
                <GitBranch size={13} />
                GitHub
              </span>
            </FooterLink>
          </FooterColumn>
        </div>

        {/* ── Mid-bar: Newsletter + Security ── */}
        <div className="border-t border-white/10 pt-10 pb-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Newsletter / Stay Updated */}
          <FooterNewsletter />

          {/* Security feature list */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white text-base font-semibold">
              Security &amp; Trust
            </h3>
            <ul className="flex flex-col gap-2">
              {securityFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-[#9db8b2]"
                >
                  <Shield size={13} className="text-[#a9d2c4] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom legal bar ── */}
        <FooterBottomBar />
      </div>
    </footer>
  );
}
