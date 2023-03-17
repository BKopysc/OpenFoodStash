import {createAction, createActionGroup, emptyProps, props} from '@ngrx/store'

// export const savePreviousURL = createAction('[Url Location] Save Previous',
//   props<{backUrl: string}>());
//
// export const resetPreviousURL = createAction('[Url Location] Reset');

export const BackElementsActions = createActionGroup({
  source: 'Back Elements',
  events: {
    'Save Previous URL': props<{backUrl: string}>(),
    'Reset Previous Back Elements': emptyProps(),
    'Save Previous Selected Storage': props<{stashId: number, storageId: number}>(),
    'Reset Previous Selected Storage': emptyProps()
  }
});
