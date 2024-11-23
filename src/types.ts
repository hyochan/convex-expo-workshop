import {DataModel} from '../convex/_generated/dataModel';

export type ChatMessage = Omit<DataModel['messages']['document'], 'author'>;
