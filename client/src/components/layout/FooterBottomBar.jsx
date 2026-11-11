import { GitBranch } from "lucide-react";
import FooterLink from "./FooterLink";

/**
 * FooterBottomBar - Legal / copyright bar at the very bottom of the footer.
 *
 * Layout (responsive):
 *   Mobile  : stacked vertically, centered
 *   Desktop : three-column flex row
 *     Left   – copyright notice
 *     Center – developer credit
 *     Right  – GitHub icon link + legal page links
 */
export default function FooterBottomBar() {
  const year = new Date().getFullYear();

  return (
    <div className="border-t border-white/10 pt-6 mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-[#9db8b2]">
        {/* Left – copyright */}
        <span>© {year} HelpDesk. All rights reserved.</span>

        {/* Center – developer credit */}
        <span className="md:text-center">Developed by Vikram Sindra</span>

        {/* Right – GitHub + legal links */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/Vikramsindra/help-desk.git"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="text-[#9db8b2] hover:text-white transition-colors duration-200"
          >
            <GitBranch size={15} />
          </a>
          <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
          <FooterLink to="/cookie-policy">Cookie Policy</FooterLink>
        </div>
      </div>
    </div>
  );
}
