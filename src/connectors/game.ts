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

  watchSearch() {
    this.lcuConnector.initSocketListener("OnJsonApiEvent_lol-matchmaking_v1_search", (socketEvent) => {
      const data = socketEvent.getData<GameSearch>();

      if (!data) {
        return this.emit("queue-match-stop")
      }

      const gameSearch = new GameSearch(data);

      if (gameSearch.isFounded()) {
        this.emit("queue-match-found", gameSearch)
      } else if (gameSearch.isSearching()) {
        this.emit("queue-match-search", gameSearch)
      }
    })
  }

  watchChampSession(): void {
    this.lcuConnector.initSocketListener("OnJsonApiEvent_lol-champ-select_v1_session", (socketEvent) => {
      const data = socketEvent.getData<GameSession>();

      if (!data) {
        this.gameSession = null;
        return this.emit("match-session", null)
      }

      const gameSession = new GameSession(data);

      this.gameSession = gameSession

      this.emit("match-session", this.gameSession);
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

  getChampionInfoSession(championId: number) {
    return this.lcuConnector.makeRequest("get", `/lol-champ-select/v1/grid-champions/${championId.toString()}`);
  }

  setSpells(spell1Id: number, spell2Id: number): Promise<any> {
    return this.lcuConnector.makeRequest("patch", "/lol-champ-select/v1/session/my-selection", {
      spell1Id,
      spell2Id
    });
  }

  initListener() {
    this.lcuConnector.on("socket-open", () => {
      this.watchSearch();
      this.watchChampSession();
    });
  }
}
