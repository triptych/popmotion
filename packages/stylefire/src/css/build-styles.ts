import { CustomTemplate, State, ResolvedState } from '../styler/types';
import { getValueType, getValueAsType } from './value-types';
import prefixer from './prefixer';
import {
  sortTransformProps,
  isTransformProp,
  isTransformOriginProp
} from './transform-props';
import { SCROLL_LEFT, SCROLL_TOP } from './scroll-keys';

const blacklist = new Set([SCROLL_LEFT, SCROLL_TOP, 'transform']);

const translateAlias: { [key: string]: string } = {
  x: 'translateX',
  y: 'translateY',
  z: 'translateZ'
};

function isCustomTemplate(v: any): v is CustomTemplate {
  return typeof v === 'function';
}

function buildTransform(
  state: State,
  transform: ResolvedState,
  transformKeys: string[],
  transformIsDefault: boolean,
  enableHardwareAcceleration: boolean,
  allowTransformNone = true
) {
  let transformString = '';
  let transformHasZ = false;
  transformKeys.sort(sortTransformProps);

  const numTransformKeys = transformKeys.length;

  for (let i = 0; i < numTransformKeys; i++) {
    const key = transformKeys[i];
    transformString += `${translateAlias[key] || key}(${transform[key]}) `;
    transformHasZ = key === 'z' ? true : transformHasZ;
  }

  if (!transformHasZ && enableHardwareAcceleration) {
    transformString += 'translateZ(0)';
  } else {
    transformString = transformString.trim();
  }

  // If we have a custom `transform` template
  if (isCustomTemplate(state.transform)) {
    transformString = state.transform(
      transform,
      transformIsDefault ? '' : transformString
    );
  } else if (allowTransformNone && transformIsDefault) {
    transformString = 'none';
  }

  return transformString;
}

/**
 * Build style property
 *
 * This function converts a Stylefire-formatted CSS style
 * object, eg:
 *
 * { x: 100, width: 100 }
 *
 * Into an object with default value types applied and default
 * transform order set:
 *
 * { transform: 'translateX(100px) translateZ(0)`, width: '100px' }
 */
function buildStyleProperty(
  state: State,
  enableHardwareAcceleration: boolean = true,
  styles: ResolvedState = {},
  transform: ResolvedState = {},
  transformOrigin: ResolvedState = {},
  transformKeys: string[] = [],
  isDashCase: boolean = false,
  allowTransformNone: boolean = true
) {
  let transformIsDefault = true;
  let hasTransform = false;
  let hasTransformOrigin = false;

  for (const key in state) {
    const value = state[key];
    const valueType = getValueType(key);
    const valueAsType = getValueAsType(value, valueType);

    if (isTransformProp(key)) {
      hasTransform = true;
      transform[key] = valueAsType;
      transformKeys.push(key);

      if (transformIsDefault) {
        if (
          (valueType.default && value !== valueType.default) ||
          (!valueType.default && value !== 0)
        ) {
          transformIsDefault = false;
        }
      }
    } else if (isTransformOriginProp(key)) {
      transformOrigin[key] = valueAsType;
      hasTransformOrigin = true;
    } else if (!blacklist.has(key) || !isCustomTemplate(valueAsType)) {
      styles[prefixer(key, isDashCase)] = valueAsType;
    }
  }

  // Only process and set transform prop if values aren't defaults
  if (hasTransform || typeof state.transform === 'function') {
    styles.transform = buildTransform(
      state,
      transform,
      transformKeys,
      transformIsDefault,
      enableHardwareAcceleration,
      allowTransformNone
    );
  }

  if (hasTransformOrigin) {
    styles.transformOrigin = `${transformOrigin.originX ||
      '50%'} ${transformOrigin.originY || '50%'} ${transformOrigin.originZ ||
      0}`;
  }

  return styles;
}

function createStyleBuilder({
  enableHardwareAcceleration = true,
  isDashCase = true,
  allowTransformNone = true
} = {}) {
  /**
   * Because we expect this function to run multiple times a frame
   * we create and hold these data structures as mutative states.
   */
  const styles: ResolvedState = {};
  const transform: ResolvedState = {};
  const transformOrigin: ResolvedState = {};
  const transformKeys: string[] = [];

  return (state: State) => {
    transformKeys.length = 0;
    buildStyleProperty(
      state,
      enableHardwareAcceleration,
      styles,
      transform,
      transformOrigin,
      transformKeys,
      isDashCase,
      allowTransformNone
    );

    return styles;
  };
}

export { buildStyleProperty, createStyleBuilder };
