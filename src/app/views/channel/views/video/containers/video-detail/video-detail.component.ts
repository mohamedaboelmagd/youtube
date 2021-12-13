import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';

import * as fromModels from '../../models';
import * as fromServices from '../../services';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss'],
})
export class VideoDetailComponent implements OnInit, OnDestroy {
  form: FormGroup;

  video$: Observable<fromModels.IVideo>;
  isFav = false;

  subscription = new Subscription();

  get ratingControl() {
    return this.form.get('rating') as AbstractControl;
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private videoService: fromServices.VideoService,
    private fb: FormBuilder
  ) {
    // this.rating3 = 0;
    this.form = this.fb.group({
      rating: ['', Validators.required],
    });
  }

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
        if (exist) {
          return this.videoService.loadVideo(videoId);
        } else {
          return this.videoService.getVideo(videoId).pipe(
            filter((res) => !!res),
            tap((res) => this.videoService.addItem(videoId, res))
          );
        }
      }),
      tap((video) => {
        this.isFav = video?.isFavorite || false;
        this.ratingControl?.patchValue(video?.rating);
      })
    );
    this.subscription.add(
      this.ratingControl.valueChanges
        .pipe(
          debounceTime(500),
          filter((rating) => !!rating),
          switchMap((rating) =>
            this.videoService.updateVideo(videoId, { rating })
          )
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription?.unsubscribe();
  }

  toggleFav() {
    const videoId = this.activatedRoute.snapshot.paramMap?.get(
      'videoId'
    ) as string;
    this.videoService.updateVideo(videoId, { isFavorite: !this.isFav });
  }
}
