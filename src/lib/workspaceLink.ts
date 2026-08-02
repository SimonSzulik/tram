// Helpers for the "Try in Workspace" deep link. Learning pages encode a TRIPLA
// snippet into the URL; the Workspace (/) decodes it and seeds the editor.

/** UTF-8 safe base64 encode of a code snippet for use in ?code=. */
export function encodeCode(code: string): string {
  return btoa(unescape(encodeURIComponent(code)));
}

/** Inverse of encodeCode. Returns null if the value can't be decoded. */
export function decodeCode(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(escape(atob(value)));
  } catch {
    return null;
  }
}

/** Build a /?code=… path from a snippet. */
export function workspaceHref(code: string): string {
  return `/?code=${encodeURIComponent(encodeCode(code))}`;
}
