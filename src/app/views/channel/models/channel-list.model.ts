import { IVideo } from './video.model';

export interface IChannelList {
  id: string;
  total: number;
  pages: number;
  nextPageToken: string;
  prevPageToken: string;
  videos: IVideo[];
}
