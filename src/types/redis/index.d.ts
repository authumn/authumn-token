import * as redis from 'redis'

declare module 'redis' {
  export interface OverloadedSetCommandAsync<T, U> {
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Promise<U>
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Promise<U>
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T): Promise<U>
    (key: string, arg1: T, arg2: T, arg3: T): Promise<U>
    (key: string, arg1: T, arg2: T): Promise<U>
    (key: string, arg1: T | { [key: string]: T } | T[]): Promise<U>
    (key: string, ...args: Array<T>): Promise<U>
  }

  export interface RedisClient extends NodeJS.EventEmitter {
    hmsetAsync: redis.OverloadedSetCommand<string | number, boolean>

    expireAsync(key: string, seconds: number): Promise<number>
    getAsync (key: string): Promise<string>
    getbitAsync (key: string, offset: number): Promise<number>
    getrangeAsync (key: string, start: number, end: number): Promise<string>
    getsetAsync (key: string, value: string): Promise<string>
    hdelAsync (key: string, fields: string[]): Promise<number>
    hexistsAsync (key: string, field: string): Promise<number>
    hgetAsync (key: string, field: string): Promise<string>
    hgetallAsync (key: string): Promise<{ [key: string]: string }>
    hmgetAsync (key: string, fields: string[]): Promise<string[]>
    hsetAsync (key: string, field: string, value: string): Promise<number>
    hsetnxAsync (key: string, field: string, value: string): Promise<number>
    setAsync (key: string, values: string): Promise<number>
  }
}
