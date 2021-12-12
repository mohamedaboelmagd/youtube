import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { GOOGLE_APIS } from 'src/app/constant';
import { environment } from 'src/environments/environment';

import * as fromModels from '../models';

// implement two routing lazyloaded {home, details} (done)

// update name of model (done)
// create two services one for channel, second for video (done)

// add back button on second screen and rate and add to fav (has rate of video updated with firebase store)
// home screen has mat-table with pagination and text box and sort header

// in service channel -> after getting favorite list save all response in firestore and check before get it again

@Injectable()
export class ChannelService {
  constructor(private http: HttpClient, private afs: AngularFirestore) { }

  loadChannelList(channelId: string, pageToken?: string): Observable<fromModels.IChannelList> {
    if (pageToken) {
      return this.afs
        .doc<fromModels.IChannelList>(`channel/${channelId}/pageToken/${pageToken}`)
        .snapshotChanges()
        .pipe(
          map((snap) => snap.payload.data() as fromModels.IChannelList)
        );
    }
    return this.afs
      .doc<fromModels.IChannelList>(`channel/${channelId}`)
      .snapshotChanges()
      .pipe(
        map((snap) => snap.payload.data() as fromModels.IChannelList)
      );
  }

  exists(channelId: string, pageToken?: string): Observable<boolean> {
    if (pageToken) {
      return this.afs
        .doc<fromModels.IChannelList>(`channel/${channelId}/pageToken/${pageToken}`)
        .snapshotChanges()
        .pipe(map((snap) => snap.payload.exists));
    }
    return this.afs
      .doc<fromModels.IChannelList>(`channel/${channelId}`)
      .snapshotChanges()
      .pipe(map((snap) => snap.payload.exists));
  }

  addItem(id: string, channel: fromModels.IChannelList, pageToken?: string): Observable<void> {
    console.log(id, channel, pageToken)
    if (pageToken) {
      return from(
        this.afs.collection<fromModels.IChannelList>('channel').doc(id).collection('pageToken').doc(pageToken).set(channel)
      );
    }
    return from(
      this.afs.collection<fromModels.IChannelList>('channel').doc(id).set(channel)
    );
  }

  private getURL(id: string, pageToken?: string, title?: string): string {
    // sort -> order=date& title
    // there are not sort asc
    return (
      `${GOOGLE_APIS}/search?order=date&pageToken=` +
      (pageToken != null ? pageToken : '') +
      `&part=snippet&maxResults=5&channelId=${id}&q=${title || ''}&key=${environment.firebaseConfig.apiKey
      }`
    );
  }

  // Retrieve a list of videos
  //  videos data (Title - Thumbnail - View Details button)
  private requestChannel(
    id: string,
    pageToken?: string
  ): Observable<fromModels.IChannelList> {
    // fromModels.IChannelList
    return this.http
      .get<fromModels.IChannelResponse>(this.getURL(id, pageToken))
      .pipe(
        map((res: fromModels.IChannelResponse) => {
          return {
            id: id,
            total: res.pageInfo.totalResults,
            pages: Math.floor((res.pageInfo.totalResults - 1) / 5) + 1,
            nextPageToken: res?.nextPageToken || null,
            prevPageToken: res?.prevPageToken || null,
            videos: res.items.map((item: fromModels.IChannelItemResponse) => {
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

  //    selected video (Title - Upload date - Duration - # of likes - # of
  // views - Description - Thumbnail) with option to rate the video and adding the
  // video to favorite list, with writing and reading the rate and favorite list from local
  // storage if exist.

  loadChannel(id: string): Observable<fromModels.IChannelList> {
    return this.requestChannel(id);
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
