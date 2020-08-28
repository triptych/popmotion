---
title: Schedule
description: Use an action to control the output of another.
category: compositors
---

# Schedule

`schedule` can use one action to control the output of another.

For instance, by default `pointer` outputs only when the pointer updates.

With `schedule`, you could compose it with `everyFrame` to output the latest `pointer` value every frame.

<TOC />

## Import

```javascript
import { schedule } from 'popmotion';
```

## Usage

```typescript
schedule(scheduler: Action, subject: Action): Action
```

```javascript
// `pointer` will output at most once every frame
schedule(
  everyFrame(),
  pointer()
).start(({ x, y }) => {});
```

## Methods

### Action methods

`schedule()` returns:

- `filter((v: any) => boolean)`: Returns a new action that filters out values when the provided function returns `false`.
- `pipe(...funcs: Array<(v) => v)`: Returns a new action that will run `update` values through this sequence of functions.
- `start(update | { update, complete })`: Starts the action and returns a subscription.
- `while((v: any) => boolean)`: Returns a new action that will `complete` when the provided function returns `false`.

### Subscription methods

`schedule().start()` returns:

- `stop(): void`

