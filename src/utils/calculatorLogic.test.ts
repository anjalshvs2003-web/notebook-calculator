import { describe, it, expect } from 'vitest';
import { calculateExpression, formatNumber, tokenize } from './calculatorLogic';

describe('Calculator Logic', () => {
  it('correctly calculates basic addition, subtraction, multiplication, and division', () => {
    expect(calculateExpression('12 + 8').result).toBe('20');
    expect(calculateExpression('25 - 9').result).toBe('16');
    expect(calculateExpression('7 * 8').result).toBe('56');
    expect(calculateExpression('72 / 8').result).toBe('9');
  });

  it('respects operator precedence (PEMDAS / BODMAS)', () => {
    expect(calculateExpression('2 + 3 * 4').result).toBe('14');
    expect(calculateExpression('20 - 4 / 2').result).toBe('18');
    expect(calculateExpression('5 * 4 - 3 * 2').result).toBe('14');
    expect(calculateExpression('10 + 2 * 6 / 3').result).toBe('14');
  });

  it('handles decimal precision gracefully without floating point error', () => {
    expect(calculateExpression('0.1 + 0.2').result).toBe('0.3');
    expect(calculateExpression('0.7 * 0.1').result).toBe('0.07');
    expect(calculateExpression('10.5 / 2').result).toBe('5.25');
  });

  it('handles negative numbers', () => {
    expect(calculateExpression('-5 + 12').result).toBe('7');
    expect(calculateExpression('15 + -3').result).toBe('12');
    expect(calculateExpression('-4 * -5').result).toBe('20');
  });

  it('handles percentage calculation', () => {
    expect(calculateExpression('50%').result).toBe('0.5');
    expect(calculateExpression('200 * 15%').result).toBe('30');
  });

  it('handles division by zero with friendly feedback', () => {
    const res = calculateExpression('42 / 0');
    expect(res.result).toBe('Cannot divide by 0');
    expect(res.success).toBe(false);
  });

  it('tokenizes unicode symbols ×, ÷, −', () => {
    const tokens = tokenize('10 × 5 ÷ 2 − 3');
    expect(tokens).toEqual(['10', '*', '5', '/', '2', '-', '3']);
    expect(calculateExpression('10 × 5 ÷ 2 − 3').result).toBe('22');
  });

  it('handles incomplete expressions with trailing operator gracefully', () => {
    expect(calculateExpression('12 +').result).toBe('12');
    expect(calculateExpression('5 * 4 +').result).toBe('20');
  });
});
