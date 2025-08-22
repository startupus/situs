import React, { useRef } from "react";

export default function VerificationCodeInput1() {
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleInput = (index: number, event: React.FormEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const value = target.textContent || '';
    
    // Ограничиваем ввод одной цифрой
    if (value.length > 1) {
      target.textContent = value.slice(-1);
    }
    
    // Переходим к следующему полю при вводе цифры
    if (value.length === 1 && /\d/.test(value) && index < 3) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLDivElement>) => {
    // Переходим к предыдущему полю при Backspace
    if (event.key === 'Backspace') {
      const target = event.target as HTMLDivElement;
      if (!target.textContent && index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  return (
    <section className="bg-white py-10 dark:bg-dark">
      <div className="container">
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              contentEditable
              suppressContentEditableWarning={true}
              onInput={(e) => handleInput(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="shadow-2xs flex min-w-[64px] max-w-[64px] h-[64px] items-center justify-center rounded-lg border border-stroke bg-white text-2xl font-medium text-dark dark:text-white outline-hidden sm:text-4xl dark:border-dark-3 dark:bg-white/5 focus:border-primary"
            >
              0
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
