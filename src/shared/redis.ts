import { createClient, SetOptions } from 'redis';
import config from '../config';

const redisClient = createClient({
  url: config.redisURL,
});

const redisPubClient = createClient({
  url: config.redisURL,
});

const redisSubClient = createClient({
  url: config.redisURL,
});

redisClient.on('error', error => console.log('RedisError', error));
redisClient.on('connect', error => console.log('Redis Connected'));

const connect = async () => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

const set = async (
  key: string,
  value: string,
  options: SetOptions
): Promise<void> => {
  await redisClient.set(key, value, options);
};

const get = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

const del = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

const setAccessToken = async (userId: string, token: string): Promise<void> => {
  await redisClient.set(`access-token:${userId}`, token, {
    EX: Number(config.redisExpireIn),
  });
};

const getAccessToken = async (userId: string): Promise<string | null> => {
  return await redisClient.get(`access-token:${userId}`);
};

const delAccessToken = async (userId: string): Promise<void> => {
  await redisClient.del(`access-token:${userId}`);
};

const disconnect = async () => {
  await redisClient.connect();
  await redisPubClient.connect();
  await redisSubClient.connect();
};

export const RedisClient = {
  connect,
  set,
  get,
  del,
  setAccessToken,
  getAccessToken,
  delAccessToken,
  disconnect,
  publish: redisPubClient.publish.bind(redisPubClient),
  subscribe: redisSubClient.subscribe.bind(redisSubClient),
};
