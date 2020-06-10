import fs from "fs";
import path from "path";
import axios from "axios";
import https from "https";
import GameSearch from "../models/gameSearch";
import GameConnector from "./game";
import Connector from "./connector";

export interface Lockfile {
  pid: number;
  port: number;
  password: string;
  protocol: string;
  authToken: string;
  baseUri: string;
}

export default class LCUConnector extends Connector {
  lockFile?: Lockfile;
  gameConnector?: GameConnector = new GameConnector(this);
  connected = false;

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
              baseUri: `${d[4]}://riot:${d[3]}@127.0.0.1:${d[2]}/`,
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
      url: `https://127.0.0.1:${this.lockFile.port}${url}`,
      method,
      data,
      headers: { "Authorization": this.lockFile.authToken },
    })
      .then((a: any) => a.data);
  }

  onFoundAGame(): Promise<GameSearch | null> {
    return new Promise((resolve, reject) => {
      return this.makeRequest<GameSearch>("get", "/lol-matchmaking/v1/search")
        .then((item) => new GameSearch(item))
        .then(resolve)
        .catch((err: Error) => reject(err.message));
    });
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

  initListener() {
    this.connection();
    this.gameConnector.initListener();
  }
}
