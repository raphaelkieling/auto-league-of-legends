export enum GameSearchState {
  FOUND = "Found",
  SEARCHING = "Searching",
}

export default class GameSearch {
  estimatedQueueTime: number;
  searchState: GameSearchState;
  timeInQueue: number;
  queueId: number;

  constructor(model: GameSearch) {
    this.estimatedQueueTime = model.estimatedQueueTime;
    this.searchState = model.searchState;
    this.timeInQueue = model.timeInQueue;
    this.queueId = model.queueId;
  }

  isFounded() {
    return this.searchState === GameSearchState.FOUND;
  }

  isSearching() {
    return this.searchState === GameSearchState.SEARCHING;
  }
}
