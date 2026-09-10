type Item = { q: string; a: string };

/** Native disclosure widgets — keyboard and screen-reader behaviour for free. */
export function Faq({ items }: { items: readonly Item[] }) {
  return (
    <div>
      {items.map((item) => (
        <details key={item.q} className="group hairline">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-7 marker:hidden [&::-webkit-details-marker]:hidden">
            <span className="display display-md pr-4">{item.q}</span>
            <span
              aria-hidden="true"
              className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hairline text-base leading-none transition-transform duration-500 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="prose-airy max-w-2xl pb-8 pr-12">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
