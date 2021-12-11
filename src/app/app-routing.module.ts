import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
};

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/channel/channel.module').then(
        (module) => module.ChannelModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routingConfiguration)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
