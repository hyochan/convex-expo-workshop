import {mutation, query} from './_generated/server';
import {v} from 'convex/values';

export const updateProfile = mutation({
  args: v.object({
    displayName: v.string(),
    jobTitle: v.string(),
    description: v.string(),
    websiteUrl: v.string(),
    githubUrl: v.string(),
    linkedInUrl: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Called storeUser without authentication present');
    }

    const user = await ctx.db.query('users').unique();

    if (user !== null) {
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, args);
      }
      return user._id;
    }

    return await ctx.db.insert('users', {
      ...args,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

export const getUser = query({
  args: {id: v.id('users')},
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    console.log('User:', user);
  },
});
