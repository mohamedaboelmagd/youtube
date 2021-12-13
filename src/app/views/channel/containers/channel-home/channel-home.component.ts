import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';

import * as fromModels from '../../models';
import * as fromServices from '../../services';

@Component({
  selector: 'app-channel-home',
  templateUrl: './channel-home.component.html',
  styleUrls: ['./channel-home.component.scss'],
})
export class ChannelHomeComponent implements OnInit, OnDestroy {
  form: FormGroup;

  channelId: string = 'UCx4a8EMmXx-6RuJlyAKASoQ';

  pending: boolean = false;
  error: boolean;
  channel: fromModels.IChannelList;

  dataSource: MatTableDataSource<fromModels.IVideo> = new MatTableDataSource();
  @ViewChild(MatSort) matSort: MatSort;

  sort: string;
  sortType: 'asc' | 'desc';

  initColumns: any[] = [
    { name: 'imgURL', display: 'img' },
    { name: 'title', display: 'title' }, // add `.name` to name attr if you want to use dynamic mapping for columns
    { name: 'publishedAt', display: 'Published At' },
    { name: 'id', display: 'Id' },
  ];
  displayedColumns: any[] = this.initColumns.map((col) => col.name);

  subscription = new Subscription();

  get filterControl() {
    return this.form.get('filter') as AbstractControl;
  }

  constructor(
    private channelService: fromServices.ChannelService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      filter: [''],
    });
  }

  ngOnInit(): void {
    // this.channel$ = this.channelService.loadChannel('UC_x5XG1OV2P6uZZ5FSM9Ttw');

    // this.channelId = 'UCx4a8EMmXx-6RuJlyAKASoQ';
    // 'UCXVDBeCwro9FqNeBr41Q2BQ'
    //'UCee3jrGUdb2ovrE7v4ncH3Q'
    // 'UC-1l0Ew_jMorWJ0d9RWk5wg';
    // UC_x5XG1OV2P6uZZ5FSM9Ttw;
    // UUTI5S0PqpgB0DbYgcgRU6QQ;
    this.search();
    this.subscription.add(
      this.filterControl?.valueChanges
        ?.pipe(debounceTime(1000))
        .subscribe((filter) => this.applyFilter(filter))
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  search() {
    this.pending = true;
    this.subscription.add(
      this.channelService
        .exists(this.channelId)
        .pipe(
          switchMap((exist) => {
            if (exist) {
              return this.channelService.loadChannelList(this.channelId);
            } else {
              return this.channelService.loadChannel(this.channelId).pipe(
                filter((res) => !!res),
                tap((res) => this.channelService.addItem(this.channelId, res))
              );
            }
          }),
          tap((channel) => {
            this.dataSource = new MatTableDataSource(channel.videos);
            this.channel = channel;
            this.pending = false;
          })
        )
        .subscribe()
    );
  }

  loadPrevious(channel: fromModels.IChannelList) {
    this.paginateChannel(channel, fromModels.PageDirection.PREVIOUS);
  }

  loadNext(channel: fromModels.IChannelList) {
    this.paginateChannel(channel, fromModels.PageDirection.NEXT);
  }

  private paginateChannel(
    channel: fromModels.IChannelList,
    direction: fromModels.PageDirection
  ) {
    this.pending = true;
    this.error = false;
    // if (this.playlist) {
    const pageToken =
      direction === fromModels.PageDirection.NEXT
        ? channel.nextPageToken
        : channel.prevPageToken;
    this.subscription.add(
      this.channelService
        .exists(channel?.id, pageToken)
        .pipe(
          switchMap((exist) => {
            if (exist) {
              return this.channelService.loadChannelList(channel.id, pageToken);
            } else {
              return this.channelService.movePage(channel, direction).pipe(
                filter((res) => !!res),
                tap((res) =>
                  this.channelService.addItem(channel.id, res, pageToken)
                )
              );
            }
          }),
          tap((result) => {
            this.dataSource = new MatTableDataSource(result.videos);
            this.channel = result;
            this.pending = false;
          }),
          catchError((err) => {
            this.pending = false;
            this.error = true;
            throw err;
          })
        )
        .subscribe()
    );
  }

  sortVideos({ active, direction }: { active: string; direction: any }) {
    this.pending = true;
    this.error = false;
    this.sortType = direction;
    this.sort = active;
    this.subscription.add(
      this.channelService
        .loadChannel(
          this.channelId,
          '',
          '',
          (direction?.toUpperCase() as 'ASC' | 'DESC') === 'ASC' ? active : ''
        )
        .pipe(
          tap((channel) => {
            this.dataSource = new MatTableDataSource(channel.videos);
            this.channel = channel;
            this.pending = false;
          })
        )
        .subscribe()
    );
  }

  applyFilter(filterValue: string) {
    this.pending = true;
    this.error = false;
    filterValue = filterValue?.trim()?.toLowerCase();
    this.subscription.add(
      this.channelService
        .loadChannel(this.channelId, '', filterValue)
        .pipe(
          tap((channel) => {
            this.dataSource = new MatTableDataSource(channel.videos);
            this.channel = channel;
            this.pending = false;
          })
        )
        .subscribe()
    );
  }
}
