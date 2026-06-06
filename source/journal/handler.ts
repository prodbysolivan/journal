import { type ReadonlySignal, Signal } from "@prodbysolivan/signal";
import type { Message } from "../common/types/message.ts";
import type { Journal } from "./journal.ts";
import type { Disposable } from "@prodbysolivan/types";

/**
 * Settings required to initialize a Handler.
 */
export interface HandlerSettings {
  /** The journal instance to associate with the handler. */
  journal: Journal;
  /** The name of the handler. */
  name: string;
  /** The description of the handler. */
  description?: string;
}

/**
 * Base class for handling messages within the Journal ecosystem.
 */
export class Handler implements Disposable {
  // #region Metadata
  public readonly name: string;
  public readonly description: string;
  // #endregion

  // #region Lifecycle
  public readonly journal: Journal;
  private _enabled: boolean = true;
  private _disposed: boolean = false;
  // #endregion

  // #region Signals
  private _onEnabledChanged: Signal<[boolean]> = new Signal();
  protected _onHandle: Signal<[Message]> = new Signal();
  protected _onDispose: Signal<[]> = new Signal();
  // #endregion

  /**
   * @param settings Configuration object for the handler.
   */
  public constructor(settings: HandlerSettings) {
    this.journal = settings.journal;
    this.name = settings.name;
    this.description = settings.description ?? "No description provided.";
  }

  // #region Getters
  public get enabled(): boolean {
    return this._enabled;
  }

  public get disposed(): boolean {
    return this._disposed;
  }

  /** Emitted when the enabled state of the handler changes. */
  public get onEnabledChanged(): ReadonlySignal<[boolean]> {
    return this._onEnabledChanged.asReadonly();
  }

  /** Emitted when a message is processed by this handler. */
  public get onHandle(): ReadonlySignal<[Message]> {
    return this._onHandle.asReadonly();
  }

  /** Emitted when the handler is disposed. */
  public get onDispose(): ReadonlySignal<[]> {
    return this._onDispose.asReadonly();
  }
  // #endregion

  // #region Setters
  /** Sets whether the handler is currently active. */
  public set enabled(value: boolean) {
    this._enabled = value;
    this._onEnabledChanged.fire(value);
  }
  // #endregion

  // #region Methods
  /**
   * Processes an incoming message if the handler is enabled.
   * @param message The message to be handled.
   */
  public handle(message: Message): void {
    if (!this._enabled) return;
    try {
      this._onHandle.fire(message);
    } catch (error) {
      console.error(`Failed to handle message: ${error}`);
    }
  }

  /** Disposes of signals and cleans up handler resources. */
  public dispose(): void {
    if (this._disposed) return;
    this._onEnabledChanged.dispose();
    this._onHandle.dispose();
    this.journal.removeFromHandlers(this);
    this._onDispose.fire();
    this._onDispose.dispose();
  }
  // #endregion
}
