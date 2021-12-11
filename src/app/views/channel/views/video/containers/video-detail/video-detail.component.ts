import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

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
  ) {}

  ngOnInit(): void {
    this.video$ = this.activatedRoute.paramMap.pipe(
      filter((videoId) => !!videoId),
      switchMap((params) =>
        this.videoService.getVideo(params?.get('videoId') as string)
      )
    );
  }
}
