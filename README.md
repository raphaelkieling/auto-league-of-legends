## Auto Lol

```js
const connector = new LCUConnector();

connector.gameConnector.on("queue-match-found", () => {
    //to accept a match founded on queue 
    connector.gameConnector.accept()
});

connector.gameConnector.on("match-session", (gameSession: GameSession | null) => {
    if (!gameSession) return;

    connector.gameConnector.selectChampion(gameSession.getMyPickAction().id, 84)
});
```