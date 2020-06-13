import spells from "./spells.json"
import Spell from "../models/spell";

export function getSpells() {
    return Object.keys(spells.data).map(key => {
        const attrData = spells.data[key];
        return new Spell(attrData);
    })
}