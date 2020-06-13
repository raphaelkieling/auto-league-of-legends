import fs from "fs";
import path from "path";
import axios from "axios";
import https from "https";
import GameConnector from "./game";
import Connector from "./connector";
import ClientConnector from "./client";
import SummonerConnector from "./summoner";
import WebSocket from "ws";
import { loggerToFile } from "../config/logger";

export interface Lockfile {
  pid: number;
  port: number;
  password: string;
  protocol: string;
  authToken: string;
  baseUri: string;
  wsBaseUri: string;
}

export class LolSocketEvent {
  type: number;
  data: any;
  event: string;

  fromArray(data: any[]): this {
    this.type = data[0];
    this.event = data[1];
    this.data = data[2];
    return this;
  }

  getData<T>(): T | null {
    if (this.data) {
      return this.data.data as T;
    } else {
      return null;
    }
  }
}

export default class LCUConnector extends Connector {
  lockFile?: Lockfile;
  gameConnector?: GameConnector = new GameConnector(this);
  clientConnector?: ClientConnector = new ClientConnector(this);
  summonerConnector?: SummonerConnector = new SummonerConnector(this);
  connected = false;
  wss?: WebSocket;
  wssEvents?: Map<string, ((data: any) => void)[]> = new Map()

  getAuthLockFile(): Promise<Lockfile | null> {
    return new Promise(resolve => {
      fs.readFile(
        path.join("C:\\Riot Games\\League of Legends", "lockfile"),
        "utf8",
        (err: any, data: any) => {
          if (err) return resolve(null);

          const d = data.split(":");
          resolve(
            {
              pid: d[1],
              port: d[2],
              password: d[3],
              protocol: d[4],
              authToken: "Basic " +
                Buffer.from("riot:" + d[3]).toString("base64"),
              baseUri: `${d[4]}://riot:${d[3]}@127.0.0.1:${d[2]}`,
              wsBaseUri: `wss://riot:${d[3]}@127.0.0.1:${d[2]}`
            },
          );
        },
      );
    });
  }

  makeRequest<T>(
    method: "get" | "post" | "put" | "patch",
    url: string,
    data: any = {},
  ): Promise<T> {
    if (!this.lockFile) {
      return Promise.reject("Lockfile not found");
    }

    const instance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    return instance({
      url: `${this.lockFile.baseUri}${url}`,
      method,
      data,
      headers: { "Authorization": this.lockFile.authToken },
    })
      .then((a: any) => a.data);
  }

  async connection() {
    const data = await this.getAuthLockFile();
    if (data) {
      this.lockFile = data;
      this.onlyOnChange("connected", true, () => this.emit("connect", data))
    } else {
      this.lockFile = null;
      this.onlyOnChange("connected", false, () => this.emit("disconnect", data))
    }
  }

  getSwagger(): Promise<any> {
    return this.makeRequest<any>("get", "/swagger/v3/openapi.json")
  }

  initSocketListener(event: string, callback: (data: LolSocketEvent) => void) {
    this.wss.send("[5,\"" + event + "\"]");
    if (this.wssEvents.has(event)) {
      const events = this.wssEvents.get(event);
      this.wssEvents.set(event, [...events, callback]);
    } else {
      this.wssEvents.set(event, [callback]);
    }
  }

  initSocketConnection(): any {
    this.on("connect", (config) => {
      this.wss = new WebSocket(config.wsBaseUri, {
        rejectUnauthorized: false
      });

      this.wss.on("open", () => {
        this.emit("socket-open");
      });

      this.wss.on('message', (data) => {
        loggerToFile.info(data);
        if (!data) return;

        data = JSON.parse(data)

        if (this.wssEvents.has(data[1])) {
          this.wssEvents.get(data[1]).forEach(callback => callback(new LolSocketEvent().fromArray(data)))
        }
      });
    })

  }

  initListener() {
    this.connection();
    this.gameConnector.initListener();
    this.initSocketConnection();
  }
}
