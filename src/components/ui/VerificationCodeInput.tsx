import React, { useState, useRef, useEffect } from 'react';

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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;

    // Разрешаем только цифры
    if (digit && !/^\d$/.test(digit)) return;

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    const codeString = newCode.join('');
    onChange?.(codeString);

    // Автоматически переходим к следующему полю
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Вызываем onComplete когда все поля заполнены
    if (codeString.length === length && !codeString.includes('')) {
      onComplete?.(codeString);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Backspace - переходим к предыдущему полю
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Стрелки влево/вправо для навигации
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Вставка из буфера обмена
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, length);
        const newCode = Array(length).fill('');
        for (let i = 0; i < digits.length; i++) {
          newCode[i] = digits[i];
        }
        setCode(newCode);
        onChange?.(newCode.join(''));
        
        if (digits.length === length) {
          onComplete?.(digits);
        }
        
        // Фокусируемся на следующем пустом поле или последнем
        const nextIndex = Math.min(digits.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    const newCode = Array(length).fill('');
    for (let i = 0; i < digits.length; i++) {
      newCode[i] = digits[i];
    }
    setCode(newCode);
    onChange?.(newCode.join(''));
    
    if (digits.length === length) {
      onComplete?.(digits);
    }
    
    // Фокусируемся на следующем пустом поле или последнем
    const nextIndex = Math.min(digits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
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
            text-gray-900 dark:text-white
            sm:w-14 sm:h-14 sm:text-2xl
          `}
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default VerificationCodeInput;
