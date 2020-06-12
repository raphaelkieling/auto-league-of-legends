import LCUConnector from "./connectors/index";
import GameSession, { GamePhase } from "./models/gameSession";

const connector = new LCUConnector();

connector.on("connect", () => {
  connector.makeRequest("get", "/swagger/v3/openapi.json").then(console.log).catch(err => console.log(err.response))
})

// connector.gameConnector.on("queue-match-found", () => {
//   connector.gameConnector.accept()
// });

// connector.gameConnector.on("match-session", (gameSession: GameSession | null) => {
//   if (!gameSession) return;


//   if (gameSession.timer.phase === GamePhase.PLANNING) {
//     console.log('PICKANDO')
//     console.log(gameSession.actions.map(a => a.filter(b => b.actorCellId === gameSession.localPlayerCellId)))
//     connector.gameConnector.selectChampion(gameSession.getMyBanAction().id, 84).catch(err => err.response);
//   }

//   if (gameSession.timer.phase === GamePhase.BAN_PICK && gameSession.getMyBanAction()) {
//     connector.gameConnector.selectChampion(gameSession.getMyBanAction().id, 74)
//       .then(() => {
//         connector.gameConnector.completeAction(gameSession.getMyBanAction().id);
//       })
//       .catch(err => err.response);
//   }

//   if (gameSession.timer.phase === GamePhase.BAN_PICK && gameSession.getMyPickAction()) {
//     connector.gameConnector.selectChampion(gameSession.getMyPickAction().id, 84)
//       .then(() => {
//         connector.gameConnector.completeAction(gameSession.getMyPickAction().id);
//       })
//       .catch(err => err.response);
//   }
// });

setInterval(async () => {
  connector.initListener();
}, 5000)