export type EmailConfirmationOtpType = "email" | "signup";

export type AuthConfirmationParams =
  | { kind: "code"; code: string }
  | {
      kind: "token_hash";
      tokenHash: string;
      type: EmailConfirmationOtpType;
    };

export function getSafeNextPath(value: string | null): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return "/";
  }

  try {
    const url = new URL(value, "https://akiba.invalid");
    if (url.origin !== "https://akiba.invalid") {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export function buildAuthConfirmUrl(
  origin: string,
  nextPath = "/",
): string {
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    throw new Error("A valid application origin is required.");
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    url.username ||
    url.password ||
    (url.pathname !== "/" && url.pathname !== "") ||
    url.search ||
    url.hash
  ) {
    throw new Error("A valid application origin is required.");
  }

  const confirmationUrl = new URL("/auth/confirm", url.origin);
  confirmationUrl.searchParams.set("next", getSafeNextPath(nextPath));
  return confirmationUrl.toString();
}

function isEmailConfirmationOtpType(
  type: string,
): type is EmailConfirmationOtpType {
  return type === "email" || type === "signup";
}

export function parseAuthConfirmationParams(
  searchParams: URLSearchParams,
): AuthConfirmationParams | null {
  const codes = searchParams.getAll("code");
  const tokenHashes = searchParams.getAll("token_hash");
  const types = searchParams.getAll("type");

  if (
    codes.length === 1 &&
    codes[0] &&
    tokenHashes.length === 0 &&
    types.length === 0
  ) {
    return { kind: "code", code: codes[0] };
  }

  const type = types[0];
  if (
    codes.length === 0 &&
    tokenHashes.length === 1 &&
    tokenHashes[0] &&
    types.length === 1 &&
    type &&
    isEmailConfirmationOtpType(type)
  ) {
    return {
      kind: "token_hash",
      tokenHash: tokenHashes[0],
      type,
    };
  }

  return null;
}
