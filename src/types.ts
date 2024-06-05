export interface MediaProps {
  videoUrl: string;
  title: string;
  logo: string;
}

export interface CategoryData {
  [subGroup: string]: MediaProps[];
}

export interface PlaylistData {
  [mainGroup: string]: CategoryData;
}
