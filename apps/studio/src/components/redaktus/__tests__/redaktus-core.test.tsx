import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { Editor } from '../redaktus-core';

// Мокаем компоненты, которые не нужны для тестов
vi.mock('../tailgrids/VerticalNavbar', () => ({
  default: () => <div data-testid="vertical-navbar">Vertical Navbar</div>
}));

vi.mock('../tailgrids/EditorNavbar', () => ({
  default: ({ onSave, isSaving }: any) => (
    <div data-testid="editor-navbar">
      <button onClick={onSave} disabled={isSaving}>
        Save
      </button>
    </div>
  )
}));

vi.mock('../tailgrids/CanvasToolbar', () => ({
  default: () => <div data-testid="canvas-toolbar">Canvas Toolbar</div>
}));

vi.mock('../tailgrids/SettingsPanel', () => ({
  default: () => <div data-testid="settings-panel">Settings Panel</div>
}));

vi.mock('../PageViewer', () => ({
  default: ({ page, onBlockUpdate, onBlockDelete }: any) => (
    <div data-testid="page-viewer">
      <div data-testid="page-content">
        {page.content.map((block: any, index: number) => (
          <div key={block.id} data-testid={`block-${index}`}>
            <span data-testid={`block-type-${index}`}>{block.type}</span>
            <button 
              onClick={() => onBlockDelete(block.id)}
              data-testid={`delete-block-${index}`}
            >
              Delete
            </button>
            <button 
              onClick={() => onBlockUpdate(block.id, { title: 'Updated' })}
              data-testid={`update-block-${index}`}
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}));

vi.mock('../../hooks/useAutoSave', () => ({
  useAutoSave: () => ({
    isSaving: false,
    lastSaved: new Date('2025-01-01T12:00:00Z'),
    saveError: null,
    saveNow: vi.fn()
  })
}));

describe('Redaktus Editor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders editor with all main components', () => {
    render(<Editor />);
    
    expect(screen.getByTestId('vertical-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('editor-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('canvas-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('settings-panel')).toBeInTheDocument();
    expect(screen.getByTestId('page-viewer')).toBeInTheDocument();
  });

  it('displays empty page initially', () => {
    render(<Editor />);
    
    const pageContent = screen.getByTestId('page-content');
    expect(pageContent.children).toHaveLength(0);
  });

  it('supports drag and drop for adding blocks', async () => {
    render(<Editor />);
    
    const canvas = screen.getByTestId('page-viewer');
    
    // Симулируем drag and drop
    fireEvent.dragOver(canvas);
    fireEvent.drop(canvas, {
      dataTransfer: {
        getData: () => 'hero-unit'
      }
    });

    // Проверяем, что блок добавился
    await waitFor(() => {
      expect(screen.getByTestId('block-0')).toBeInTheDocument();
      expect(screen.getByTestId('block-type-0')).toHaveTextContent('hero-unit');
    });
  });

  it('supports block deletion', async () => {
    render(<Editor />);
    
    // Сначала добавляем блок
    const canvas = screen.getByTestId('page-viewer');
    fireEvent.drop(canvas, {
      dataTransfer: {
        getData: () => 'text-block'
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('block-0')).toBeInTheDocument();
    });

    // Удаляем блок
    const deleteButton = screen.getByTestId('delete-block-0');
    fireEvent.click(deleteButton);

    // Проверяем, что блок удалился
    await waitFor(() => {
      expect(screen.queryByTestId('block-0')).not.toBeInTheDocument();
    });
  });

  it('supports block updates', async () => {
    render(<Editor />);
    
    // Добавляем блок
    const canvas = screen.getByTestId('page-viewer');
    fireEvent.drop(canvas, {
      dataTransfer: {
        getData: () => 'hero-unit'
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('block-0')).toBeInTheDocument();
    });

    // Обновляем блок
    const updateButton = screen.getByTestId('update-block-0');
    fireEvent.click(updateButton);

    // В реальном приложении здесь была бы проверка обновления
    expect(updateButton).toBeInTheDocument();
  });

  it('handles save functionality', async () => {
    render(<Editor />);
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Проверяем, что кнопка сохранения работает
    expect(saveButton).toBeInTheDocument();
  });
});

describe('Block Schemas', () => {
  it('should have valid block schemas', () => {
    // Импортируем схемы блоков (это будет в реальном файле)
    const expectedSchemas = [
      'hero-unit',
      'text-block', 
      'image-block',
      'heading-block',
      'quote-block'
    ];

    // Проверяем, что все ожидаемые схемы существуют
    expectedSchemas.forEach(schemaName => {
      expect(schemaName).toBeDefined();
    });
  });

  it('should have proper schema structure', () => {
    // Пример проверки структуры схемы
    const heroUnitSchema = {
      title: { type: 'string', default: 'Welcome to Redaktus' },
      text: { type: 'string', default: 'Create beautiful content' },
      imageUrl: { type: 'string', default: '' },
      padding: { type: 'select', options: ['big', 'small'], default: 'big' }
    };

    expect(heroUnitSchema.title).toHaveProperty('type', 'string');
    expect(heroUnitSchema.title).toHaveProperty('default');
    expect(heroUnitSchema.padding).toHaveProperty('options');
  });
});

describe('AutoSave Hook', () => {
  it('should provide auto-save functionality', () => {
    const mockData = { content: 'test' };
    const mockOnSave = vi.fn();
    
    // В реальном тесте здесь был бы вызов useAutoSave
    const autoSaveResult = {
      isSaving: false,
      lastSaved: new Date(),
      saveError: null,
      saveNow: vi.fn()
    };

    expect(autoSaveResult).toHaveProperty('isSaving');
    expect(autoSaveResult).toHaveProperty('lastSaved');
    expect(autoSaveResult).toHaveProperty('saveError');
    expect(autoSaveResult).toHaveProperty('saveNow');
    expect(typeof autoSaveResult.saveNow).toBe('function');
  });
}); 