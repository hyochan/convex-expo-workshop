import {defineSchema, defineTable} from 'convex/server';
import {v} from 'convex/values';

export default defineSchema({
  users: defineTable({
    displayName: v.string(),
    tokenIdentifier: v.string(),
    description: v.optional(v.string()),
    avatarUrlId: v.optional(v.id('_storage')),
    githubUrl: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    linkedInUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
  }),
  images: defineTable({
    author: v.id('users'),
    body: v.id('_storage'),
    format: v.string(),
  }),
  messages: defineTable({
    author: v.id('users'),
    message: v.string(),
    reply: v.optional(v.string()),
  }),
});
