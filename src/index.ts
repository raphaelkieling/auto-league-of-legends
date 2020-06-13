import LCUConnector from "./connectors/index";
import GameSession, { GamePhase } from "./models/gameSession";

const connector = new LCUConnector();

connector.gameConnector.on("queue-match-found", () => {
  connector.gameConnector.accept();
});

connector.gameConnector.on("match-session-start", (gameSession: GameSession | null) => {
  if (!gameSession) return;

  const AKALI_ID = 84
  const HEIMER_ID = 74

  if (gameSession.timer.phase === GamePhase.PLANNING) {
    return connector.gameConnector.selectChampion(gameSession.getMyBanAction().id, AKALI_ID);
  }

  if (gameSession.timer.phase === GamePhase.BAN_PICK && gameSession.getMyBanAction()) {
    return connector.gameConnector.selectChampion(gameSession.getMyBanAction().id, HEIMER_ID)
      .then(() => {
        connector.gameConnector.completeAction(gameSession.getMyBanAction().id);
      })
      .catch(err => err.response);
  }

  if (gameSession.timer.phase === GamePhase.BAN_PICK && gameSession.getMyPickAction()) {
    const bans = gameSession.bans.myTeamBans.concat(gameSession.bans.theirTeamBans);

    return connector.gameConnector.selectChampion(gameSession.getMyPickAction().id, AKALI_ID)
      .then(() => {
        connector.gameConnector.completeAction(gameSession.getMyPickAction().id);
      })
      .catch(err => err.response);
  }
});

connector.initListener();