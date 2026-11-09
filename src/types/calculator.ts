export type Operator = '+' | '-' | '*' | '/' | '×' | '÷' | '−';

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorState {
  currentInput: string;
  expression: string;
  previousResult: string | null;
  history: CalculationHistoryItem[];
  hasError: boolean;
  errorMessage?: string;
  isJustEvaluated: boolean;
}
