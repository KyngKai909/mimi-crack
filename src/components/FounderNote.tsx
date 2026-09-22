import { BRAND } from "@/lib/brand";

/**
 * Carmel's message, in her words.
 *
 * One component for both places it appears, so the two can't drift into
 * different versions of the same letter.
 */
export function FounderNote({ className = "" }: { className?: string }) {
  const note = BRAND.founderStatement;

  return (
    <div className={className}>
      {note.paragraphs.map((p, i) => (
        <p
          key={p.slice(0, 24)}
          className={
            i === 0
              ? "display display-md leading-snug"
              : "prose-airy mt-6 text-[1.08rem]"
          }
        >
          {p}
        </p>
      ))}

      {/* Her sign-off carries the brand line, so it gets the accent rather
          than sitting in the body copy. */}
      <p className="display display-md mt-9 text-pistachio-deep">
        {note.closing.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>

      <p className="mt-8 text-[0.95rem] leading-relaxed text-ink-soft">
        {note.signature.salutation}
        <br />
        <span className="text-ink">{note.signature.name}</span>
        {note.signature.roles.map((role) => (
          <span key={role} className="block text-ink-mute">
            {role}
          </span>
        ))}
      </p>
    </div>
  );
}
