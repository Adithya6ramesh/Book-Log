import { queryOptions, useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Parameter<T> = T extends (arg: infer T) => any ? T : never;

const fetcher = async <T extends (arg: any) => any>(
  fn: T,
  data: Parameter<T>
): Promise<InferResponseType<T>> => {
  const res: any = await fn(data);

  const json = await res.json();

  if (!res.ok) {
    return json.error ? Promise.reject(json.error) : Promise.reject(json);
  }

  return json;
};

export function createQueryOptions<T extends (...args: any) => Promise<any>>(
  queryKey: string[] | ((data: Parameter<T>) => string[]),
  endpoint: T
): Parameter<T> extends undefined | void | Record<string, never>
  ? (
      data?: Parameter<T>,
      options?: Omit<Parameters<typeof queryOptions>[0], "queryKey" | "queryFn">
    ) => ReturnType<
      typeof queryOptions<InferResponseType<typeof endpoint, 200>>
    >
  : (
      data: Parameter<T>,
      options?: Omit<Parameters<typeof queryOptions>[0], "queryKey" | "queryFn">
    ) => ReturnType<
      typeof queryOptions<InferResponseType<typeof endpoint, 200>>
    > {
  return ((data: any, options: Parameters<typeof queryOptions>[0]) =>
    queryOptions({
      ...options,
      queryKey: Array.isArray(queryKey) ? queryKey : queryKey(data),
      queryFn: async () => {
        return (await fetcher(endpoint, data)) as InferResponseType<
          typeof endpoint,
          200
        >;
      },
    })) as any;
}

type Or<T, K> = keyof K extends never ? T | void : T;

export type ValidationError = string | string[];

export type ValidationErrors = Record<string, ValidationError>;

type UseMutationParams<T extends (...args: any) => Promise<any>> = Parameters<
  typeof useMutation<
    InferResponseType<T, 200>,
    ValidationErrors,
    // Since json is the most commonly used type of body, we'll infer it and use it as the default data type for the mutation
    // However if the endpoint does not have a json property, we'll fallback to the default data type
    // Basically, this prevents you from writing .mutate({ json: { ... } }) over and over again and allows you to just write .mutate({ ... })
    "json" extends keyof InferRequestType<T>
      ? Or<
          InferRequestType<T>["json"] & {
            options?: Partial<Omit<InferRequestType<T>, "json">>;
          },
          InferRequestType<T>["json"]
        >
      : InferRequestType<T>
  >
>;

export function createMutationOptions<T extends (...args: any) => Promise<any>>(
  endpoint: T,
  mutationOptions?: UseMutationParams<T>[0] & {
    hono?: Omit<InferRequestType<T>, "json">;
  }
) {
  return {
    mutationFn: async (args) => {
      // Taken from https://hono.dev/docs/api/request#valid
      // Doesn't include json because that's the special handling case
      const targets = ["form", "query", "header", "cookie", "param"];

      return await fetcher(endpoint, {
        ...(Object.keys(args as any).some((key) => targets.includes(key))
          ? args
          : { json: args, ...args.options }),
        ...mutationOptions?.hono,
      } as any);
    },
  } satisfies UseMutationParams<T>[0] & {
    hono?: Omit<InferRequestType<T>, "json">;
  };
}
