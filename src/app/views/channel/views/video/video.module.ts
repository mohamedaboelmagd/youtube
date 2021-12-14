import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxStarRatingModule } from 'ngx-star-rating';

import * as fromContainers from './containers';
import * as fromPipes from './pipes';
import * as fromServices from './services';
import { VideoRoutingModule } from './video-routing.module';

const MATERIALS = [MatButtonModule, MatIconModule];
@NgModule({
  declarations: [...fromContainers.CONTAINERS, ...fromPipes.PIPES],
  imports: [
    CommonModule,
    VideoRoutingModule,
    NgxStarRatingModule,
    FormsModule,
    ReactiveFormsModule,
    ...MATERIALS,
  ],
  providers: [...fromServices.SERVICES],
})
export class VideoModule {}
