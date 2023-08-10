import oauthPlugin from "@fastify/oauth2";
import fastifyPlugin from "fastify-plugin";
import jwt from 'jsonwebtoken';
import {User} from "./auth.models";


export const authPlugin  = fastifyPlugin(async (fastify) => {
  fastify.register(oauthPlugin, {
    name: 'googleOAuth2',
    scope: ['profile', 'email'],
    credentials: {
      client: {
        id: fastify.config.CLIENT_ID,
        secret: fastify.config.CLIENT_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/login/google',
    callbackUri: 'http://localhost:3000/login/google/callback',
  });

  fastify.get('/login/google/callback', async (request, reply) => {
    const accessToken = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    const { id_token } = accessToken.token;

    if (!id_token) {
      return reply.status(500).send({
        message: 'Missing idToken in google auth flow'
      })
    }

    const { email, name: fullName }  = jwt.decode(id_token) as User;

    const user = await fastify.databaseUnitOfWork.user.findFirst({
      cursor: {
        email,
      }
    });

    if (!user) {
      const {id: insertedId} = await fastify.databaseUnitOfWork.user.create({
        data: {
          email,
          fullName,
        }
      })
      const accessToken = jwt.sign({ id: insertedId }, fastify.config.ACCESS_TOKEN_SECRET);

      return reply.status(200).send({
        accessToken
      })
    }

    const newAccessToken = jwt.sign({ id: user.id }, fastify.config.ACCESS_TOKEN_SECRET);

    return reply.status(200).send({
      accessToken: newAccessToken
    })
  });
})
