/**
 * Represents a message to be sent or received.
 */
export interface Message {
  /** The content of the message. */
  content: string;
  /** The level of the message. */
  level: "info" | "warn" | "error";
  /** The attachments of the message. */
  attachments?: Record<string, unknown>;
  /** The tags of the message. */
  tags?: string[];
  /** The sender of the message. */
  sender?: string;
}
