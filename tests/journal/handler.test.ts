import { assert, assertEquals } from "@std/assert";
import { Handler } from "../../source/index.ts";
import { Journal } from "../../source/index.ts";

Deno.test("Handler lifecycle and enabling", () => {
  const journal = new Journal({});
  const handler = new Handler({ journal, name: "Test" });

  assertEquals(handler.enabled, true);
  handler.enabled = false;
  assertEquals(handler.enabled, false);
});

Deno.test("Handler handles message when enabled", () => {
  const journal = new Journal({});
  const handler = new Handler({ journal, name: "Test" });
  let received = false;

  handler.onHandle.connect(() => {
    received = true;
  });
  handler.handle({ content: "test", level: "info" });

  assert(received);
});
