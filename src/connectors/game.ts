import LCUConnector from "./index";
import GameSearch from "../models/gameSearch";
import Connector from "./connector";
import GameSession from "../models/gameSession";

enum StatusQueueMatch {
  stopped,
  founded,
  searching,
  error
}

export default class GameConnector extends Connector {
  statusQueueMatch?: StatusQueueMatch;
  gameSession?: GameSession;

  constructor(private lcuConnector: LCUConnector) {
    super();
  }

  decline() {
    this.lcuConnector.makeRequest("post", "/lol-matchmaking/v1/ready-check/decline")
      .then(() => {
        this.emit("queue-match-declined")
      })
      .catch(() => {
        this.emit("queue-match-declined-error")
      })
  }

  accept() {
    this.lcuConnector.makeRequest("post", "/lol-matchmaking/v1/ready-check/accept")
      .then(() => {
        this.emit("queue-match-accepted")
      })
      .catch(() => {
        this.emit("queue-match-accepted-error")
      })
  }

  match() {
    return this.lcuConnector.makeRequest<GameSearch>("get", "/lol-matchmaking/v1/search")
      .then(data => {
        if (!data) {
          this.onlyOnChange("statusQueueMatch", StatusQueueMatch.stopped, () => this.emit("queue-match-stop"))
        }

        const gameSearch = new GameSearch(data);

        if (gameSearch.isFounded()) {
          this.onlyOnChange("statusQueueMatch", StatusQueueMatch.founded, () => this.emit("queue-match-found", gameSearch))
        } else if (gameSearch.isSearching()) {
          this.onlyOnChange("statusQueueMatch", StatusQueueMatch.searching, () => this.emit("queue-match-search", gameSearch))
        }
      })
      .catch(() => {
        this.onlyOnChange("statusQueueMatch", StatusQueueMatch.error, () => this.emit("queue-match-error"))
      })
  }

  matchSession() {
    return this.lcuConnector.makeRequest<GameSession>("get", "/lol-champ-select/v1/session")
      .then(gameSession => {
        const gameSessionInstace = new GameSession(gameSession);
        this.onlyOnChange("gameSession", gameSessionInstace, () => this.emit("match-session", gameSessionInstace))
      })
      .catch(err => {
        this.onlyOnChange("gameSession", null, () => this.emit("match-session", null))
      })
  }

  selectChampion(actionId: number, championId: number) {
    return this.lcuConnector.makeRequest("patch", "/lol-champ-select/v1/session/actions/" + actionId.toString(), {
      championId
    });
  }

  completeAction(actionId: number) {
    return this.lcuConnector.makeRequest("post", `/lol-champ-select/v1/session/actions/${actionId.toString()}/complete`);
  }

  initListener() {
    this.match();
    this.matchSession();
  }
}
