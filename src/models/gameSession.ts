export class GameBans {

    myTeamBans: number[];
    numBans: number;
    theirTeamBans: any[];

    constructor(model: GameBans) {
        this.myTeamBans = model.myTeamBans;
        this.numBans = model.numBans;
        this.theirTeamBans = model.theirTeamBans;
    }
}

export enum ActionType {
    PICK = 'pick',
    BAN = 'ban'
}

export class GameAction {
    actorCellId: number;
    championId: number;
    completed: boolean;
    id: number;
    isAllyAction: boolean;
    isInProgress: boolean;
    pickTurn: number;
    type: ActionType;

    constructor(model: GameAction) {
        this.actorCellId = model.actorCellId;
        this.championId = model.championId;
        this.completed = model.completed;
        this.id = model.id;
        this.isAllyAction = model.isAllyAction;
        this.isInProgress = model.isInProgress;
        this.pickTurn = model.pickTurn;
        this.type = model.type;
    }
}

export class TeamPick {
    // TODO: Não sei se vai ficar assim essas lanes mas jungler ta certo
    assignedPosition: "jungler" | "top" | "middle" | "bottom" | "utility";
    cellId: number;
    championId: number;
    championPickIntent: number;
    entitledFeatureType: string;
    selectedSkinId: number;
    spell1Id: number;
    spell2Id: number;
    summonerId: number;
    team: number;
    wardSkinId: number;

    constructor(model: TeamPick) {
        this.assignedPosition = model.assignedPosition;
        this.cellId = model.cellId;
        this.championId = model.championId;
        this.championPickIntent = model.championPickIntent;
        this.entitledFeatureType = model.entitledFeatureType;
        this.selectedSkinId = model.selectedSkinId;
        this.spell1Id = model.spell1Id;
        this.spell2Id = model.spell2Id;
        this.summonerId = model.summonerId;
        this.team = model.team;
        this.wardSkinId = model.wardSkinId;
    }
}

export enum GamePhase {
    BAN_PICK = 'BAN_PICK',
    FINALIZATION = 'FINALIZATION',
    PLANNING = 'PLANNING'
}

export class GameTimer {
    adjustedTimeLeftInPhase: number;
    internalNowInEpochMs: number;
    isInfinite: boolean;
    phase: GamePhase;
    totalTimeInPhase: number;

    constructor(model: GameTimer) {
        this.adjustedTimeLeftInPhase = model.adjustedTimeLeftInPhase;
        this.internalNowInEpochMs = model.internalNowInEpochMs;
        this.isInfinite = model.isInfinite;
        this.phase = model.phase;
        this.totalTimeInPhase = model.totalTimeInPhase;
    }
}

export default class GameSession {
    actions: GameAction[][];
    allowBattleBoost: boolean;
    allowSkinSelection: boolean;
    bans: GameBans;
    hasSimultaneousPicks: boolean;
    localPlayerCellId: number;
    myTeam: TeamPick[];
    theirTeam: TeamPick[];
    timer: GameTimer;

    constructor(model: GameSession) {
        this.actions = model.actions.map(item => item.map(item2 => new GameAction(item2)));
        this.allowBattleBoost = model.allowBattleBoost;
        this.allowSkinSelection = model.allowSkinSelection;
        this.bans = new GameBans(model.bans);
        this.hasSimultaneousPicks = model.hasSimultaneousPicks;
        this.localPlayerCellId = model.localPlayerCellId;
        this.myTeam = model.myTeam.map(item => new TeamPick(item));
        this.theirTeam = model.theirTeam.map(item => new TeamPick(item));
        this.timer = new GameTimer(model.timer);
    }

    getMyPickAction(): GameAction | null {
        let pickAction: GameAction | null = null;

        this.actions.forEach(actionsArray => {
            const actions = actionsArray.filter(items2 =>
                items2.type === ActionType.PICK &&
                items2.actorCellId == this.localPlayerCellId &&
                items2.completed == false &&
                items2.isInProgress == true
            );
            if (!pickAction)
                pickAction = actions.length ? actions[0] : null;
        })

        return pickAction;
    }


    getMyBanAction(): GameAction | null {
        let pickAction: GameAction | null = null;

        this.actions.forEach(actionsArray => {
            const actions = actionsArray.filter(items2 =>
                items2.type === ActionType.BAN &&
                items2.actorCellId == this.localPlayerCellId &&
                items2.completed == false &&
                items2.isInProgress == true
            );

            if (!pickAction)
                pickAction = actions.length ? actions[0] : null;
        })

        return pickAction;
    }
}