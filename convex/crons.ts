import {cronJobs} from 'convex/server';
import {internal} from './_generated/api';
import {Id} from './_generated/dataModel';

const crons = cronJobs();

crons.interval(
  'Add AI message every minute',
  {minutes: 1},
  internal.actions.fetchAndInsertAiMessage,
  {author: 'j97d6x6smxpb8p2rhk96g13mpd71znb1' as Id<'users'>},
);

export default crons;
