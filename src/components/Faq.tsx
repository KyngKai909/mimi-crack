type Item = { q: string; a: string };

/** Native disclosure widgets — keyboard and screen-reader behaviour for free. */
export function Faq({ items }: { items: readonly Item[] }) {
  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left font-display text-lg font-medium text-ink marker:hidden">
            {item.q}
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-xl leading-none text-ink-faint transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl pr-10 leading-relaxed text-ink-soft">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
