import { BaseAPIResponse } from '../base/types';

export interface UserBase {
  uniqueId?: string;
  firstName?: string;
  lastName?: string;
  referenceId?: string;
  whatsapp?: string;
  activeChannels?: string[];
  active?: boolean;
  email?: string;
  phone?: string;
  attributes?: Record<string, any>;
}

export interface UserRequest extends UserBase {}

export interface User extends UserBase {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  avatarUrl?: string;
  sms?: string;
  pushToken?: string;
  inApp?: boolean;
  slack?: string;
  discord?: string;
  teams?: string;
  line?: string;
  customData?: Record<string, any>;
  segments?: string[];
}

export type UserAPIResponse = BaseAPIResponse<User>; 