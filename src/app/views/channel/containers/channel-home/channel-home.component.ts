import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';

import * as fromModels from '../../models';
import * as fromServices from '../../services';

@Component({
  selector: 'app-channel-home',
  templateUrl: './channel-home.component.html',
  styleUrls: ['./channel-home.component.scss'],
})
export class ChannelHomeComponent implements OnInit {
  pending: boolean = false;
  error: boolean;
  channel$: Observable<fromModels.IChannelList>;

  constructor(private channelService: fromServices.ChannelService) { }

  ngOnInit(): void {
    // this.channel$ = this.channelService.loadChannel('UC_x5XG1OV2P6uZZ5FSM9Ttw');

    // const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw';
    const channelId = 'UC-1l0Ew_jMorWJ0d9RWk5wg';
    this.channel$ = this.channelService.exists(channelId).pipe(
      take(1),
      switchMap((exist) => {
        console.log(exist);
        if (exist) {
          return this.channelService.loadChannelList(channelId);
        } else {
          return this.channelService.loadChannel(channelId).pipe(
            filter((res) => !!res),
            tap((res) => this.channelService.addItem(channelId, res))
          );
        }
      }),
    );

    // UC_x5XG1OV2P6uZZ5FSM9Ttw;
    // UUTI5S0PqpgB0DbYgcgRU6QQ;
    // UC-1l0Ew_jMorWJ0d9RWk5wg
    // if (localStorage.getItem('UC_x5XG1OV2P6uZZ5FSM9Ttw')) {
    //   this.playlist = JSON.parse(
    //     localStorage.getItem('UC_x5XG1OV2P6uZZ5FSM9Ttw') as string
    //   );
    //   console.log(this.playlist);
    // } else {
    //   this.getPlaylist('UC_x5XG1OV2P6uZZ5FSM9Ttw');
    // }
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
    const pageToken = direction === fromModels.PageDirection.NEXT ? channel.nextPageToken : channel.prevPageToken
    this.channel$ = this.channelService.exists(channel?.id, pageToken).pipe(
      switchMap((exist) => {
        console.log(exist);
        if (exist) {
          return this.channelService.loadChannelList(channel.id, pageToken);
        } else {
          return this.channelService.movePage(channel, direction).pipe(
            filter((res) => !!res),
            tap((res) => this.channelService.addItem(channel.id, res, pageToken))
          );
        }
      }),
      tap((result) => {
        this.pending = false;
      }),
      catchError((err) => {
        console.log(err);
        this.pending = false;
        this.error = true;
        throw err;
      })
    );

    // this.channel$ = this.channelService.movePage(channel, direction).pipe(
    //   tap((result) => {
    //     this.pending = false;
    //   }),
    //   catchError((err) => {
    //     console.log(err);
    //     this.pending = false;
    //     this.error = true;
    //     throw err;
    //   })
    // );
    // .subscribe(
    //   (playList) => {
    //     this.playlist = playList;
    //     this.pending = false;
    //   },
    //   (err) => {
    //     this.pending = false;
    //     this.error = true;
    //     console.log(err);
    //   }
    // );
    // }
  }
}
