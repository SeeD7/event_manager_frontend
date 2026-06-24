import { User } from "./user.model";

export class EventCategory {
    id!: number;
    name!: string;
    icon!: string;
    createdDate!: Date;
    creator!: String;
    lastUpdatedDate!: Date;
    lastUpdater!: string;
}