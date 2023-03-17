
import { createSelector, createFeatureSelector } from '@ngrx/store';
import {BackLocationState} from './back-elements.reducer';


const backLocationFeature = createFeatureSelector<BackLocationState>('backElements');
// export const backLocationFeature = (state: UrlLocationState) => state.

export const selectBackLocationUrl = createSelector(
  backLocationFeature,
  (state: BackLocationState) => state.backUrl
);

export const selectPreviousStashStorage = createSelector(
  backLocationFeature,
  (state: BackLocationState) => {
    state.stashId, state.storageId
  }
);

export const selectBackElements = createSelector(
  backLocationFeature,
  (state: BackLocationState) => state

);



//export const selectBack
