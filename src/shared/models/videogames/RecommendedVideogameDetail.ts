export type RecommendedVideogameDetail = {
  Id: number;
  Name: string;
};

export type TimeToBeat = {
  gameId: number;
  normally: number;
  completely: number;
};

export type RecommendGameResponse = {
  videogameDetails: RecommendedVideogameDetail;
  timeToBeat: TimeToBeat;
};
