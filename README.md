# Prompt of Troy

## Deploy

### DB setup

[Drizzle with Supabase Database](https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase)

```bash
npm run db:generate
npm run db:migrate 
```

which is a short to `drizzle-kit` commands:

```bash
# Generate SQL from schema.ts 
npx drizzle-kit generate
# Create tables on supabase db.
npx drizzle-kit migrate
```


* [How to set up TypeScript with Node.js and Express](https://blog.logrocket.com/how-to-set-up-node-typescript-express/)