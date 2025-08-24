import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export enum CommunicationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  TELEGRAM = 'TELEGRAM',
  WHATSAPP = 'WHATSAPP',
  SLACK = 'SLACK'
}

export interface CommunicationMessage {
  to: string;
  subject?: string;
  content: string;
  template?: string;
  variables?: Record<string, any>;
}

export interface CommunicationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class CommunicationService {
  private readonly logger = new Logger(CommunicationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Отправка сообщения через указанный канал
   */
  async sendMessage(
    channel: CommunicationChannel,
    message: CommunicationMessage
  ): Promise<CommunicationResult> {
    try {
      // Получаем настройки канала
      const settings = await this.getChannelSettings(channel);
      
      if (!settings?.enabled) {
        throw new Error(`Канал ${channel} отключен`);
      }

      // Обрабатываем шаблон если указан
      const processedContent = message.template 
        ? this.processTemplate(message.template, message.variables || {})
        : message.content;

      // Отправляем через соответствующий провайдер
      switch (channel) {
        case CommunicationChannel.EMAIL:
          return await this.sendEmail(message.to, message.subject || 'Уведомление', processedContent, settings.config);
        
        case CommunicationChannel.SMS:
          return await this.sendSMS(message.to, processedContent, settings.config);
        
        case CommunicationChannel.TELEGRAM:
          return await this.sendTelegram(message.to, processedContent, settings.config);
        
        case CommunicationChannel.WHATSAPP:
          return await this.sendWhatsApp(message.to, processedContent, settings.config);
        
        case CommunicationChannel.SLACK:
          return await this.sendSlack(message.to, processedContent, settings.config);
        
        default:
          throw new Error(`Неподдерживаемый канал: ${channel}`);
      }
    } catch (error) {
      this.logger.error(`Ошибка отправки через ${channel}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      };
    }
  }

  /**
   * Получение настроек канала связи
   */
  async getChannelSettings(channel: CommunicationChannel) {
    return await this.prisma.communicationSettings.findUnique({
      where: { channel }
    });
  }

  /**
   * Обновление настроек канала связи
   */
  async updateChannelSettings(
    channel: CommunicationChannel,
    enabled: boolean,
    config: any,
    inviteTemplate?: string,
    reminderTemplate?: string
  ) {
    return await this.prisma.communicationSettings.upsert({
      where: { channel },
      update: {
        enabled,
        config,
        inviteTemplate,
        reminderTemplate,
      },
      create: {
        channel,
        enabled,
        config,
        inviteTemplate,
        reminderTemplate,
      }
    });
  }

  /**
   * Получение всех настроек каналов
   */
  async getAllChannelSettings() {
    return await this.prisma.communicationSettings.findMany({
      orderBy: { channel: 'asc' }
    });
  }

  /**
   * Обработка шаблона с переменными
   */
  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processed = processed.replace(regex, String(value));
    });
    
    return processed;
  }

  /**
   * Отправка email (MVP - только логирование)
   */
  private async sendEmail(
    to: string,
    subject: string,
    content: string,
    config: any
  ): Promise<CommunicationResult> {
    this.logger.log(`📧 EMAIL отправлен на ${to}`);
    this.logger.log(`Тема: ${subject}`);
    this.logger.log(`Содержание: ${content}`);
    this.logger.log(`Конфигурация: ${JSON.stringify(config, null, 2)}`);
    
    // В MVP просто возвращаем успех
    return {
      success: true,
      messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Отправка SMS (заглушка)
   */
  private async sendSMS(
    to: string,
    content: string,
    config: any
  ): Promise<CommunicationResult> {
    this.logger.log(`📱 SMS (заглушка) на ${to}: ${content}`);
    this.logger.log(`Конфигурация: ${JSON.stringify(config, null, 2)}`);
    
    return {
      success: false,
      error: 'SMS канал в разработке'
    };
  }

  /**
   * Отправка в Telegram (заглушка)
   */
  private async sendTelegram(
    to: string,
    content: string,
    config: any
  ): Promise<CommunicationResult> {
    this.logger.log(`📱 TELEGRAM (заглушка) на ${to}: ${content}`);
    this.logger.log(`Конфигурация: ${JSON.stringify(config, null, 2)}`);
    
    return {
      success: false,
      error: 'Telegram канал в разработке'
    };
  }

  /**
   * Отправка в WhatsApp (заглушка)
   */
  private async sendWhatsApp(
    to: string,
    content: string,
    config: any
  ): Promise<CommunicationResult> {
    this.logger.log(`📱 WHATSAPP (заглушка) на ${to}: ${content}`);
    this.logger.log(`Конфигурация: ${JSON.stringify(config, null, 2)}`);
    
    return {
      success: false,
      error: 'WhatsApp канал в разработке'
    };
  }

  /**
   * Отправка в Slack (заглушка)
   */
  private async sendSlack(
    to: string,
    content: string,
    config: any
  ): Promise<CommunicationResult> {
    this.logger.log(`💬 SLACK (заглушка) на ${to}: ${content}`);
    this.logger.log(`Конфигурация: ${JSON.stringify(config, null, 2)}`);
    
    return {
      success: false,
      error: 'Slack канал в разработке'
    };
  }
}
