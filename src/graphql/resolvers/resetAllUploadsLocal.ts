import {HashMap} from "../../types";

export const resetAllUploadsLocal = (_: any, __: HashMap<any>, context: any) => {
    context.cache.writeData({
        data: {
            uploading: [],
        },
    });

    return true;
};
