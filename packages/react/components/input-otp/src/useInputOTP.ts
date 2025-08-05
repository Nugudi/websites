import type { ClipboardEvent, KeyboardEvent } from "react";
import { useCallback, useRef, useState } from "react";
import type { UseInputOTPProps, UseInputOTPReturn } from "./types";

export const useInputOTP = (props: UseInputOTPProps): UseInputOTPReturn => {
  const {
    length = 6,
    pattern = "[0-9]*",
    invalid,
    errorMessage,
    value: controlledValue,
    onChange,
    onBlur,
    onFocus,
    disabled,
    id,
    "aria-describedby": ariaDescribedBy,
  } = props;

  const [internalValue, setInternalValue] = useState("");

  // Controlled vs Uncontrolled 처리
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const setValue = isControlled
    ? (newValue: string) => {
        onChange?.(newValue);
      }
    : (newValue: string) => {
        setInternalValue(newValue);
        onChange?.(newValue);
      };
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /**
   * 입력값이 지정된 패턴에 맞는지 검증
   */
  const validateInput = useCallback(
    (input: string) => {
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(input);
    },
    [pattern],
  );

  /**
   * 입력값 변경 처리
   * - 단일 문자 입력 및 다중 문자 붙여넣기 지원
   * - 자동 포커스 이동
   */
  const handleInputChange = useCallback(
    (index: number, inputValue: string) => {
      if (disabled) return;

      // 빈 문자열은 항상 허용 (삭제 허용)
      if (inputValue !== "" && !validateInput(inputValue)) {
        return;
      }

      if (inputValue.length > 1) {
        const pastedValue = inputValue.slice(0, length - index);
        const newValue = value.split("");

        for (let i = 0; i < pastedValue.length; i++) {
          if (index + i < length) {
            // 각 문자가 패턴에 맞는지 검증
            if (validateInput(pastedValue[i])) {
              newValue[index + i] = pastedValue[i];
            }
          }
        }

        const updatedValue = newValue.join("");
        setValue(updatedValue);
        onChange?.(updatedValue);

        const nextIndex = Math.min(index + pastedValue.length, length - 1);
        inputRefs.current[nextIndex]?.focus();

        return;
      }

      const newValue = value.split("");
      newValue[index] = inputValue;
      const updatedValue = newValue.join("");

      setValue(updatedValue);
      onChange?.(updatedValue);

      if (inputValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [length, value, onChange, disabled, validateInput, setValue],
  );

  /**
   * 키보드 이벤트 처리
   * - Backspace: 현재 입력 삭제 및 이전 칸로 이동
   * - Arrow Keys: 좌우 네비게이션
   */
  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (e.key === "Backspace") {
        e.preventDefault();

        if (value[index]) {
          const newValue = value.split("");
          newValue[index] = "";
          const updatedValue = newValue.join("");
          setValue(updatedValue);
          onChange?.(updatedValue);
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus();
          const newValue = value.split("");
          newValue[index - 1] = "";
          const updatedValue = newValue.join("");
          setValue(updatedValue);
          onChange?.(updatedValue);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    },
    [value, onChange, length, disabled, setValue],
  );

  /**
   * 입력 칸 포커스 처리
   * - 포커스 시 전체 텍스트 선택
   */
  const handleFocus = useCallback((index: number) => {
    inputRefs.current[index]?.select();
  }, []);

  /**
   * 붙여넣기 이벤트 처리
   * - 클립보드 데이터에서 패턴에 맞는 문자만 필터링
   * - 자동 포커스 이동
   */
  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      e.preventDefault();
      const pastedData = e.clipboardData.getData("text/plain").slice(0, length);

      // 붙여넣기 데이터에서 패턴에 맞는 문자만 필터링
      const filteredData = pastedData
        .split("")
        .filter((char) => validateInput(char))
        .join("");

      setValue(filteredData);
      onChange?.(filteredData);

      inputRefs.current[Math.min(filteredData.length, length - 1)]?.focus();
    },
    [length, onChange, disabled, validateInput, setValue],
  );

  const errorId = errorMessage && id ? `${id}-error` : undefined;

  const containerProps = {
    id,
    "aria-invalid": invalid,
    "aria-describedby":
      [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined,
    onFocus,
    onBlur,
  };

  return {
    value,
    inputRefs,
    handleInputChange,
    handleKeyDown,
    handleFocus,
    handlePaste,
    containerProps,
  };
};
