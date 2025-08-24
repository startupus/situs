import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VerificationCodeInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  onChange?: (code: string) => void;
  value?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  length = 6,
  onComplete,
  onChange,
  value = '',
  disabled = false,
  error = false,
  className = ''
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Функция для обновления кода
  const updateCode = useCallback((newCode: string[]) => {
    setCode(newCode);
    const codeString = newCode.join('');
    onChange?.(codeString);
    
    if (codeString.length === length && !codeString.includes('')) {
      onComplete?.(codeString);
    }
  }, [length, onChange, onComplete]);

  // Синхронизируем внешнее значение с внутренним состоянием
  useEffect(() => {
    if (value !== code.join('')) {
      const newCode = value.split('').slice(0, length);
      while (newCode.length < length) {
        newCode.push('');
      }
      setCode(newCode);
    }
  }, [value, length]);

  // Функция для фокуса на определенном поле
  const focusInput = useCallback((index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.focus();
      setFocusedIndex(index);
    }
  }, []);

  // Обработка изменения в поле
  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return;

    // Разрешаем только цифры
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    
    const newCode = [...code];
    newCode[index] = digit;
    
    updateCode(newCode);

    // Переходим к следующему полю, если введена цифра
    if (digit && index < length - 1) {
      focusInput(index + 1);
    }
  };

  // Обработка нажатия клавиш
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Backspace':
        e.preventDefault();
        const newCode = [...code];
        
        if (code[index]) {
          // Если в текущем поле есть значение, очищаем его
          newCode[index] = '';
          updateCode(newCode);
        } else if (index > 0) {
          // Если текущее поле пустое, переходим к предыдущему и очищаем его
          newCode[index - 1] = '';
          updateCode(newCode);
          focusInput(index - 1);
        }
        break;
        
      case 'Delete':
        e.preventDefault();
        const deleteCode = [...code];
        deleteCode[index] = '';
        updateCode(deleteCode);
        break;
        
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          focusInput(index - 1);
        }
        break;
        
      case 'ArrowRight':
        e.preventDefault();
        if (index < length - 1) {
          focusInput(index + 1);
        }
        break;
        
      default:
        // Для цифровых клавиш
        if (/^\d$/.test(e.key)) {
          e.preventDefault();
          const newCode = [...code];
          newCode[index] = e.key;
          updateCode(newCode);
          
          if (index < length - 1) {
            focusInput(index + 1);
          }
        }
        break;
    }
  };

  // Улучшенная обработка вставки из буфера обмена
  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    
    // Получаем данные из буфера обмена
    const pastedData = e.clipboardData.getData('text/plain');
    console.log('Pasted data:', pastedData);
    
    // Извлекаем только цифры
    const digits = pastedData.replace(/\D/g, '');
    console.log('Extracted digits:', digits);
    
    if (digits.length === 0) return;
    
    // Создаем новый код
    const newCode = Array(length).fill('');
    const maxDigits = Math.min(digits.length, length);
    
    for (let i = 0; i < maxDigits; i++) {
      newCode[i] = digits[i];
    }
    
    console.log('New code:', newCode);
    
    // Обновляем состояние
    updateCode(newCode);
    
    // Фокусируемся на следующем пустом поле или последнем заполненном
    const nextEmptyIndex = newCode.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(maxDigits, length - 1);
    
    setTimeout(() => {
      focusInput(focusIndex);
    }, 0);
  };

  // Обработка фокуса
  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  // Обработка клика - выделяем все содержимое
  const handleClick = (index: number) => {
    const input = inputRefs.current[index];
    if (input) {
      input.select();
    }
  };

  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      {code.map((digit, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          onClick={() => handleClick(index)}
          disabled={disabled}
          className={`
            flex w-12 h-12 items-center justify-center rounded-lg border text-center text-xl font-medium
            transition-all duration-200 outline-none
            ${error 
              ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10' 
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
            }
            ${disabled 
              ? 'cursor-not-allowed opacity-50' 
              : 'hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }
            ${focusedIndex === index && !disabled
              ? 'border-blue-500 ring-2 ring-blue-500/20'
              : ''
            }
            text-gray-900 dark:text-white
            sm:w-14 sm:h-14 sm:text-2xl
          `}
          autoComplete="off"
          data-testid={`code-input-${index}`}
        />
      ))}
    </div>
  );
};

export default VerificationCodeInput;