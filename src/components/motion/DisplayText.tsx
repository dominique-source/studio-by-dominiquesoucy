import { Fragment } from "react";

// Anton (the condensed display font) renders "Ü"/"ü" as a broken glyph in
// this rendering pipeline — confirmed with a literal hardcoded uppercase
// string, so it isn't a text-transform synthesis issue, a subset issue,
// or a loading issue; the font's own outline for that one character is
// the problem. Every project title in Anton goes through this component,
// which renders that one character in the fallback sans-serif instead —
// visually seamless at display sizes, and the only reliable fix short of
// dropping Anton entirely for one word in the whole registry.
export function DisplayText({ children }: { children: string }) {
  const parts = children.split(/([üÜ])/g);
  return (
    <>
      {parts.map((part, i) =>
        part === "ü" || part === "Ü" ? (
          <span key={i} style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 800 }}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
