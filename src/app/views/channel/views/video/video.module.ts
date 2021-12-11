import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import * as fromContainers from './containers';
import * as fromServices from './services';
import { VideoRoutingModule } from './video-routing.module';

@NgModule({
  declarations: [...fromContainers.CONTAINERS],
  imports: [CommonModule, VideoRoutingModule],
  providers: [...fromServices.SERVICES],
})
export class VideoModule {}
