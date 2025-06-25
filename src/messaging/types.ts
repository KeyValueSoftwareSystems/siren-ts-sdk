/**
 * Type of recipient for a message.
 */
export type RecipientType = 'user_id' | 'direct';

/**
 * Base interface for template information.
 */
export interface TemplateInfo {
  /** Name of the template to use */
  name: string;
}

/**
 * Base interface for recipient information.
 */
export interface Recipient {
  /** Type of recipient (user_id or direct) */
  type: RecipientType;
  /** Identifier for the recipient (e.g., Slack user ID, email address) */
  value: string;
}

/**
 * Base interface for message data.
 */
export interface MessageBase {
  /** Unique identifier for the message */
  notificationId: string;
}

/**
 * Request interface for sending a message.
 */
export interface SendMessageRequest {
  /** Recipient information */
  recipient: Recipient;
  /** Channel to send the message through (e.g., "SLACK", "EMAIL") */
  channel: string;
  /** Optional message body text (required if no template) */
  body?: string;
  /** Optional template information (required if no body) */
  template?: TemplateInfo;
  /** Optional template variables for template-based messages */
  templateVariables?: Record<string, any>;
}

/**
 * Response data for a sent message.
 */
export interface MessageData extends MessageBase {}

/**
 * Response data for message status.
 */
export interface StatusData {
  /** Current status of the message (e.g., "DELIVERED", "PENDING") */
  status: string;
}

/**
 * Response data for message replies.
 */
export interface ReplyData {
  /** Text content of the reply */
  text: string;
  /** User identifier who sent the reply */
  user: string;
  /** Timestamp of the reply */
  ts: string;
  /** Thread timestamp if part of a thread */
  threadTs: string;
}