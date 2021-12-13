import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStarRatingModule } from 'ngx-star-rating';

import * as fromContainers from './containers';
import * as fromServices from './services';
import { VideoRoutingModule } from './video-routing.module';

@NgModule({
  declarations: [...fromContainers.CONTAINERS],
  imports: [
    CommonModule,
    VideoRoutingModule,
    NgxStarRatingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [...fromServices.SERVICES],
})
export class VideoModule { }
