import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAuthConfirmUrl,
  getSafeNextPath,
  parseAuthConfirmationParams,
} from "./auth-confirmation";

test("getSafeNextPath accepts local paths", () => {
  assert.equal(getSafeNextPath("/"), "/");
  assert.equal(getSafeNextPath("/goals"), "/goals");
  assert.equal(getSafeNextPath("/goals?tab=active#top"), "/goals?tab=active#top");
});

test("getSafeNextPath rejects external, protocol-relative, backslash, and control paths", () => {
  for (const value of [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/goals\\@evil.example",
    "/goals\n/admin",
    "",
  ]) {
    assert.equal(getSafeNextPath(value), "/");
  }
  assert.equal(getSafeNextPath(null), "/");
});

test("buildAuthConfirmUrl creates a callback URL with a safe next path", () => {
  assert.equal(
    buildAuthConfirmUrl("https://akiba.example.com", "/goals"),
    "https://akiba.example.com/auth/confirm?next=%2Fgoals",
  );
  assert.equal(
    buildAuthConfirmUrl("https://akiba.example.com/", "https://evil.example"),
    "https://akiba.example.com/auth/confirm?next=%2F",
  );
});

test("parseAuthConfirmationParams accepts email token_hash links", () => {
  const params = new URLSearchParams({
    token_hash: "one-time-token",
    type: "email",
  });

  assert.deepEqual(parseAuthConfirmationParams(params), {
    kind: "token_hash",
    tokenHash: "one-time-token",
    type: "email",
  });
});

test("parseAuthConfirmationParams accepts PKCE code links", () => {
  const params = new URLSearchParams({ code: "one-time-code" });

  assert.deepEqual(parseAuthConfirmationParams(params), {
    kind: "code",
    code: "one-time-code",
  });
});

test("parseAuthConfirmationParams rejects missing parameters", () => {
  assert.equal(parseAuthConfirmationParams(new URLSearchParams()), null);
});

test("parseAuthConfirmationParams rejects unsupported OTP types", () => {
  const params = new URLSearchParams({
    token_hash: "one-time-token",
    type: "recovery",
  });

  assert.equal(parseAuthConfirmationParams(params), null);
});

test("parseAuthConfirmationParams rejects ambiguous or duplicated credentials", () => {
  const params = new URLSearchParams({
    code: "one-time-code",
    token_hash: "one-time-token",
    type: "email",
  });

  assert.equal(parseAuthConfirmationParams(params), null);
});
