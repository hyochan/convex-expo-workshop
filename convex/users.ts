import {mutation, query} from './_generated/server';
import {v} from 'convex/values';

export const createUser = mutation({
  args: v.object({
    displayName: v.string(),
    jobTitle: v.string(),
    description: v.string(),
    websiteUrl: v.string(),
    githubUrl: v.string(),
    linkedInUrl: v.string(),
  }),
  handler: async (ctx, args) => {
    console.log('Mutation handler 실행됨:', args);
    const userId = await ctx.db.insert('users', {
      displayName: args.displayName,
      jobTitle: args.jobTitle,
      description: args.description,
      websiteUrl: args.websiteUrl,
      githubUrl: args.githubUrl,
      linkedInUrl: args.linkedInUrl,
    });
    console.log('User created successfully with ID:', userId);
    return userId;
  },
});

export const getUser = query({
  args: {id: v.id('users')},
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    console.log('User:', user);
  },
});
