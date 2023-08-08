import { FastifyPluginCallback } from 'fastify/types/plugin'
import oauthPlugin from "@fastify/oauth2";
import jwt from 'jsonwebtoken';
export interface User {
  iss: string
  azp: string
  aud: string
  sub: string
  email: string
  email_verified: boolean
  at_hash: string
  name: string
  picture: string
  given_name: string
  family_name: string
  locale: string
  iat: number
  exp: number
}
export const registerAuthModule: FastifyPluginCallback = async (fastify, options) => {
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

    const user  = jwt.decode(id_token) as User;

    return reply.status(200).send({
      user
    })
  });
}
