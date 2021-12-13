import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { GOOGLE_APIS } from 'src/app/constant';
import { environment } from 'src/environments/environment';

import * as fromModels from '../models';

@Injectable()
export class VideoService {
  constructor(private http: HttpClient, private afs: AngularFirestore) { }

  loadVideo(videoId: string): Observable<fromModels.IVideo> {
    return (this.afs
      .doc<fromModels.IVideo>(`videos/${videoId}`)
      .valueChanges() as Observable<fromModels.IVideo>);
  }

  exists(videoId: string): Observable<boolean> {
    return this.afs
      .doc<fromModels.IVideo>(`videos/${videoId}`)
      .snapshotChanges()
      .pipe(map((snap) => snap.payload.exists), first());
  }

  updateVideo(id: string, item: Partial<fromModels.IVideo>): Observable<void> {
    return from(this.afs.doc<fromModels.IVideo>(`videos/${id}`).update(item));
  }

  addItem(id: string, video: fromModels.IVideo): Observable<void> {
    return from(
      this.afs.collection<fromModels.IVideo>('videos').doc(id).set(video)
    );
  }

  delete(id: string): Observable<void> {
    return from(this.afs.doc(`videos/${id}`).delete());
  }

  private getVideoURL(id: string): string {
    return `${GOOGLE_APIS}/videos?part=id%2C+snippet%2C+statistics%2C+contentDetails&id=${id}&key=${environment.firebaseConfig.apiKey}`;
  }

  //    selected video (Title - Upload date - Duration - # of likes - # of
  // views - Description - Thumbnail) with option to rate the video and adding the
  // video to favorite list, with writing and reading the rate and favorite list from local
  // storage if exist.
  getVideo(video: string) {
    return this.http
      .get<fromModels.IVideoResponse>(this.getVideoURL(video))
      .pipe(
        map((res: fromModels.IVideoResponse) => {
          return {
            id: video,
            title: res.items[0].snippet.title,
            publishedAt: new Date(res.items[0].snippet.publishedAt).getTime(),
            duration: res.items[0].contentDetails.duration,
            likeCount: res.items[0].statistics.likeCount,
            viewCount: res.items[0].statistics.viewCount,
            description: res.items[0].snippet.description,
            imgUrl: res.items[0].snippet.thumbnails.standard.url,
          } as fromModels.IVideo;
        })
      );
  }
}
