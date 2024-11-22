import {v} from 'convex/values';
import {mutation} from './_generated/server';
import { userByExternalId } from './users';

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called sendImage without authentication present');
    }

    const user = await userByExternalId(ctx, identity.tokenIdentifier);
    if (!user) {
      throw new Error('User not found');
    }

    await ctx.db.insert('images', {
      body: args.storageId,
      author: user._id,
      format: 'image',
    });
  },
});