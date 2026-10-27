import test from "node:test";
import assert from "node:assert/strict";

import { getRequestOrigin } from "./request-origin";

test("getRequestOrigin prefers a valid origin header", () => {
  const headers = new Headers({
    origin: "https://akiba.example.com",
    host: "internal:3000",
    "x-forwarded-host": "preview.example.com",
    "x-forwarded-proto": "http",
  });

  assert.equal(getRequestOrigin(headers), "https://akiba.example.com");
});

test("getRequestOrigin prefers forwarded host and protocol", () => {
  const headers = new Headers({
    host: "internal:3000",
    "x-forwarded-host": "akiba-preview.example.com",
    "x-forwarded-proto": "https",
  });

  assert.equal(getRequestOrigin(headers), "https://akiba-preview.example.com");
});

test("getRequestOrigin uses the host with forwarded protocol as fallback", () => {
  const headers = new Headers({
    host: "akiba.example.com",
    "x-forwarded-proto": "https",
  });

  assert.equal(getRequestOrigin(headers), "https://akiba.example.com");
});

test("getRequestOrigin rejects non-HTTP protocols and malformed hosts", () => {
  assert.equal(
    getRequestOrigin(
      new Headers({
        origin: "javascript:alert(1)",
        host: "akiba.example.com",
        "x-forwarded-proto": "javascript",
      }),
    ),
    null,
  );
  assert.equal(
    getRequestOrigin(
      new Headers({
        host: "evil.example/path",
        "x-forwarded-proto": "https",
      }),
    ),
    null,
  );
});
