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
    Or<
      InferRequestType<T>["json"] & {
        options?: Partial<Omit<InferRequestType<T>, "json">>;
      },
      InferRequestType<T>["json"]
    >
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
      const { options, ...form } = args;

      return await fetcher(endpoint, {
        form,
        ...options,
        ...mutationOptions?.hono,
      } as any);
    },
  } satisfies UseMutationParams<T>[0] & {
    hono?: Omit<InferRequestType<T>, "json">;
  };
}
