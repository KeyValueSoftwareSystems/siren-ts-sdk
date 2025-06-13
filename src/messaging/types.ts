import { BaseAPIResponse } from '../base/client';

export interface TemplateInfo {
  name: string;
}

export interface Recipient {
  type: string;
  value: string;
}

export interface SendMessageRequest {
  template: TemplateInfo;
  recipient: Recipient;
  channel: string;
  templateVariables?: Record<string, any>;
}

export interface MessageData {
  notificationId: string;
}

export interface StatusData {
  status: string;
}

export interface ReplyData {
  text: string;
  user: string;
  ts: string;
  threadTs: string;
}

export type SendMessageResponse = BaseAPIResponse<MessageData>;
export type MessageStatusResponse = BaseAPIResponse<StatusData>;
export type MessageRepliesResponse = BaseAPIResponse<ReplyData[]>; 