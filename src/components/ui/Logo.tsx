import Link from "next/link";

export function Logo({
  href = "/",
  className = "",
}: {
  href?: string | null;
  className?: string;
}) {
  const inner = (
    <span className={`flex items-center gap-2.5 font-extrabold ${className}`}>
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-gradient text-white shadow-soft">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M20 7L10 17l-5-5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-xl tracking-tight text-ink">Task&nbsp;Flow</span>
    </span>
  );

  if (href === null) return inner;
  return (
    <Link href={href} className="inline-flex" aria-label="Task Flow home">
      {inner}
    </Link>
  );
}
