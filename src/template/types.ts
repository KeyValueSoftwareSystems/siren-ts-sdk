/**
 * Template and Channel Template Types
 */

/**
 * Base interface for template configuration.
 */
export interface TemplateConfig {
  /** SMS channel configuration */
  SMS?: {
    /** Message body */
    body: string;
    /** Channel type */
    channel: 'SMS';
    /** Whether the message is a flash message */
    isFlash: boolean;
    /** Whether the message contains Unicode characters */
    isUnicode: boolean;
  };
  /** Email channel configuration */
  EMAIL?: {
    /** Email subject */
    subject: string;
    /** Channel type */
    channel: 'EMAIL';
    /** Email body */
    body: string;
    /** List of attachments */
    attachments: any[];
    /** Whether the body contains raw HTML */
    isRawHTML: boolean;
    /** Whether the body is plain text */
    isPlainText: boolean;
  };
  /** Other channel configurations */
  [key: string]: any;
}

/**
 * Request interface for creating a new template.
 */
export interface CreateTemplateRequest {
  /** Name of the template */
  name: string;
  /** Description of the template */
  description: string;
  /** List of tags associated with the template */
  tagNames: string[];
  /** Template variables with default values */
  variables: Array<{
    name: string;
    defaultValue?: string;
  }>;
  /** Channel-specific template configurations */
  configurations: {
    SMS?: {
      body: string;
      channel: 'SMS';
      isFlash?: boolean;
      isUnicode?: boolean;
    };
    EMAIL?: {
      subject: string;
      channel: 'EMAIL';
      body: string;
      attachments?: any[];
      isRawHTML?: boolean;
      isPlainText?: boolean;
    };
    [key: string]: any;
  };
}

/**
 * Request interface for updating an existing template.
 */
export interface UpdateTemplateRequest {
  /** Name of the template */
  name: string;
  /** Description of the template */
  description?: string;
  /** List of tags associated with the template */
  tagNames?: string[];
  /** Template variables with default values */
  variables?: Array<{
    name: string;
    defaultValue?: string;
  }>;
  /** Channel-specific template configurations */
  configurations?: {
    SMS?: {
      body: string;
      channel: 'SMS';
      isFlash?: boolean;
      isUnicode?: boolean;
    };
    EMAIL?: {
      subject: string;
      channel: 'EMAIL';
      body: string;
      attachments?: any[];
      isRawHTML?: boolean;
      isPlainText?: boolean;
    };
    [key: string]: any;
  };
}

/**
 * Response data for template operations.
 */
export interface TemplateData {
  /** Unique identifier of the template */
  templateId: string;
  /** Name of the template */
  templateName: string;
  /** ID of the draft version */
  draftVersionId: string;
  /** List of channel templates */
  channelTemplateList: Array<{
    channel: string;
    configuration: any;
  }>;
}

/**
 * Query parameters for getting templates.
 */
export interface GetTemplatesQuery {
  /** Filter by tag names */
  tagNames?: string;
  /** Search query */
  search?: string;
  /** Sort field */
  sort?: string;
  /** Page number */
  page?: number;
  /** Page size */
  size?: number;
}

/**
 * Template version information.
 */
export interface TemplateVersion {
  /** Unique identifier */
  id: string;
  /** Version number */
  version: number;
  /** Version status */
  status: 'DRAFT' | 'PUBLISHED_LATEST' | 'PUBLISHED';
  /** Publication timestamp */
  publishedAt: string | null;
}

/**
 * Template information.
 */
export interface Template {
  /** Unique identifier */
  id: string;
  /** Name of the template */
  name: string;
  /** Description of the template */
  description: string;
  /** Template variables */
  variables: Array<{
    name: string;
    defaultValue?: string;
  }>;
  /** List of tags */
  tags: string[];
  /** Draft version information */
  draftVersion?: TemplateVersion;
  /** Published version information */
  publishedVersion?: TemplateVersion;
  /** List of all versions */
  templateVersions: TemplateVersion[];
}

/**
 * SMS channel template configuration.
 */
export interface ChannelTemplateSMSConfig {
  /** Message body */
  body: string;
  /** Channel type */
  channel: 'SMS';
  /** Whether the message is a flash message */
  isFlash?: boolean;
  /** Whether the message contains Unicode characters */
  isUnicode?: boolean;
}

/**
 * Email channel template configuration.
 */
export interface ChannelTemplateEmailConfig {
  /** Email subject */
  subject: string;
  /** Channel type */
  channel: 'EMAIL';
  /** Email body */
  body: string;
  /** List of attachments */
  attachments?: any[];
  /** Whether the body contains raw HTML */
  isRawHTML?: boolean;
  /** Whether the body is plain text */
  isPlainText?: boolean;
}

/**
 * Request interface for creating channel templates.
 */
export interface CreateChannelTemplateRequest {
  /** SMS configuration */
  SMS?: ChannelTemplateSMSConfig;
  /** Email configuration */
  EMAIL?: ChannelTemplateEmailConfig;
  /** Other channel configurations */
  [key: string]: any;
}

/**
 * Query parameters for getting channel templates.
 */
export interface GetChannelTemplatesQuery {
  /** Filter by channel */
  channel?: string;
  /** Search query */
  search?: string;
  /** Sort field */
  sort?: string;
  /** Page number */
  page?: number;
  /** Page size */
  size?: number;
}

/**
 * Channel template information.
 */
export interface ChannelTemplate {
  /** Channel type */
  channel: string;
  /** Channel-specific configuration */
  configuration: ChannelTemplateSMSConfig | ChannelTemplateEmailConfig;
} 