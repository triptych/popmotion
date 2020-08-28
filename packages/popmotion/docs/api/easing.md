---
title: Easing
description: Functions that speed or slow a tween over time.
---

# Easing

Easing functions make tweened motion look more natural by emulating the changes in velocity experienced by objects in the real world.

They work by accepting a progress value from `0` to `1`, and returning a new one.

Popmotion comes with a number of preset easing functions, and provides methods to create new easing functions.

<TOC />

## Import

```javascript
import { easing } from 'popmotion';
```

To use Popmotion's easing functions with a different animation library, they're available from the `@popmotion/easing` package:

```
npm install @popmotion/easing
```

```javascript
import { linear } from '@popmotion/easing';
```

## Example

```javascript
import { tween, easing } from 'popmotion';

tween({
  ease: easing.easeOut
}).start();
```

## Presets

Popmotion comes with the following preset easing functions:

- `cubicBezier`
- `linear`
- `easeIn`, `easeOut`, `easeInOut`
- `circIn`, `circOut`, `circInOut`
- `backIn`, `backOut`, `backInOut`
- `anticipate`

Try them out by editing this live example:

```marksy
<Example template="Ball" id="b">{`
const ball = document.querySelector('#b .ball');
const ballStyler = styler(ball);

tween({
  to: 300,
  duration: 300,
  ease: easing.linear
}).start(ballStyler.set('x'));
`}</Example>
```

## Easing creation

Popmotion provides the following functions to create your own easing functions:

### cubicBezier

Creates cubic bezier curve easing function.

```javascript
const { cubicBezier } = easing;
const longTail = cubicBezier(0, .42, 0, 1);
```

### reversed

Accepts an easing function and returns a new one that reverses the provided one.

For instance, an `easeIn` would become an `easeOut`.

```javascript
const { anticipate, reversed } = easing;
const anticipateOut = reversed(anticipate);
```

### mirrored

Accepts an easing function and returns a new one that mirrors the provided one. 

For instance, an `easeIn` would become an `easeInOut`.

```javascript
const { anticipate, mirrored } = easing;
const anticipateInOut = mirrored(anticipate);
```

### createExpoIn

Creates an easing function based on the exponent function `progress ** exponent`. `easeIn` is `createExpoIn(2)`.

```javascript
const { createExpoIn } = easing;
const strongerEaseIn = createExpoIn(3);
```

### createBackIn

Creates an easing function with an overshoot. `backIn` is `createBackIn(1.525)`.

```javascript
const { createBackIn, reversed } = easing;
const strongerBackOut = reversed(createBackIn(3));
```

### createAnticipateEasing

Creates an easing function with a small anticipate and ease out. `anticipate` is `createAnticipateEasing(1.525)`.

```javascript
const { createAnticipateEasing } = easing;
const strongerAnticipate = createAnticipateEasing(3);
```
