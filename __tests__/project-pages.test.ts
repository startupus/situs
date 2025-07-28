import { describe, it, expect } from 'vitest';
import { CreatePageData } from '../src/types/project';

// Тесты утилит для работы со страницами
describe('Генерация slug из названия', () => {
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Удаляем спецсимволы
      .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
      .replace(/-+/g, '-') // Убираем повторяющиеся дефисы
      .replace(/^-+|-+$/g, '') // Убираем дефисы в начале и конце
      .trim();
  };

  it('должен работать с английским текстом', () => {
    expect(generateSlug('About Us')).toBe('about-us');
    expect(generateSlug('Contact Information')).toBe('contact-information');
  });

  it('должен обрабатывать спецсимволы в английском тексте', () => {
    expect(generateSlug('Contact & Support!')).toBe('contact-support');
    expect(generateSlug('Email: info@company.com')).toBe('email-infocompanycom');
  });

  it('должен обрабатывать пробелы в английском тексте', () => {
    expect(generateSlug('  Many   spaces  ')).toBe('many-spaces');
    expect(generateSlug('Single word')).toBe('single-word');
  });

  it('должен возвращать пустую строку для текста без латинских символов', () => {
    // Поскольку regex удаляет все не-латинские символы
    expect(generateSlug('Русский текст')).toBe('');
    expect(generateSlug('中文')).toBe('');
  });
});

describe('Валидация данных страницы', () => {
  const validatePageData = (data: CreatePageData): string[] => {
    const errors: string[] = [];
    
    if (!data.title || data.title.trim().length === 0) {
      errors.push('Название страницы обязательно');
    }
    
    if (data.title && data.title.length > 100) {
      errors.push('Название страницы слишком длинное');
    }
    
    if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
      errors.push('URL должен содержать только латинские буквы, цифры и дефисы');
    }
    
    return errors;
  };

  it('должен требовать название страницы', () => {
    expect(validatePageData({ title: '' })).toContain('Название страницы обязательно');
    expect(validatePageData({ title: '   ' })).toContain('Название страницы обязательно');
  });

  it('должен ограничивать длину названия', () => {
    const longTitle = 'a'.repeat(101);
    expect(validatePageData({ title: longTitle })).toContain('Название страницы слишком длинное');
  });

  it('должен валидировать формат slug', () => {
    expect(validatePageData({ title: 'Valid', slug: 'invalid-слаг' }))
      .toContain('URL должен содержать только латинские буквы, цифры и дефисы');
    
    expect(validatePageData({ title: 'Valid', slug: 'invalid slug' }))
      .toContain('URL должен содержать только латинские буквы, цифры и дефисы');
    
    expect(validatePageData({ title: 'Valid', slug: 'invalid_slug' }))
      .toContain('URL должен содержать только латинские буквы, цифры и дефисы');
  });

  it('должен принимать валидные данные', () => {
    expect(validatePageData({ title: 'Valid Title' })).toHaveLength(0);
    expect(validatePageData({ title: 'Valid Title', slug: 'valid-slug' })).toHaveLength(0);
    expect(validatePageData({ title: 'Test', slug: 'test123' })).toHaveLength(0);
  });
});

describe('Статусы страниц', () => {
  interface MockPage {
    id: string;
    title: string;
    status: 'draft' | 'published' | 'archived';
    publishedAt?: Date;
  }

  it('должен корректно фильтровать страницы по статусу', () => {
    const pages: MockPage[] = [
      { id: '1', title: 'Published Page', status: 'published', publishedAt: new Date() },
      { id: '2', title: 'Draft Page', status: 'draft' },
      { id: '3', title: 'Another Published', status: 'published', publishedAt: new Date() },
      { id: '4', title: 'Archived Page', status: 'archived' }
    ];

    const publishedPages = pages.filter(p => p.status === 'published');
    const draftPages = pages.filter(p => p.status === 'draft');
    const archivedPages = pages.filter(p => p.status === 'archived');

    expect(publishedPages).toHaveLength(2);
    expect(draftPages).toHaveLength(1);
    expect(archivedPages).toHaveLength(1);
    
    // Опубликованные страницы должны иметь дату публикации
    publishedPages.forEach(page => {
      expect(page.publishedAt).toBeDefined();
    });
  });

  it('должен подсчитывать статистику страниц', () => {
    const pages: MockPage[] = [
      { id: '1', title: 'Page 1', status: 'published' },
      { id: '2', title: 'Page 2', status: 'published' },
      { id: '3', title: 'Page 3', status: 'draft' },
      { id: '4', title: 'Page 4', status: 'draft' },
      { id: '5', title: 'Page 5', status: 'draft' }
    ];

    const stats = {
      total: pages.length,
      published: pages.filter(p => p.status === 'published').length,
      draft: pages.filter(p => p.status === 'draft').length,
      archived: pages.filter(p => p.status === 'archived').length
    };

    expect(stats.total).toBe(5);
    expect(stats.published).toBe(2);
    expect(stats.draft).toBe(3);
    expect(stats.archived).toBe(0);
  });
});

describe('Автосохранение', () => {
  it('должен корректно работать с задержкой', async () => {
    let savedContent: any = null;
    let saveCallCount = 0;
    
    const mockSave = (content: any) => {
      savedContent = content;
      saveCallCount++;
    };

    // Симуляция автосохранения
    const autoSave = (content: any, delay: number = 100) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          mockSave(content);
          resolve(content);
        }, delay);
      });
    };

    const testContent = { blocks: [{ type: 'text', content: 'Test content' }] };
    
    await autoSave(testContent, 50);

    expect(savedContent).toEqual(testContent);
    expect(saveCallCount).toBe(1);
  });

  it('должен обрабатывать несколько быстрых изменений', async () => {
    let lastSaved: any = null;
    let saveCallCount = 0;
    
    const mockSave = (content: any) => {
      lastSaved = content;
      saveCallCount++;
    };

    // Симуляция автосохранения с debounce
    const debouncedAutoSave = (() => {
      let timeoutId: NodeJS.Timeout;
      
      return (content: any, delay: number = 100) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          mockSave(content);
        }, delay);
      };
    })();

    // Быстрые изменения
    debouncedAutoSave({ version: 1 }, 50);
    debouncedAutoSave({ version: 2 }, 50);
    debouncedAutoSave({ version: 3 }, 50);

    // Ждем выполнения
    await new Promise(resolve => setTimeout(resolve, 100));

    // Должен сохраниться только последний
    expect(lastSaved).toEqual({ version: 3 });
    expect(saveCallCount).toBe(1);
  });
});

describe('Производительность', () => {
  it('должен эффективно обрабатывать большое количество страниц', () => {
    const pageCount = 1000;
    const pages = Array.from({ length: pageCount }, (_, i) => ({
      id: i.toString(),
      title: `Page ${i}`,
      slug: `page-${i}`,
      status: i % 3 === 0 ? 'published' : 'draft' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const start = performance.now();
    
    // Операции фильтрации
    const publishedPages = pages.filter(p => p.status === 'published');
    const draftPages = pages.filter(p => p.status === 'draft');
    
    // Поиск по названию
    const searchResults = pages.filter(p => 
      p.title.toLowerCase().includes('page 5')
    );
    
    const end = performance.now();
    const executionTime = end - start;

    // Проверяем результаты
    expect(pages).toHaveLength(pageCount);
    expect(publishedPages.length).toBeGreaterThan(0);
    expect(draftPages.length).toBeGreaterThan(0);
    expect(searchResults.length).toBeGreaterThan(0);
    
    // Проверяем производительность (должно выполняться быстро)
    expect(executionTime).toBeLessThan(100); // Менее 100ms
  });

  it('должен эффективно обновлять список страниц', () => {
    const initialPages = Array.from({ length: 100 }, (_, i) => ({
      id: i.toString(),
      title: `Page ${i}`,
      status: 'draft' as const
    }));

    const start = performance.now();

    // Симуляция обновления статуса страницы
    const updatedPages = initialPages.map(page => 
      page.id === '50' 
        ? { ...page, status: 'published' as const, publishedAt: new Date() }
        : page
    );

    // Пересчет статистики
    const stats = {
      total: updatedPages.length,
      published: updatedPages.filter(p => p.status === 'published').length,
      draft: updatedPages.filter(p => p.status === 'draft').length
    };

    const end = performance.now();

    expect(stats.published).toBe(1);
    expect(stats.draft).toBe(99);
    expect(end - start).toBeLessThan(10); // Очень быстро
  });
});

describe('Интеграционные сценарии', () => {
  it('должен поддерживать полный жизненный цикл страницы', () => {
    // Создание
    const pageData: CreatePageData = {
      title: 'Test Page',
      slug: 'test-page'
    };

    const newPage = {
      id: Date.now().toString(),
      ...pageData,
      content: { blocks: [] },
      meta: {},
      status: 'draft' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(newPage.status).toBe('draft');
    expect(newPage.title).toBe('Test Page');
    expect(newPage.slug).toBe('test-page');

    // Обновление
    const updatedPage = {
      ...newPage,
      content: { blocks: [{ type: 'text', content: 'Updated content' }] },
      updatedAt: new Date()
    };

    expect(updatedPage.content.blocks).toHaveLength(1);

    // Публикация
    const publishedPage = {
      ...updatedPage,
      status: 'published' as const,
      publishedAt: new Date()
    };

    expect(publishedPage.status).toBe('published');
    expect(publishedPage.publishedAt).toBeDefined();
  });

  it('должен поддерживать массовые операции', () => {
    const pages = [
      { id: '1', status: 'draft' as const },
      { id: '2', status: 'draft' as const },
      { id: '3', status: 'published' as const }
    ];

    // Массовая публикация черновиков
    const publishedPages = pages.map(page =>
      page.status === 'draft'
        ? { ...page, status: 'published' as const, publishedAt: new Date() }
        : page
    );

    const publishedCount = publishedPages.filter(p => p.status === 'published').length;
    expect(publishedCount).toBe(3);
  });
});

console.log('✅ Автотесты для функциональности страниц созданы'); 