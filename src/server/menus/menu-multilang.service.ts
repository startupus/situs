import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MenusService } from './menus.service';
import { MenuItem } from '@prisma/client';

/**
 * Сервис для мультиязычной работы с меню
 * Реализует фильтрацию и приоритизацию по языкам
 */
@Injectable()
export class MenuMultilangService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly menusService: MenusService
  ) {}

  /**
   * Получение пунктов меню с учетом языка
   * Приоритет: конкретный язык > универсальные (*) > fallback язык
   */
  async getMenuItemsByLanguage(
    menuTypeId: string,
    currentLanguage: string,
    fallbackLanguage: string = 'en-GB'
  ): Promise<MenuItem[]> {
    // Получаем все пункты меню для типа
    const allItems = await this.prisma.menuItem.findMany({
      where: {
        menuTypeId,
        isPublished: true
      },
      orderBy: [
        { level: 'asc' },
        { orderIndex: 'asc' }
      ]
    });

    // Группируем по alias для обработки языковых вариантов
    const itemsByAlias = new Map<string, MenuItem[]>();
    
    for (const item of allItems) {
      const key = item.alias;
      if (!itemsByAlias.has(key)) {
        itemsByAlias.set(key, []);
      }
      itemsByAlias.get(key)!.push(item);
    }

    // Выбираем лучший вариант для каждого alias
    const resultItems: MenuItem[] = [];
    
    for (const [alias, variants] of itemsByAlias) {
      const selectedItem = this.selectBestLanguageVariant(
        variants,
        currentLanguage,
        fallbackLanguage
      );
      
      if (selectedItem) {
        resultItems.push(selectedItem);
      }
    }

    // Сортируем итоговый список
    return resultItems.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.orderIndex - b.orderIndex;
    });
  }

  /**
   * Выбор лучшего языкового варианта пункта меню
   */
  private selectBestLanguageVariant(
    variants: MenuItem[],
    currentLanguage: string,
    fallbackLanguage: string
  ): MenuItem | null {
    if (variants.length === 0) return null;
    if (variants.length === 1) return variants[0];

    // Приоритет 1: точное совпадение языка
    const exactMatch = variants.find(v => v.language === currentLanguage);
    if (exactMatch) return exactMatch;

    // Приоритет 2: универсальные пункты (*)
    const universalMatch = variants.find(v => v.language === '*');
    if (universalMatch) return universalMatch;

    // Приоритет 3: fallback язык
    const fallbackMatch = variants.find(v => v.language === fallbackLanguage);
    if (fallbackMatch) return fallbackMatch;

    // Приоритет 4: первый доступный
    return variants[0];
  }

  /**
   * Поиск аналогичного пункта меню на другом языке
   * Для переключения языка с сохранением контекста
   */
  async findEquivalentMenuItem(
    currentItemId: string,
    targetLanguage: string
  ): Promise<MenuItem | null> {
    // Получаем текущий пункт меню
    const currentItem = await this.prisma.menuItem.findUnique({
      where: { id: currentItemId }
    });

    if (!currentItem) return null;

    // Ищем аналогичный пункт на целевом языке
    const equivalent = await this.prisma.menuItem.findFirst({
      where: {
        menuTypeId: currentItem.menuTypeId,
        alias: currentItem.alias,
        language: targetLanguage,
        isPublished: true
      }
    });

    if (equivalent) return equivalent;

    // Если точного соответствия нет, ищем универсальный
    const universal = await this.prisma.menuItem.findFirst({
      where: {
        menuTypeId: currentItem.menuTypeId,
        alias: currentItem.alias,
        language: '*',
        isPublished: true
      }
    });

    return universal;
  }

  /**
   * Получение доступных языков для типа меню
   */
  async getAvailableLanguages(menuTypeId: string): Promise<string[]> {
    const languages = await this.prisma.menuItem.findMany({
      where: {
        menuTypeId,
        isPublished: true
      },
      select: {
        language: true
      },
      distinct: ['language']
    });

    return languages
      .map(l => l.language)
      .filter(lang => lang !== '*') // Исключаем универсальные
      .sort();
  }

  /**
   * Построение URL с учетом языка
   */
  buildLanguageUrl(
    basePath: string,
    language: string,
    defaultLanguage: string = 'en-GB'
  ): string {
    // Для языка по умолчанию не добавляем префикс
    if (language === defaultLanguage) {
      return basePath;
    }

    // Для других языков добавляем префикс
    const langCode = language.split('-')[0]; // ru-RU -> ru
    return `/${langCode}${basePath}`;
  }

  /**
   * Извлечение языка из URL
   */
  extractLanguageFromUrl(
    url: string,
    defaultLanguage: string = 'en-GB'
  ): { language: string; path: string } {
    const segments = url.split('/').filter(s => s.length > 0);
    
    if (segments.length === 0) {
      return { language: defaultLanguage, path: '/' };
    }

    const firstSegment = segments[0];
    
    // Проверяем, является ли первый сегмент кодом языка
    const languageCodes = ['ru', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'zh', 'ja'];
    
    if (languageCodes.includes(firstSegment)) {
      const language = this.expandLanguageCode(firstSegment);
      const path = '/' + segments.slice(1).join('/');
      return { language, path: path === '/' ? '/' : path };
    }

    return { language: defaultLanguage, path: url };
  }

  /**
   * Расширение кода языка до полного формата
   */
  private expandLanguageCode(code: string): string {
    const languageMap: { [key: string]: string } = {
      'ru': 'ru-RU',
      'en': 'en-GB',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-PT',
      'ar': 'ar-SA',
      'zh': 'zh-CN',
      'ja': 'ja-JP'
    };

    return languageMap[code] || `${code}-${code.toUpperCase()}`;
  }
}
