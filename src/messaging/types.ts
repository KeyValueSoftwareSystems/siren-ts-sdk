/**
 * Provider codes for messaging integrations.
 */
export enum ProviderCode {
  EMAIL_SENDGRID = 'EMAIL_SENDGRID',
  SMS_MSG91 = 'SMS_MSG91',
  PUSH_FCM = 'PUSH_FCM',
  WHATSAPP_META = 'WHATSAPP_META',
  WHATSAPP_WATI = 'WHATSAPP_WATI',
  IN_APP_SIREN = 'IN_APP_SIREN',
  SMS_TWILIO = 'SMS_TWILIO',
  SMS_KALEYRA_IO = 'SMS_KALEYRA_IO',
  SMS_PLIVO = 'SMS_PLIVO',
  EMAIL_MAILCHIMP = 'EMAIL_MAILCHIMP',
  EMAIL_GMAIL = 'EMAIL_GMAIL',
  EMAIL_POSTMARK = 'EMAIL_POSTMARK',
  EMAIL_OUTLOOK = 'EMAIL_OUTLOOK',
  EMAIL_SIREN_SAMPLE = 'EMAIL_SIREN_SAMPLE',
  SMS_MESSAGEBIRD = 'SMS_MESSAGEBIRD',
  PUSH_ONESIGNAL = 'PUSH_ONESIGNAL',
  EMAIL_MAILGUN = 'EMAIL_MAILGUN',
  EMAIL_SES = 'EMAIL_SES',
  SLACK = 'SLACK',
  WHATSAPP_TWILIO = 'WHATSAPP_TWILIO',
  TEAMS = 'TEAMS',
  WHATSAPP_GUPSHUP = 'WHATSAPP_GUPSHUP',
  DISCORD = 'DISCORD',
  WHATSAPP_MSG91 = 'WHATSAPP_MSG91',
  LINE = 'LINE'
}

/**
 * Provider integration information.
 */
export interface ProviderIntegration {
  name: string;
  code: ProviderCode;
}

/**
 * Recipient information. Each channel maps to its specific identifier field.
 */
export interface Recipient {
  email?: string;
  sms?: string;
  whatsapp?: string;
  slack?: string;
  teams?: string;
  discord?: string;
  line?: string;
  inApp?: string;
  pushToken?: string;
}

/**
 * Template metadata for message sending.
 */
export interface TemplateInfo {
  name: string;
}

/**
 * Request payload for sending a message.
 */
export interface SendMessageRequest {
  channel: string;
  recipient: Recipient;
  body?: string;
  template?: TemplateInfo;
  templateVariables?: Record<string, any>;
  templateIdentifier?: string;
  providerIntegration?: ProviderIntegration;
}

/**
 * Base response for message-related endpoints.
 */
export interface MessageBase {
  notificationId: string;
}

export interface MessageData extends MessageBase {}

export interface StatusData {
  status: string;
}

export interface ReplyData {
  text: string;
  user: string;
  ts: string;
  threadTs: string;
}