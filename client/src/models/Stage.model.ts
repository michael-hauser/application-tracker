export enum StageType {
    Init = 'init',
    Active1 = 'active1',
    Active2 = 'active2',
    Pause = 'pause',
    Fail = 'fail',
    Success = 'success',
}

export interface Stage {
    _id: string;
    name: string;
    type: StageType;
    number: number;
}