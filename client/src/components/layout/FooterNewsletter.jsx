import { GitBranch } from "lucide-react";

/**
 * FooterNewsletter - "Stay Updated" section shown in the footer mid-bar.
 * Links to the GitHub repository instead of a fake subscription form.
 */
export default function FooterNewsletter() {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-white text-base font-semibold">Stay Updated</h3>
      <p className="text-[#9db8b2] text-sm leading-relaxed max-w-xs">
        Stay informed about new features, improvements, and platform updates.
      </p>
      <a
        href="https://github.com/Vikramsindra/help-desk.git"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-[#a9d2c4] hover:text-white transition-colors duration-200 mt-1"
      >
        <GitBranch size={16} />
        <span>Follow on GitHub</span>
      </a>
    </div>
  );
}
