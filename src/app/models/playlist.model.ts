import { IVideo } from './video.model';

export interface IPlayList {
  id: string;
  total: number;
  pages: number;
  nextPageToken: string;
  prevPageToken: string;
  videos: IVideo[];
}
