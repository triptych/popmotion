import { mixComplex } from '../mix-complex';

test('mixComplex', () => {
  expect(mixComplex('20px', '10px')(0.5)).toBe('15px');
  expect(
    mixComplex('20px, rgba(0, 0, 0, 0)', '10px, rgba(255, 255, 255, 1)')(0.5)
  ).toBe('15px, rgba(180, 180, 180, 0.5)');
});

test('mixComplex errors', () => {
  expect(() => mixComplex('hsla(100%, 100, 100, 1)', '#fff')).toThrowError();
});

test('mixComplex can interpolate out-of-order values', () => {
  expect(mixComplex('#fff 0px 0px', '20px 0px #000')(0.5)).toBe(
    '10px 0px rgba(180, 180, 180, 1)'
  );
});

test('mixComplex can animate from a value-less prop', () => {
  expect(mixComplex('#fff 0 0px', '20px 0px #000')(0.5)).toBe(
    '10px 0px rgba(180, 180, 180, 1)'
  );
});

test('mixComplex can animate from a value with extra zeros', () => {
  expect(mixComplex('#fff 0 0px 0px', '20px 0px #000')(0.5)).toBe(
    '10px 0px rgba(180, 180, 180, 1)'
  );
});
