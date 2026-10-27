function firstHeaderValue(headers: Headers, name: string) {
  return headers.get(name)?.split(",")[0]?.trim() || null;
}

function parseWebOrigin(value: string | null) {
  if (!value) {
    return null;
  }

  if (value !== value.trim() || value.includes(",")) {
    return null;
  }

  try {
    const url = new URL(value);
    if (
      (url.protocol === "http:" || url.protocol === "https:") &&
      !url.username &&
      !url.password &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash
    ) {
      return url.origin;
    }
  } catch {
    return null;
  }

  return null;
}

function parseForwardedOrigin(headers: Headers) {
  const protocol = firstHeaderValue(headers, "x-forwarded-proto")?.toLowerCase();
  const host =
    firstHeaderValue(headers, "x-forwarded-host") ??
    firstHeaderValue(headers, "host");

  if (
    !host ||
    (protocol !== "http" && protocol !== "https") ||
    /[\s/?#@\\\u0000-\u001f]/.test(host)
  ) {
    return null;
  }

  return parseWebOrigin(`${protocol}://${host}`);
}

export function getRequestOrigin(headers: Headers): string | null {
  return (
    parseWebOrigin(headers.get("origin")) ?? parseForwardedOrigin(headers)
  );
}
