# Journal

> Journaling system designed for modularity and seamless message observability.

## Description

A modular architecture-focused library designed to manage message flows and application history built for TypeScript. By utilizing a robust Signal-based system, it decouples the message producers from the consumers, allowing you to "plug in" custom handlers—such as console loggers, file systems, or remote API exporters—without modifying the core logic. It solves the problem of rigid, tightly-coupled logging by treating every action as an observable event, making it the perfect foundation for sophisticated debugging and observability tools.

## Features

* **Modular Architecture**: Decouples message production from consumption via custom, pluggable handlers.
* **Signal-Driven**: Built on an observable event system, making it easy to integrate with reactive pipelines.
* **History Management**: Integrated support for tracking and capping message history.
* **Highly Configurable**: Seamlessly swap handlers like loggers, file systems, or remote exporters at runtime.

## Getting Started

### Prerequisites

* [Deno 1.40 or higher](https://deno.land/)

### Installation

```bash
deno add @prodbysolivan/journal

```

## Quick Usage

```typescript
import { Journal, ConsoleHandler } from "@prodbysolivan/journal";

const journal = new Journal({ historySettings: { limit: 100 } });

// Registering a handler
const logger = new ConsoleHandler({ journal, name: "AppLogger" });
journal.addToHandlers(logger);

// Dispatching a message
journal.write({
  content: "System initialized successfully",
  level: "info",
  sender: "Core",
});

```

## Documentation & Help

### Ecosystem Dependencies

* [@prodbysolivan/types](https://jsr.io/@prodbysolivan/types)
* [@prodbysolivan/signal](https://jsr.io/@prodbysolivan/signal)
* [@prodbysolivan/history](https://jsr.io/@prodbysolivan/history)

### Troubleshooting

* **Handling Duplicates**: Ensure you do not manually call `super.handle(message)` if you are observing the `onHandle` signal, as this will trigger a feedback loop.
* **Memory Management**: Always call `journal.dispose()` or `handler.dispose()` when your components are destroyed to prevent memory leaks and clear active Signal subscriptions.
* **Missing Data**: If logs aren't appearing, verify that your handler's `enabled` property is set to `true`.

---

## Authors

* **Solivan** ([@solivan](https://github.com/prodbysolivan))

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## Acknowledgments

* [Deno Documentation](https://docs.deno.com/)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/)
