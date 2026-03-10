import type { RequestHandler } from "express";
import type { ApplicationContainer } from "../../src/container";
import { createApp } from "../../src/app";

const notImplemented: RequestHandler = (_req, res) => {
  res.status(501).json({ message: "Test controller handler not implemented" });
};

const createStubControllers = (): ApplicationContainer["controllers"] => ({
  authController: {
    register: notImplemented,
    login: notImplemented,
    refreshToken: notImplemented,
    validateToken: notImplemented,
    listOAuthProviders: notImplemented,
    startOAuthAuthorization: notImplemented,
    oauthCallback: notImplemented,
    logout: notImplemented,
    revokeRefreshToken: notImplemented,
  } as ApplicationContainer["controllers"]["authController"],
  eventController: {
    list: notImplemented,
    listAll: notImplemented,
    getById: notImplemented,
    create: notImplemented,
    update: notImplemented,
    remove: notImplemented,
  } as ApplicationContainer["controllers"]["eventController"],
  userController: {
    list: notImplemented,
    listAll: notImplemented,
    getById: notImplemented,
    create: notImplemented,
    update: notImplemented,
    remove: notImplemented,
  } as ApplicationContainer["controllers"]["userController"],
  inscriptionController: {
    list: notImplemented,
    listAll: notImplemented,
    getById: notImplemented,
    create: notImplemented,
    update: notImplemented,
    remove: notImplemented,
  } as ApplicationContainer["controllers"]["inscriptionController"],
  presenceController: {
    list: notImplemented,
    listAll: notImplemented,
    getById: notImplemented,
    create: notImplemented,
    remove: notImplemented,
  } as ApplicationContainer["controllers"]["presenceController"],
  legacySheetsController: {
    readValues: notImplemented,
    appendValues: notImplemented,
    updateValues: notImplemented,
    clearValues: notImplemented,
  } as ApplicationContainer["controllers"]["legacySheetsController"],
  emailController: {
    send: notImplemented,
  } as ApplicationContainer["controllers"]["emailController"],
});

export const createAppForTests = () =>
  createApp({ controllers: createStubControllers() });
