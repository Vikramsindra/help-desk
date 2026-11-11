/**
 * FooterColumn - Reusable column layout for footer navigation groups.
 *
 * Props:
 *   title    - column heading text (displayed uppercase with letter spacing)
 *   children - column link items
 */
export default function FooterColumn({ title, children }) {
  return (
    <div>
      <h3 className="text-[#a9d2c4] text-xs font-semibold uppercase tracking-widest mb-4">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
