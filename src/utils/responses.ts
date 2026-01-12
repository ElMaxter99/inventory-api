export function success(data: any = null, meta: any = null) {
  return { data, meta, error: null };
}

export function fail(message: string, code?: string) {
  return { data: null, error: { message, code } };
}
