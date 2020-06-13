export class RerollPoints {
    currentPoints: number;
    maxRolls: number;
    numberOfRolls: number;
    pointsCostToRoll: number;
    pointsToReroll: number

    constructor(model: RerollPoints) {
        this.currentPoints = model.currentPoints;
        this.maxRolls = model.maxRolls;
        this.numberOfRolls = model.numberOfRolls;
        this.pointsCostToRoll = model.pointsCostToRoll;
        this.pointsToReroll = model.pointsToReroll;
    }
}

export default class Summoner {
    accountId: number;
    displayName: string;
    internalName: string;
    percentCompleteForNextLevel: number;
    profileIconId: number;
    puuid: string;
    rerollPoints: RerollPoints;
    summonerId: number;
    summonerLevel: number;
    xpSinceLastLevel: number;
    xpUntilNextLevel: number;

    constructor(model: Summoner) {
        this.accountId = model.accountId;
        this.displayName = model.displayName;
        this.internalName = model.internalName;
        this.percentCompleteForNextLevel = model.percentCompleteForNextLevel;
        this.profileIconId = model.profileIconId;
        this.puuid = model.puuid;
        this.rerollPoints = new RerollPoints(model.rerollPoints);
        this.summonerId = model.summonerId;
        this.summonerLevel = model.summonerLevel;
        this.xpSinceLastLevel = model.xpSinceLastLevel;
        this.xpUntilNextLevel = model.xpUntilNextLevel;
    }
}