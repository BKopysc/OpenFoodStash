import {Action, createReducer, on} from '@ngrx/store';
import * as BackElements from './back-elements.actions';
import {BackElementsActions} from './back-elements.actions';

export interface BackLocationState {
  backUrl: string,
  storageId: number | null,
  stashId: number | null,
  wasStorageSelectedBefore: boolean
}

export const initialState: BackLocationState = {
  backUrl: '/',
  storageId: null,
  stashId: null,
  wasStorageSelectedBefore: false
};

export const backElementsReducer = createReducer(
  initialState,
  on(BackElementsActions.savePreviousUrl,
    (state, {backUrl}) =>
      ({backUrl: backUrl, stashId: state.stashId, storageId: state.storageId,
        wasStorageSelectedBefore: state.wasStorageSelectedBefore})),
  on(BackElementsActions.resetPreviousBackElements,
      state => ({backUrl: '/', stashId: null, storageId: null, wasStorageSelectedBefore: false})),
  on(BackElementsActions.resetPreviousSelectedStorage,
    state => ({backUrl: state.backUrl, stashId: null, storageId: null, wasStorageSelectedBefore: false})),
  on(BackElementsActions.savePreviousSelectedStorage,
    (state,{stashId, storageId}) =>
      ({backUrl: state.backUrl, stashId: stashId, storageId: storageId, wasStorageSelectedBefore: true}))
);

