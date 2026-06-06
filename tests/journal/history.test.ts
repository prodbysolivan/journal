import { assertEquals } from "@std/assert";
import { History } from "../../source/journal/history.ts";

Deno.test("History limit enforcement", () => {
  const history = new History({ limit: 2 });
  history.push({ content: "1", level: "info" });
  history.push({ content: "2", level: "info" });
  history.push({ content: "3", level: "info" });

  assertEquals(history.content.length, 2);
  assertEquals(history.content[0].content, "2");
});

Deno.test("History clear functionality", () => {
  const history = new History({ limit: 10 });
  history.push({ content: "msg", level: "info" });
  history.clear();
  assertEquals(history.content.length, 0);
});
