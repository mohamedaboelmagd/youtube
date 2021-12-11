import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import * as fromServices from '../../services';
import * as fromModels from '../../models';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-channel-home',
  templateUrl: './channel-home.component.html',
  styleUrls: ['./channel-home.component.scss'],
})
export class ChannelHomeComponent implements OnInit {
  pending: boolean = false;
  error: boolean;
  channel$: Observable<fromModels.IChannelList>;

  constructor(private channelService: fromServices.ChannelService) {}

  ngOnInit(): void {
    this.channel$ = this.channelService.loadChannel('UC_x5XG1OV2P6uZZ5FSM9Ttw');

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
    this.channel$ = this.channelService.movePage(channel, direction).pipe(
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
