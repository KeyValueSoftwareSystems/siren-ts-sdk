// Template and Channel Template Types

export interface CreateTemplateRequest {
  name: string;
  description: string;
  tagNames: string[];
  variables: Array<{
    name: string;
    defaultValue: string;
  }>;
  configurations: {
    SMS?: {
      body: string;
      channel: 'SMS';
      isFlash: boolean;
      isUnicode: boolean;
    };
    EMAIL?: {
      subject: string;
      channel: 'EMAIL';
      body: string;
      attachments: any[];
      isRawHTML: boolean;
      isPlainText: boolean;
    };
    [key: string]: any;
  };
}

export interface TemplateData {
  templateId: string;
  templateName: string;
  draftVersionId: string;
  channelTemplateList: any[];
}

export interface CreateTemplateResponse {
  data: TemplateData | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
  errors: Array<{
    errorCode: string;
    message: string;
  }> | null;
  meta: any | null;
}

export interface GetTemplatesQuery {
  tagNames?: string;
  search?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export interface TemplateVersion {
  id: string;
  version: number;
  status: string;
  publishedAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  variables: Array<{
    name: string;
    defaultValue: string;
  }>;
  tags: string[];
  draftVersion?: TemplateVersion;
  publishedVersion?: TemplateVersion;
  templateVersions?: TemplateVersion[];
}

export interface GetTemplatesResponse {
  data: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: Template[];
    number: number;
    sort: any;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    pageable: any;
    empty: boolean;
  } | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
  errors: Array<{
    errorCode: string;
    message: string;
  }> | null;
  meta: any | null;
}

export interface DeleteTemplateResponse {
  data: any | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
  errors: Array<{
    errorCode: string;
    message: string;
  }> | null;
  meta: any | null;
}

export interface PublishTemplateResponse {
  data: Template | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
  errors: Array<{
    errorCode: string;
    message: string;
  }> | null;
  meta: any | null;
}

export interface ChannelTemplateSMSConfig {
  body: string;
  channel: 'SMS';
  isFlash: boolean;
  isUnicode: boolean;
}

export interface ChannelTemplateEmailConfig {
  subject: string;
  channel: 'EMAIL';
  body: string;
  attachments: any[];
  isRawHTML: boolean;
  isPlainText: boolean;
}

export interface CreateChannelTemplateRequest {
  SMS?: ChannelTemplateSMSConfig;
  EMAIL?: ChannelTemplateEmailConfig;
  [key: string]: any;
}

export interface CreateChannelTemplateResponse {
  data: {
    SMS?: ChannelTemplateSMSConfig;
    EMAIL?: ChannelTemplateEmailConfig;
    [key: string]: any;
  } | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
  errors: Array<{
    errorCode: string;
    message: string;
  }> | null;
  meta: any | null;
}

export interface GetChannelTemplatesQuery {
  channel?: string;
  search?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export interface ChannelTemplate {
  channel: string;
  configuration: {
    channel: string;
    [key: string]: any;
  };
}

export interface GetChannelTemplatesResponse {
  data: {
    totalElements: number;
    totalPages: number;
    size: number;
    content: ChannelTemplate[];
    number: number;
    sort: any;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    pageable: any;
    empty: boolean;
  } | null;
  error: {
    errorCode: string;
    message: string;
  } | null;
  errors: Array<{
    errorCode: string;
    message: string;
  }> | null;
  meta: any | null;
} 