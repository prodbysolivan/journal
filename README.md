# Journal

A lightweight journaling system designed for modularity and seamless message observability.

## Description

Journal is an architecture-focused library designed to manage message flows and application history. By utilizing a robust Signal-based system, it decouples the message producers from the consumers, allowing you to "plug in" custom handlers—such as console loggers, file systems, or remote API exporters—without modifying the core logic. It solves the problem of rigid, tightly-coupled logging by treating every action as an observable event, making it the perfect foundation for sophisticated debugging and observability tools.

### Dependencies

- Deno 1.40 or higher
- [@prodbysolivan/types](https://jsr.io/@prodbysolivan/types)
- [@prodbysolivan/signal](https://jsr.io/@prodbysolivan/signal)

### Installing

You can add this project to your Deno project using the following command:

```bash
deno add @prodbysolivan/journal
```

### Quick Usage

The core philosophy is simple: initialize the journal, create a handler, and connect it to the stream.

```typescript
import { Journal } from "@prodbysolivan/journal";
import { ConsoleHandler } from "@prodbysolivan/journal/handlers";

const journal = new Journal({ historySettings: { limit: 100 } });

// Registering a handler
const logger = new ConsoleHandler({ journal, name: "AppLogger" });
journal.addToHandlers(logger);

// Dispatching a message
journal.write({
  content: "System initialized successfully",
  level: "info",
  sender: "Core"
});

```

## Help

* **Handling Duplicates**: Ensure you do not manually call `super.handle(message)` if you are observing the `onHandle` signal, as this will trigger a feedback loop.
* **Memory Management**: Always call `journal.dispose()` or `handler.dispose()` when your components are destroyed to prevent memory leaks and clear active Signal subscriptions.
* **Missing Data**: If logs aren't appearing, verify that your handler's `enabled` property is set to `true`.

## Authors

Solivan (prodbysolivan)

[@solivan](https://github.com/prodbysolivan)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

* [Prodbysolivan Signal library](https://www.google.com/search?q=https://jsr.io/%40prodbysolivan/signal)
* The open-source community for constant inspiration on event-driven architectures.
