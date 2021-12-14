import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { ChannelRoutingModule } from './channel-routing.module';
import * as fromContainers from './containers';
import * as fromServices from './services';

const MATERIALS = [
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
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
