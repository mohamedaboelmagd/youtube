import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
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
  constructor(private http: HttpClient) {}

  private getURL(id: string, pageToken?: string, title?: string): string {
    // sort -> order=date& title
    // there are not sort asc
    return (
      `${GOOGLE_APIS}/search?order=date&pageToken=` +
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
            nextPageToken: res.nextPageToken,
            prevPageToken: res?.prevPageToken,
            videos: res.items.map((item: fromModels.IChannelItemResponse) => {
              return {
                id: item.id.videoId,
                publishedAt: new Date(item.snippet.publishedAt),
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
