import { createAttrBuilder } from '../build';

const dimensions = {
  x: 100,
  y: 100,
  width: 50,
  height: 50
};

test('should correctly create SVG attrs with correct casing', () => {
  const build = createAttrBuilder(dimensions);
  const { style, ...attrs } = build({
    attrX: 1,
    attrY: 2,
    cx: 0,
    x: 3,
    y: 4,
    scale: 2,
    rotate: 90,
    originX: 1,
    originY: 2,
    limitingConeAngle: 100,
    alignmentBaseline: 'bottom'
  });

  expect(style).toEqual({
    transform: 'translateX(3px) translateY(4px) scale(2) rotate(90deg)',
    transformOrigin: '150px 200px'
  });

  expect(attrs).toEqual({
    cx: 0,
    x: 1,
    y: 2,
    limitingConeAngle: 100,
    'alignment-baseline': 'bottom'
  });
});

test('should add origin when transform detected', () => {
  const build = createAttrBuilder(dimensions);
  const { style } = build({ rotate: 90 });
  expect(style).toEqual({
    transform: 'rotate(90deg)',
    transformOrigin: '125px 125px'
  });
});

test('should add origin when specified', () => {
  const build = createAttrBuilder(dimensions);
  const { style } = build({ originX: 0 });
  expect(style).toEqual({
    transformOrigin: '100px 125px'
  });
});

test('should handle special path props', () => {
  const buildPath = createAttrBuilder(dimensions, 400);
  const pathAttrs = buildPath({
    pathLength: 0.25,
    pathSpacing: 0.5,
    pathOffset: 0.75
  });

  expect(pathAttrs).toEqual({
    'stroke-dasharray': '100px 200px',
    'stroke-dashoffset': '-300px',
    style: {}
  });

  const buildProps = createAttrBuilder(dimensions, 400, false);

  const props = buildProps({
    strokeWidth: 1,
    alignmentBaseline: 'bottom',
    pathLength: 0.25,
    pathSpacing: 0.5,
    pathOffset: 0.75
  });

  expect(props).toEqual({
    strokeWidth: 1,
    alignmentBaseline: 'bottom',
    strokeDasharray: '100px 200px',
    strokeDashoffset: '-300px',
    style: {}
  });
});
