import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as fromContainers from './containers';

const routes: Routes = [
  { path: '', component: fromContainers.ChannelHomeComponent },
  {
    path: ':videoId',
    loadChildren: () =>
      import('./views/video/video.module').then((module) => module.VideoModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelRoutingModule {}
