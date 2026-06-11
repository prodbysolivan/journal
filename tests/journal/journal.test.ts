import { assertEquals, assertThrows } from "@std/assert";
import { Journal } from "../../source/index.ts";
import { Handler } from "../../source/index.ts";

Deno.test("Journal handler registration", () => {
  const journal = new Journal({});
  const handler = new Handler({ journal, name: "Test" });

  journal.addToHandlers(handler);
  assertEquals(journal.handlers.length, 1);

  assertThrows(() => journal.addToHandlers(handler));
});

Deno.test("Journal routing to handlers", async () => {
  const journal = new Journal({});
  const handler = new Handler({ journal, name: "Test" });
  let count = 0;

  handler.onHandle.connect(() => count++);
  journal.addToHandlers(handler);

  await journal.write({ content: "hi", level: "info" });
  assertEquals(count, 1);
});
