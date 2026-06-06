import { assertEquals, assertThrows } from "@std/assert";
import { Journal } from "../../source/journal/journal.ts";
import { Handler } from "../../source/journal/handler.ts";

Deno.test("Journal handler registration", () => {
  const journal = new Journal({});
  const handler = new Handler({ journal, name: "Test" });

  journal.addToHandlers(handler);
  assertEquals(journal.handlers.length, 1);

  assertThrows(() => journal.addToHandlers(handler));
});

Deno.test("Journal routing to handlers", () => {
  const journal = new Journal({});
  const handler = new Handler({ journal, name: "Test" });
  let count = 0;

  handler.onHandle.connect(() => count++);
  journal.addToHandlers(handler);

  journal.write({ content: "hi", level: "info" });
  assertEquals(count, 1);
});
