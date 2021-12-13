import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

import { ChannelRoutingModule } from './channel-routing.module';
import * as fromContainers from './containers';
import * as fromServices from './services';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const MATERIALS = [
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatInputModule,
];
@NgModule({
  declarations: [...fromContainers.CONTAINERS],
  imports: [
    CommonModule,
    ChannelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...MATERIALS,
  ],
  providers: [...fromServices.SERVICES],
})
export class ChannelModule {}
