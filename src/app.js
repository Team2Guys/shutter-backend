import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs, resolvers } from "./modules/index.js";
import { tokenUtils } from "#lib/token.lib.js";
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT;

(async function App() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  app.use("/graphql",expressMiddleware(apolloServer,{
    context:({ req, res })=>{
      let user = null;

    const accessToken = req.cookies["accessToken"];
    if (accessToken) {
      try {
      user = tokenUtils.verify(accessToken);

    } catch {
     user = null 
    }
    }
    return { user, req, res};
    }
  }));
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
