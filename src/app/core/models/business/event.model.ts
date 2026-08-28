import { EventCategoryLight } from "./event-category.model";
import { EventStateEnum } from "./event-state.enum";
import { User } from "./user.model";

export class Event {
    id!: number;
    name!: string;
    description!: string;
    location!: string;
    creator!: User;
    category!: EventCategoryLight[];
    state!: EventStateEnum;
    allDay!: boolean;
    startDate!: Date;
    endDate!: Date;
    spotsAvailable!: number;
    participants!: User[];
    createdDate!: Date;
    lastUpdatedDate!: Date;
    isCurrentUserRegistered!: boolean;
    isCurrentUserInWaitingList!: boolean;
}

export class EventForm {
    id!: number;
    name!: string;
    description!: string;
    location!: string;
    category!: EventCategoryLight[];
    state!: EventStateEnum;
    allDay!: boolean;
    startDate!: Date;
    endDate!: Date;
    spotsAvailable!: number;
    participants!: User[];
}

export class EventLight {
    id!: number;
    name!: string;
    category!: EventCategoryLight[];
    state!: EventStateEnum;
    allDay!: boolean;
    startDate!: Date;
    endDate!: Date;
    spotsAvailable!: number;
    participants!: number;
    waitingList!: number;
}