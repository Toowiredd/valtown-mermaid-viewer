import { kv } from '@val.town/utils';

// @val.public
export async function kv_get(key: string) {
  return await kv.get(key);
}

// @val.public
export async function kv_set(key: string, value: any) {
  return await kv.set(key, value);
}

// @val.public
export async function kv_delete(key: string) {
  return await kv.delete(key);
}
