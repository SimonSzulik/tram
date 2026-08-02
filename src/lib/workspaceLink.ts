// Helpers for the "Try in Workspace" deep link. Learning pages encode a TRIPLA
// snippet into the URL; the Workspace (/) decodes it and seeds the editor.

/** UTF-8 safe base64 encode of a code snippet for use in ?code=. */
export function encodeCode(code: string): string {
  return btoa(unescape(encodeURIComponent(code)));
}

/** Inverse of encodeCode. Returns null if the value can't be decoded or is too large. */
export function decodeCode(value: string | null): string | null {
  if (!value) return null;
  // Cap encoded payload (~64KB decoded) so a huge ?code= can't freeze the tab.
  if (value.length > 90_000) return null;
  try {
    const decoded = decodeURIComponent(escape(atob(value)));
    if (decoded.length > 64_000) return null;
    return decoded;
  } catch {
    return null;
  }
}

/** Build a /?code=… path from a snippet. */
export function workspaceHref(code: string): string {
  return `/?code=${encodeURIComponent(encodeCode(code))}`;
}
