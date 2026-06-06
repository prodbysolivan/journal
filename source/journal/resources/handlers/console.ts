import { Handler } from "../../handler.ts";
import type { Journal } from "../../journal.ts";

export interface ConsoleHandlerSettings {
  journal: Journal;
  name?: string;
}

export class ConsoleHandler extends Handler {
  constructor(settings: ConsoleHandlerSettings) {
    super({
      journal: settings.journal,
      name: settings.name ?? "Console",
      description: "Console handler that logs messages to the local console.",
    });

    this.onHandle.connect((message) => {
      const styles: Record<string, string> = {
        info: "color: cyan; font-weight: bold;",
        warn: "color: orange; font-weight: bold;",
        error: "color: red; font-weight: bold;",
      };

      const style = styles[message.level] ?? "color: gray;";
      const sender = message.sender ?? "Unknown";
      const tags = message.tags?.length ? ` [${message.tags.join(", ")}]` : "";

      console.log(
        `%c[${message.level.toUpperCase()}]%c ${this.name} > ${sender}${tags}: ${message.content}`,
        style,
        "color: inherit;",
      );
    });
  }
}
