export class SpellImage {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(model: SpellImage) {
        this.full = model.full;
        this.sprite = model.sprite;
        this.x = model.x;
        this.y = model.y;
        this.w = model.w;
        this.h = model.h;
    }
}

export default class Spell {
    name: string;
    id: string;
    key: number;
    image: SpellImage;
    constructor(model: Spell) {
        this.name = model.name;
        this.id = model.id;
        this.key = model.key;
        this.image = new SpellImage(model.image);
    }


    getImageLink(): string {
        return `http://ddragon.leagueoflegends.com/cdn/10.11.1/img/spell/${this.id}.png`
    }
}