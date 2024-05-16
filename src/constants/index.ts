export const customProvier = {
  DB_CLIENT: 'DB_CLIENT',
  REDIS_CLIENT: 'REDIS_CLIENT',
};

export function redisCacheKey(
  projectId?: number | string,
  userId?: number | string,
) {
  return {
    member: `${projectId}:member`,
    notifications: `${userId}:notifications`,
  };
}

export const socketEvent = {
  notifications: 'notifications',
};
