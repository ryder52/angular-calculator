import { createAction, props } from '@ngrx/store';

export const number   = createAction('[Calculator Component] Number', props<{ operand: string }>());
export const symbol   = createAction('[Calculator Component] Symbol', props<{ operator: string }>());

export const reset    = createAction('[Calculator Component] Reset');

