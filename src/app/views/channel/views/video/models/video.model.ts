interface IThumbnail {
  url: string;
  width: number;
  height: number;
}

interface Thumbnails {
  default: IThumbnail;
  medium: IThumbnail;
  high: IThumbnail;
  standard: IThumbnail;
  maxres: IThumbnail;
}

export interface IVideoSnippet {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  tags: string[];
  categoryId: string;
  liveBroadcastContent: string;
  defaultLanguage: string;
  localized: {
    title: string;
    description: string;
  };
  defaultAudioLanguage: string;
}

export interface IVideoContentDetails {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  contentRating: {};
  projection: string;
}

export interface IVideoStatistics {
  viewCount: string;
  likeCount: string;
  dislikeCount: string;
  favoriteCount: string;
  commentCount: string;
}

export interface IVideoItem {
  kind: string;
  etag: string;
  id: string;
  snippet: IVideoSnippet;
  contentDetails: IVideoContentDetails;
  statistics: IVideoStatistics;
}

export interface IVideoResponse {
  kind: string;
  etag: string;
  items: IVideoItem[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface IVideo {
  id: string;
  title: string;
  publishedAt: number;
  duration: string;
  likeCount: string;
  viewCount: string;
  description: string;
  imgUrl: string;
}
