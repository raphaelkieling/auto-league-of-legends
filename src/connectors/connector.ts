import events from "events";
import logger from "../config/logger";


export default abstract class Connector extends events.EventEmitter {
    protected onlyOnChange(parameter: any, newValue: any, callback: () => void) {
        if (this[parameter] !== newValue) {
            this[parameter] = newValue;
            callback();
        }
    }

    emit(event: string | symbol, ...args: any[]): boolean {
        logger.info(`[event]: ${event.toString()}`);
        return super.emit(event, ...args);
    }

    abstract initListener(): void;
}