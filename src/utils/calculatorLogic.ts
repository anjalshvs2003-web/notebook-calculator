/**
 * Calculator evaluation logic adhering strictly to standard operator precedence (BODMAS / PEMDAS)
 * and precision rounding.
 */

// Format numbers nicely without precision floating point errors
export function formatNumber(num: number): string {
  if (isNaN(num)) return 'Error';
  if (!isFinite(num)) return 'Cannot divide by 0';

  // Check if number is too large or too small
  const absNum = Math.abs(num);
  if (absNum !== 0 && (absNum >= 1e11 || absNum < 1e-7)) {
    return num.toExponential(4).replace('e+', 'e');
  }

  // Round to max 9 decimal places to prevent IEEE 754 float weirdness (e.g. 0.1 + 0.2 = 0.3)
  const rounded = Math.round((num + Number.EPSILON) * 1e9) / 1e9;
  return rounded.toString();
}

// Tokenize standard arithmetic expressions containing numbers, +, -, *, /, %
export function tokenize(expr: string): string[] {
  // Normalize symbols: '×' -> '*', '÷' -> '/', '−' -> '-'
  const normalized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\s+/g, '');

  const tokens: string[] = [];
  let currentNum = '';

  for (let i = 0; i < normalized.length; i++) {
    const char = normalized[i];

    if ((char >= '0' && char <= '9') || char === '.') {
      currentNum += char;
    } else if (char === '+' || char === '*' || char === '/') {
      if (currentNum !== '') {
        tokens.push(currentNum);
        currentNum = '';
      }
      tokens.push(char);
    } else if (char === '-') {
      // Check if '-' is a negative sign for a number or a subtraction operator
      const prevToken = tokens[tokens.length - 1];
      const isNegativeSign =
        (currentNum === '' && (tokens.length === 0 || ['+', '-', '*', '/'].includes(prevToken)));

      if (isNegativeSign) {
        currentNum = '-';
      } else {
        if (currentNum !== '') {
          tokens.push(currentNum);
          currentNum = '';
        }
        tokens.push(char);
      }
    } else if (char === '%') {
      if (currentNum !== '') {
        // Convert number% directly to (number / 100)
        const val = parseFloat(currentNum);
        if (!isNaN(val)) {
          tokens.push((val / 100).toString());
          currentNum = '';
        }
      }
    }
  }

  if (currentNum !== '' && currentNum !== '-') {
    tokens.push(currentNum);
  }

  return tokens;
}

// Evaluate token array with operator precedence: * and / first, then + and -
export function evaluateTokens(tokens: string[]): number {
  if (tokens.length === 0) return 0;
  if (tokens.length === 1) {
    const val = parseFloat(tokens[0]);
    return isNaN(val) ? 0 : val;
  }

  // Pass 1: Multiplication and Division
  const pass1: (number | string)[] = [];
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === '*' || token === '/') {
      const prev = pass1.pop();
      const nextToken = tokens[i + 1];
      if (typeof prev !== 'number' || nextToken === undefined) {
        throw new Error('Invalid expression');
      }
      const next = parseFloat(nextToken);
      if (isNaN(next)) throw new Error('Invalid expression');

      if (token === '/') {
        if (next === 0) {
          throw new Error('Cannot divide by 0');
        }
        pass1.push(prev / next);
      } else {
        pass1.push(prev * next);
      }
      i += 2;
    } else {
      const num = parseFloat(token);
      if (!isNaN(num)) {
        pass1.push(num);
      } else {
        pass1.push(token);
      }
      i++;
    }
  }

  // Pass 2: Addition and Subtraction
  if (pass1.length === 0) return 0;
  let result = typeof pass1[0] === 'number' ? pass1[0] : 0;
  let j = 1;
  while (j < pass1.length) {
    const op = pass1[j];
    const nextVal = pass1[j + 1];
    if (typeof nextVal !== 'number') {
      throw new Error('Invalid expression');
    }

    if (op === '+') {
      result += nextVal;
    } else if (op === '-') {
      result -= nextVal;
    }
    j += 2;
  }

  return result;
}

export function calculateExpression(expression: string): { result: string; success: boolean; error?: string } {
  try {
    if (!expression || expression.trim() === '') {
      return { result: '0', success: true };
    }

    const tokens = tokenize(expression);
    if (tokens.length === 0) {
      return { result: '0', success: true };
    }

    // If expression ends with an operator, evaluate without trailing operator
    if (['+', '-', '*', '/'].includes(tokens[tokens.length - 1])) {
      tokens.pop();
    }

    if (tokens.length === 0) {
      return { result: '0', success: true };
    }

    const value = evaluateTokens(tokens);
    return {
      result: formatNumber(value),
      success: true,
    };
  } catch (err: any) {
    return {
      result: err?.message || 'Error',
      success: false,
      error: err?.message || 'Error',
    };
  }
}

// Format expression with nice hand-drawn operators for display
export function displayExpression(expr: string): string {
  return expr
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/(?<![0-9])-(?![0-9])/g, ' − ')
    .replace(/([0-9])-([0-9])/g, '$1 − $2')
    .replace(/\s+/g, ' ')
    .trim();
}
