import {
  Animation,
  HigherOrderAnimation,
  NextAnimation,
  PrimitiveValue,
  Timestamp,
} from './commonTypes';
import { defineAnimation } from './util';

export interface ParserAnimation
  extends Animation<ParserAnimation>,
    HigherOrderAnimation {
  current: PrimitiveValue;
}

export function withParser(
  beforeFn: (value: PrimitiveValue) => number,
  afterFn: (value: number) => PrimitiveValue,
  nextAnimation: NextAnimation<ParserAnimation>
): Animation<ParserAnimation> {
  'worklet';
  const innerAnimation =
    typeof nextAnimation === 'function' ? nextAnimation() : nextAnimation;
  return defineAnimation<ParserAnimation>(
    innerAnimation,
    () => {
      function parser(animation: ParserAnimation, now: Timestamp): boolean {
        const finished = innerAnimation.onFrame(innerAnimation, now);
        animation.current = afterFn(innerAnimation.current as number);
        return finished;
      }

      function onStart(
        animation: ParserAnimation,
        value: PrimitiveValue,
        now: Timestamp,
        previousAnimation: ParserAnimation
      ): void {
        animation.current = value;
        innerAnimation.onStart(
          innerAnimation,
          beforeFn(value),
          now,
          previousAnimation
        );
      }

      const callback = (finished?: boolean): void => {
        if (innerAnimation.callback) {
          innerAnimation.callback(finished);
        }
      };

      return {
        isHigherOrder: true,
        onFrame: parser,
        onStart,
        current: innerAnimation.current,
        callback,
      };
    },
    false
  );
}
