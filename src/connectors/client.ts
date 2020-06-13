import LCUConnector from "./index";
import Connector from "./connector";

export default class ClientConnector extends Connector {

    constructor(private lcuConnector: LCUConnector) {
        super();
    }

    getPatchVersion(): Promise<string> {
        return this.lcuConnector.makeRequest("get", "/lol-patch/v1/game-version");
    }

    getConfig(): any {
        return this.lcuConnector.makeRequest("get", "/lol-game-settings/v1/game-settings");
    }

    getCommandLineArgs(): Promise<string[]> {
        return this.lcuConnector.makeRequest("get", "/riotclient/command-line-args");
    }

    killAndRestartUx(): Promise<any> {
        return this.lcuConnector.makeRequest("post", "/riotclient/kill-and-restart-ux");
    }

    initListener() { }
}
