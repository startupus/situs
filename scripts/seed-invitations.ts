#!/usr/bin/env tsx
import { PrismaClient, InvitationStatus, CommunicationChannel, GlobalRole } from '@prisma/client';

/**
 * Сид демо-приглашения для e2e:
 * - токен: token3456789012cdefgh
 * - email: staff-member@example.com
 */
async function run() {
  const prisma = new PrismaClient();
  try {
    console.log('🌱 Seeding demo invitation for e2e...');

    // Гарантируем наличие отправителя (admin@situs.local или создаём)
    let inviter = await prisma.user.findFirst({ where: { email: 'admin@situs.local' } });
    if (!inviter) {
      inviter = await prisma.user.upsert({
        where: { email: 'admin@situs.local' },
        update: { globalRole: 'SUPER_ADMIN' as GlobalRole },
        create: {
          username: 'admin',
          email: 'admin@situs.local',
          password: 'admin',
          globalRole: 'SUPER_ADMIN' as GlobalRole,
          status: 'ACTIVE' as any,
        },
      });
    }

    const token = 'token3456789012cdefgh';
    const email = 'staff-member@example.com';
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await prisma.invitation.upsert({
      where: { token },
      update: {
        email,
        role: 'STAFF' as GlobalRole,
        status: InvitationStatus.PENDING,
        expiresAt,
        invitedBy: inviter.id,
        channel: CommunicationChannel.EMAIL,
      },
      create: {
        email,
        role: 'STAFF' as GlobalRole,
        status: InvitationStatus.PENDING,
        token,
        message: 'E2E demo invite',
        channel: CommunicationChannel.EMAIL,
        invitedBy: inviter.id,
        expiresAt,
      },
    });

    console.log('✅ Demo invitation ensured');
  } catch (e) {
    console.error('❌ Seed invitations error:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

run();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Создание демонстрационных приглашений...');

  // Получаем существующих пользователей для создания приглашений от их имени
  const users = await prisma.user.findMany({
    take: 2,
    select: { id: true, email: true },
  });

  if (users.length === 0) {
    console.log('❌ Нет пользователей для создания приглашений');
    return;
  }

  const inviter = users[0];

  // Создаем различные типы приглашений
  const invitations = [
    {
      email: 'new-business@example.com',
      role: 'BUSINESS',
      status: 'PENDING',
      token: 'demo-token-business-001',
      message: 'Добро пожаловать в нашу платформу! Мы рады видеть вас в качестве бизнес-партнера.',
      channel: 'EMAIL',
      invitedBy: inviter.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
      sentAt: new Date(),
    },
    {
      email: 'agency-partner@example.com',
      role: 'AGENCY',
      status: 'PENDING',
      token: 'demo-token-agency-002',
      message: 'Приглашаем вас стать нашим агентством-партнером!',
      channel: 'EMAIL',
      invitedBy: inviter.id,
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 дней
      sentAt: new Date(),
    },
    {
      email: 'staff-member@example.com',
      role: 'STAFF',
      status: 'PENDING',
      token: 'demo-token-staff-003',
      message: 'Добро пожаловать в команду!',
      channel: 'EMAIL',
      invitedBy: inviter.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
      sentAt: new Date(),
    },
    {
      email: 'expired-invite@example.com',
      role: 'BUSINESS',
      status: 'EXPIRED',
      token: 'demo-token-expired-004',
      message: 'Это приглашение истекло',
      channel: 'EMAIL',
      invitedBy: inviter.id,
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // вчера
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // позавчера
    },
    {
      email: 'cancelled-invite@example.com',
      role: 'BUSINESS',
      status: 'CANCELLED',
      token: 'demo-token-cancelled-005',
      message: 'Это приглашение было отменено',
      channel: 'EMAIL',
      invitedBy: inviter.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sentAt: new Date(),
    },
  ];

  // Создаем приглашения, если они еще не существуют
  for (const invitationData of invitations) {
    const existing = await prisma.invitation.findFirst({
      where: { email: invitationData.email },
    });

    if (!existing) {
      await prisma.invitation.create({
        data: invitationData,
      });
      console.log(`✅ Создано приглашение для ${invitationData.email} (${invitationData.status})`);
    } else {
      console.log(`⏭️  Приглашение для ${invitationData.email} уже существует`);
    }
  }

  // Создаем настройки каналов связи
  console.log('\n🌱 Создание настроек каналов связи...');

  const channels = [
    {
      channel: 'EMAIL',
      enabled: true,
      config: {
        smtp: {
          host: 'smtp.example.com',
          port: 587,
          secure: false,
          auth: {
            user: 'noreply@example.com',
            pass: 'your-email-password',
          },
        },
      },
      inviteTemplate: `
        Здравствуйте!
        
        Вы приглашены присоединиться к нашей платформе.
        
        Для принятия приглашения перейдите по ссылке:
        {{inviteLink}}
        
        Приглашение действительно до: {{expiresAt}}
        
        С уважением,
        Команда Situs
      `,
      reminderTemplate: `
        Напоминаем, что у вас есть неиспользованное приглашение.
        
        Ссылка: {{inviteLink}}
        Истекает: {{expiresAt}}
      `,
    },
    {
      channel: 'SMS',
      enabled: false,
      config: {
        provider: 'twilio',
        accountSid: 'your-twilio-sid',
        authToken: 'your-twilio-token',
        fromNumber: '+1234567890',
      },
      inviteTemplate: 'Приглашение: {{inviteLink}} (до {{expiresAt}})',
      reminderTemplate: 'Напоминание о приглашении: {{inviteLink}}',
    },
    {
      channel: 'TELEGRAM',
      enabled: false,
      config: {
        botToken: 'your-telegram-bot-token',
        chatId: 'your-chat-id',
      },
      inviteTemplate: `
        🎉 Приглашение на платформу!
        
        Ссылка: {{inviteLink}}
        Действительно до: {{expiresAt}}
      `,
      reminderTemplate: '⏰ Напоминание о приглашении: {{inviteLink}}',
    },
    {
      channel: 'WHATSAPP',
      enabled: false,
      config: {
        provider: 'twilio',
        accountSid: 'your-twilio-sid',
        authToken: 'your-twilio-token',
        fromNumber: 'whatsapp:+1234567890',
      },
      inviteTemplate: 'Приглашение: {{inviteLink}}',
      reminderTemplate: 'Напоминание: {{inviteLink}}',
    },
    {
      channel: 'SLACK',
      enabled: false,
      config: {
        webhookUrl: 'https://hooks.slack.com/services/...',
        channel: '#invitations',
      },
      inviteTemplate: `
        Новое приглашение отправлено!
        Email: {{email}}
        Ссылка: {{inviteLink}}
      `,
      reminderTemplate: 'Напоминание о приглашении для {{email}}',
    },
  ];

  for (const channelData of channels) {
    const existing = await prisma.communicationSettings.findUnique({
      where: { channel: channelData.channel as any },
    });

    if (!existing) {
      await prisma.communicationSettings.create({
        data: channelData as any,
      });
      console.log(
        `✅ Создана настройка канала ${channelData.channel} (${channelData.enabled ? 'включен' : 'выключен'})`,
      );
    } else {
      console.log(`⏭️  Настройка канала ${channelData.channel} уже существует`);
    }
  }

  console.log('\n🎉 Демонстрационные данные для системы приглашений созданы!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при создании демонстрационных данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
