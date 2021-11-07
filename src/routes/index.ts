import bunyan from "bunyan";
import { Application } from "express";
import { Redis } from "ioredis";
import main from "./main";
import mtgySupply from "./mtgySupply";
import token from "./token";

export interface IRouteOptions {
  log: bunyan;
  redis: Redis;
}

export default async function Routes(
  app: Application,
  { log, redis }: IRouteOptions
) {
  main(app);
  mtgySupply(app);
  token(app, { log, redis });
}
