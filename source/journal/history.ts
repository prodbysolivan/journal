import { type ReadonlySignal, Signal } from "@prodbysolivan/signal";
import type { Disposable } from "@prodbysolivan/types";
import type { Message } from "../common/types/message.ts";

/**
 * Settings for configuring the history capacity.
 */
export interface HistorySettings {
  /** The maximum number of messages to store in history. */
  limit: number;
}

/**
 * Manages an ordered collection of messages with a size limit.
 */
export class History implements Disposable {
  // #region Lifecycle
  private _limit: number;
  private _enabled = true;
  private _disposed = false;
  private _content: Message[] = [];
  // #endregion

  // Signals
  private _onLimitChanged = new Signal<[number]>();
  private _onEnabledChanged = new Signal<[boolean]>();
  private _onPush = new Signal<[Message]>();
  private _onClear = new Signal<[]>();
  // #endregion

  /**
   * @param settings Initial configuration for history.
   */
  constructor(settings: HistorySettings) {
    this._limit = settings.limit ?? 100;
  }

  // #region Getters
  public get limit(): number {
    return this._limit;
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public get disposed(): boolean {
    return this._disposed;
  }

  /** Returns the current message sequence. */
  public get content(): readonly Message[] {
    return this._content;
  }

  public get onLimitChange(): ReadonlySignal<[number]> {
    return this._onLimitChanged.asReadonly();
  }

  public get onEnabledChange(): ReadonlySignal<[boolean]> {
    return this._onEnabledChanged.asReadonly();
  }

  public get onPush(): ReadonlySignal<[Message]> {
    return this._onPush.asReadonly();
  }

  public get onClear(): ReadonlySignal<[]> {
    return this._onClear.asReadonly();
  }
  // #endregion

  // #region Setters
  /** Sets the maximum number of messages allowed in history. */
  public set limit(value: number) {
    this._limit = value;
    this._onLimitChanged.fire(value);
    while (this.content.length > this._limit) {
      this._content.shift();
    }
  }

  public set enabled(value: boolean) {
    this._enabled = value;
    this._onEnabledChanged.fire(value);
  }
  // #endregion

  // #region Methods
  /**
   * Adds a message to the history if enabled.
   * @param message The message to record.
   */
  public push(message: Message): void {
    if (!this._enabled) return;
    this._content.push(message);
    if (this.content.length > this.limit) {
      this._content.shift();
    }
    this._onPush.fire(message);
  }

  /** Clears all stored messages. */
  public clear(): void {
    this._content = [];
    this._onClear.fire();
  }

  /** Disposes of signals and clears internal content. */
  public dispose(): void {
    this._content = [];
    this._onLimitChanged.dispose();
    this._onEnabledChanged.dispose();
    this._onPush.dispose();
    this._onClear.dispose();
    this._disposed = true;
  }
  // #endregion
}
