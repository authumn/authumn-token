declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    hgetallAsync (...args: any[]): Promise<any>
    hmgetAsync (...args: any[]): Promise<any>
    hmsetAsync (...args: any[]): Promise<any>
    hdelAsync (...args: any[]): Promise<any>
    expireAsync (...args: any[]): Promise<any>
  }
}
