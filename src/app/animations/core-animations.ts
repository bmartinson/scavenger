import { animate, style, transition, trigger } from '@angular/animations';

/**
 * Transition animation that drops an element from -100px above its starting position
 * to the defined position where it belongs. When leaving, the element is shifted up
 * 100px.
 */
export const dropDownAnimation = trigger(
  'dropDownAnimation',
  [
    transition(
      ':enter',
      [
        style({ top: -100, position: 'absolute' }),
        animate('.5s ease-out', style({ top: 0, position: 'absolute' })),
      ],
    ),
    transition(
      ':leave',
      [
        style({ top: '0' }),
        animate('.5s ease-in', style({ top: -100 })),
      ],
    ),
  ],
);

/**
 * Transition animation that is used to quickly hide content when leaving and fade
 * in content over a half second period when entering.
 */
export const fadeInOutQuickAnimation = trigger(
  'fadeInOutQuickAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('.5s ease-out', style({ opacity: 1 })),
      ],
    ),
    transition(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('0s ease-in', style({ opacity: 0 })),
      ],
    ),
  ],
);

/**
 * Transition animation that is used to fade out content over a half second period
 * when leaving and fade in content over a second when entering.
 */
export const inOutAnimation = trigger(
  'inOutAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('1s ease-out', style({ opacity: 1 })),
      ],
    ),
    transition(
      ':leave',
      [
        style({ opacity: 1 }),
        animate('.5s ease-in', style({ opacity: 0 })),
      ],
    ),
  ],
);
