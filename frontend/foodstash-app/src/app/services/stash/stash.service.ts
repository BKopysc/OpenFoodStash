import { Injectable } from '@angular/core';
import {config} from '../../core/config';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  StashCollaborator,
  StashCreate,
  StashDetails,
  StashShare,
  StashShareDetails
} from '../../common/models/stashes/stash.model';

@Injectable({
  providedIn: 'root'
})
export class StashService {

  private API_URL = config.apiUrl;

  constructor(private http: HttpClient) { }

  getUserStashes(): Observable<StashDetails[]> {
    return this.http.get<StashDetails[]>(
      `${this.API_URL}/stashes/my`
    );
  }

  addNewStash(newStash: StashCreate): Observable<any> {
    return this.http.post(
      `${this.API_URL}/stashes`,
      newStash
    );
  }

  postShareRequestForStash(stashId: number, stashShare: StashShare): Observable<any> {
    return this.http.post(
      `${this.API_URL}/stashes/share-request/${stashId}`,
      stashShare
    );
  }

  getPendingStashShareRequests(stashId: number): Observable<StashShareDetails[]> {
    return this.http.get<StashShareDetails[]>(
      `${this.API_URL}/stashes/share-request/${stashId}/pending`,
    );
  }

  getStashCollaborators(stashId: number): Observable<StashCollaborator[]> {
    return this.http.get<StashCollaborator[]>(
      `${this.API_URL}/stashes/${stashId}/collaborators`,
    );
  }

  cancelPendingStashRequest(stashId: number, stashShare: StashShare): Observable<any> {
    return this.http.put(
      `${this.API_URL}/stashes/share-request/${stashId}`,
      stashShare
    );
  }

  acceptStashShareInvitation(tokenValue: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/stashes/accept-invitation/${tokenValue}`,
      {}
    );
  }

}
