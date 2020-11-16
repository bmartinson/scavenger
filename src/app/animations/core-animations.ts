import { animate, query, style, transition, trigger } from '@angular/animations';

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

export const delayedDropDownAnimation = trigger(
  'dropDownAnimation',
  [
    transition(
      ':enter',
      [
        style({ top: -100, position: 'absolute' }),
        animate('.5s .25s ease-out', style({ top: 0, position: 'absolute' })),
      ],
    ),
    transition(
      ':leave',
      [
        style({ top: '0' }),
        animate('.5s .25s ease-in', style({ top: -100 })),
      ],
    ),
  ],
);

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
