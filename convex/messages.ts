import {internalMutation, mutation, query} from './_generated/server';
import {v} from 'convex/values';
import {userByExternalId} from './users';
import {paginationOptsValidator} from 'convex/server';

export const saveMessage = mutation({
  args: v.object({
    _id: v.optional(v.string()),
    message: v.string(),
    reply: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called saveMessage without authentication present');
    }

    const user = await userByExternalId(ctx, identity.tokenIdentifier);

    if (!user) {
      throw new Error('User not found');
    }

    const id = await ctx.db.insert('messages', {
      ...args,
      author: user._id,
    });

    const savedMessage = await ctx.db.get(id);

    if (!savedMessage) {
      throw new Error('Failed to retrieve saved message');
    }

    return savedMessage;
  },
});

export const list = query({
  args: {paginationOpts: paginationOptsValidator},
  handler: async (ctx, {paginationOpts}) => {
    return await ctx.db
      .query('messages')
      .order('desc')
      .paginate(paginationOpts);
  },
});

export const insertAiMessage = internalMutation({
  args: v.object({
    message: v.string(),
    reply: v.string(),
    author: v.id('users'),
  }),
  handler: async (ctx, {message, reply, author}) => {
    await ctx.db.insert('messages', {
      author,
      message,
      reply,
    });
  },
});
