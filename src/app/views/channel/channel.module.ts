import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChannelRoutingModule } from './channel-routing.module';
import * as fromContainers from './containers';
import * as fromServices from './services';

@NgModule({
  declarations: [...fromContainers.CONTAINERS],
  imports: [CommonModule, ChannelRoutingModule],
  providers: [...fromServices.SERVICES],
})
export class ChannelModule {}
