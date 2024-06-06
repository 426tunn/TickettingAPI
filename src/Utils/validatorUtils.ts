import { isValidObjectId } from "mongoose";

export function isValidMongooseIdValidator(idKey: string) {
    return async (value: string) => {
        if (!isValidObjectId(value)) {
            throw new Error(`Invalid ${idKey} Id`);
        }
    };
}
