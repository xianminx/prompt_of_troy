# Prompt of Troy

**Prompt of Troy** is a competitive prompt hacking game where players craft prompts to either attack or defend a secret key. It uses an [ELO rating system](https://en.wikipedia.org/wiki/Elo_rating_system) that reflects your skill in prompt engineering.


## Leaderboard & Rankings

![](./docs/img/players.png)

---


## Leaderboard by Prompts 

![](./docs/img/prompts.png)

---


## Battle List 

![](./docs/img/battles.png)


## Technical Design
[Design](./docs/Design.md)

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