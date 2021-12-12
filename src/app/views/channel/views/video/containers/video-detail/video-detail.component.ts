import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';

import * as fromModels from '../../models';
import * as fromServices from '../../services';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss'],
})
export class VideoDetailComponent implements OnInit {
  video$: Observable<fromModels.IVideo>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private videoService: fromServices.VideoService
  ) { }

  ngOnInit(): void {
    // this.video$ = this.activatedRoute.paramMap.pipe(
    //   filter((videoId) => !!videoId),
    //   switchMap((params) =>
    //     this.videoService.getVideo(params?.get('videoId') as string)
    //   )
    // );
    const videoId = this.activatedRoute.snapshot.paramMap?.get(
      'videoId'
    ) as string;
    this.video$ = this.videoService.exists(videoId).pipe(
      switchMap((exist) => {
        console.log(exist);
        if (exist) {
          return this.videoService.loadVideo(videoId);
        } else {
          return this.videoService.getVideo(videoId).pipe(
            filter((res) => !!res),
            tap((res) => this.videoService.addItem(videoId, res))
          );
        }
      })
    );
  }
}
