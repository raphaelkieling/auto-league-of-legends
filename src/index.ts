import LCUConnector from "./connectors/index";
import GameSession, { GamePhase } from "./models/gameSession";

const connector = new LCUConnector();

connector.gameConnector.on("queue-match-found", () => {
  connector.gameConnector.accept()
});

connector.gameConnector.on("match-session", (gameSession: GameSession | null) => {
  if (!gameSession) return;

  console.log(gameSession.timer.phase === GamePhase.BAN_PICK )
  console.log(gameSession.getMyPickAction())

  if (gameSession.timer.phase === GamePhase.BAN_PICK && gameSession.getMyBanAction()) {
    connector.gameConnector.selectChampion(gameSession.getMyBanAction().id, 83)
    connector.gameConnector.completeAction(gameSession.getMyBanAction().id);
  }

  if (gameSession.timer.phase === GamePhase.BAN_PICK && gameSession.getMyPickAction()) {
    connector.gameConnector.selectChampion(gameSession.getMyPickAction().id, 84)
    connector.gameConnector.completeAction(gameSession.getMyPickAction().id);
  }
});

setInterval(async () => {
  connector.initListener();
}, 1000)