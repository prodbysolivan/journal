import { type ReadonlySignal, Signal } from "@prodbysolivan/signal";
import type { Handler } from "./handler.ts";
import type { Message } from "../common/types/message.ts";
import { History } from "./history.ts";
import type { HistorySettings } from "./history.ts";

/**
 * Settings for the Journal core system.
 */
export interface JournalSettings {
  /** Settings for the history. */
  historySettings?: HistorySettings;
}

/**
 * Central orchestrator for handling messages and managing handlers/history.
 */
export class Journal {
  // #region Lifecycle
  private _handlers: Handler[] = [];
  /** The history for storing messages. */
  public history: History;
  // #endregion

  // #region Signals
  private _onWrite = new Signal<[Message]>();
  private _onHandlerAdded = new Signal<[Handler]>();
  private _onHandlerRemoved = new Signal<[Handler]>();
  // #endregion

  /**
   * @param settings Configuration object for the Journal.
   */
  constructor(settings: JournalSettings) {
    this.history = new History(settings.historySettings || { limit: 100 });
  }

  // #region Getters
  /** Returns the list of registered handlers. */
  public get handlers(): readonly Handler[] {
    return this._handlers;
  }

  /** Emitted when a new message is written to the journal. */
  public get onWrite(): ReadonlySignal<[Message]> {
    return this._onWrite.asReadonly();
  }

  /** Emitted when a new handler is registered. */
  public get onHandlerAdded(): ReadonlySignal<[Handler]> {
    return this._onHandlerAdded.asReadonly();
  }

  /** Emitted when a handler is removed. */
  public get onHandlerRemoved(): ReadonlySignal<[Handler]> {
    return this._onHandlerRemoved.asReadonly();
  }

  // #endregion

  // #region Methods
  /**
   * Writes a message, dispatches it to handlers, and adds it to history.
   * @param message The message to write.
   */
  public write(message: Message): void {
    this._handlers.forEach((h) => h.handle(message));
    this.history.push(message);
    this._onWrite.fire(message);
  }

  /**
   * Registers a new handler.
   * @param handler The handler instance to add.
   */
  public addToHandlers(handler: Handler): void {
    if (this._handlers.includes(handler)) {
      throw new Error(`Handler: ${handler.name} is already added`);
    }
    this._handlers.push(handler);
    this._onHandlerAdded.fire(handler);
  }

  /**
   * Unregisters an existing handler.
   * @param handler The handler instance to remove.
   */
  public removeFromHandlers(handler: Handler): void {
    const index = this._handlers.indexOf(handler);
    if (index === -1) {
      throw new Error(`Handler: ${handler.name} is not added`);
    }
    this._handlers.splice(index, 1);
    this._onHandlerRemoved.fire(handler);
  }

  /** Find a handler by name. */
  public getFromHandlers(name: string): Handler | undefined {
    return this._handlers.find((h) => h.name === name);
  }

  /** Checks if a handler exists by name. */
  public hasInHandlers(name: string): boolean {
    return this._handlers.some((h) => h.name === name);
  }

  /** Disposes all handlers and the history component. */
  public dispose(): void {
    this._handlers.forEach((h) => h.dispose());
    this.history.dispose();
  }
  // #endregion
}
