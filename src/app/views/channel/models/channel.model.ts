interface IThumbnail {
  url: string;
  width: number;
  height: number;
}

interface IThumbnails {
  default: IThumbnail;
  medium: IThumbnail;
  high: IThumbnail;
}

interface IChannelSnippet {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: IThumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: Date;
}

export interface IChannelItemResponse {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId?: string;
    playlistId?: string;
  };
  snippet: IChannelSnippet;
}

// id: string; // added by service
export interface IChannelResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: IChannelItemResponse[];
  prevPageToken?: string;
}
