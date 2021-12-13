import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, throwError } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { GOOGLE_APIS } from 'src/app/constant';
import { environment } from 'src/environments/environment';

import * as fromModels from '../models';

@Injectable()
export class ChannelService {
  constructor(private http: HttpClient, private afs: AngularFirestore) {}

  loadChannelList(
    channelId: string,
    pageToken?: string
  ): Observable<fromModels.IChannelList> {
    return (
      this.afs
        .doc<fromModels.IChannelList>(
          pageToken
            ? `channel/${channelId}/pageToken/${pageToken}`
            : `channel/${channelId}`
        )
        .valueChanges() as Observable<fromModels.IChannelList>
    ).pipe(first());
  }

  exists(channelId: string, pageToken?: string): Observable<boolean> {
    return this.afs
      .doc<fromModels.IChannelList>(
        pageToken
          ? `channel/${channelId}/pageToken/${pageToken}`
          : `channel/${channelId}`
      )
      .snapshotChanges()
      .pipe(
        map((snap) => snap.payload.exists),
        first()
      );
  }

  addItem(
    id: string,
    channel: fromModels.IChannelList,
    pageToken?: string
  ): Observable<void> {
    return from(
      this.afs
        .doc<fromModels.IChannelList>(
          pageToken ? `channel/${id}/pageToken/${pageToken}` : `channel/${id}`
        )
        .set(channel)
    );
  }

  private getURL(
    id: string,
    pageToken?: string,
    title?: string,
    order?: string
  ): string {
    // sort -> order=date& title
    // there are not sort asc
    order = order === 'publishedAt' ? 'date' : order;
    return (
      `${GOOGLE_APIS}/search?${order ? 'order=' + order + '&' : ''}pageToken=` +
      (pageToken != null ? pageToken : '') +
      `&part=snippet&maxResults=5&channelId=${id}&q=${title || ''}&key=${
        environment.firebaseConfig.apiKey
      }`
    );
  }

  // Retrieve a list of videos
  //  videos data (Title - Thumbnail - View Details button)
  private requestChannel(
    id: string,
    pageToken?: string,
    title?: string,
    order?: string
  ): Observable<fromModels.IChannelList> {
    // fromModels.IChannelList
    return this.http
      .get<fromModels.IChannelResponse>(
        this.getURL(id, pageToken, title, order)
      )
      .pipe(
        map((res: fromModels.IChannelResponse) => {
          return {
            id: id,
            total: res.pageInfo.totalResults,
            pages: Math.floor((res.pageInfo.totalResults - 1) / 5) + 1,
            nextPageToken: res?.nextPageToken || null,
            prevPageToken: res?.prevPageToken || null,
            videos: res.items
              ?.filter((item) => item?.id?.videoId)
              ?.map((item: fromModels.IChannelItemResponse) => {
                return {
                  id: item.id?.videoId || item.id?.playlistId || null,
                  publishedAt: new Date(item.snippet.publishedAt).getTime(),
                  title: item.snippet.title,
                  description: item.snippet.description,
                  imgURL: item.snippet.thumbnails.medium.url,
                } as fromModels.IVideo;
              }),
          } as fromModels.IChannelList;
        })
      );
  }

  loadChannel(
    id: string,
    pageToken?: string,
    title?: string,
    order?: string
  ): Observable<fromModels.IChannelList> {
    return this.requestChannel(id, pageToken, title, order);
  }

  movePage(
    playlist: fromModels.IChannelList,
    direction: fromModels.PageDirection
  ): Observable<fromModels.IChannelList> {
    let pageToken = '';
    if (direction === fromModels.PageDirection.NEXT) {
      pageToken = playlist.nextPageToken;
    } else if (direction === fromModels.PageDirection.PREVIOUS) {
      pageToken = playlist?.prevPageToken || '';
    }
    if (pageToken == null) {
      return throwError('Undefined pageToken');
    }
    return this.requestChannel(playlist.id, pageToken);
  }
}
