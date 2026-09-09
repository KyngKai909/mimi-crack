type Item = { q: string; a: string };

/** Native disclosure widgets — keyboard and screen-reader behaviour for free. */
export function Faq({ items }: { items: readonly Item[] }) {
  return (
    <div>
      {items.map((item, i) => (
        <details key={item.q} className="group border-b border-ink last:border-b-0">
          <summary className="invert-hover mono-label flex cursor-pointer list-none items-center gap-5 px-4 py-5 marker:hidden md:px-6 [&::-webkit-details-marker]:hidden">
            <span className="text-ink/40 group-hover:text-inherit">
              [ {String(i + 1).padStart(2, "0")} ]
            </span>
            <span className="flex-1 normal-case tracking-normal">{item.q}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-lg leading-none transition-transform duration-[120ms] group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-2xl px-4 pb-6 pl-4 text-sm leading-relaxed text-ink/75 md:px-6 md:pl-[5.5rem]">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
