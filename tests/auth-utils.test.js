import { test } from "node:test";
import assert from "node:assert/strict";
import { safeReturnPath, getApiError } from "../src/functions/apiErrors.js";
test("auth returns to an internal product or bag path", () => {
  assert.equal(safeReturnPath("/product/123#reviews"), "/product/123#reviews");
  assert.equal(safeReturnPath("/cart"), "/cart");
});
test("auth never redirects to external URLs or auth loops", () => {
  for (const path of [
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "/login",
    "/signup?x=1",
    "/register#x",
    undefined,
  ])
    assert.equal(safeReturnPath(path), "/");
});
test("API failures produce useful text without rendering error objects", () => {
  assert.equal(
    getApiError({ response: { data: "Already reviewed" } }),
    "Already reviewed",
  );
  assert.equal(
    getApiError({ response: { data: { messages: ["One", "Two"] } } }),
    "One Two",
  );
  assert.match(getApiError({ code: "ECONNABORTED" }), /too long/);
  assert.equal(getApiError(new Error("private"), "Try again"), "Try again");
});
