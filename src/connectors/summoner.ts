import LCUConnector from "./index";
import Connector from "./connector";
import Summoner from "src/models/summoner";

export default class SummonerConnector extends Connector {
    constructor(private lcuConnector: LCUConnector) {
        super();

        this.lcuConnector.on("connect", async () => {
            const summoner: Summoner = await this.getCurrentSummoner();
            this.emit("summoner", summoner);
        })
    }

    getCurrentSummoner(): Promise<Summoner> {
        return this.lcuConnector.makeRequest<Summoner>("get", "/lol-summoner/v1/current-summoner")
    }

    initListener() { }
}
