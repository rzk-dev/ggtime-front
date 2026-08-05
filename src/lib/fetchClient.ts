import { supabase } from "./supabase";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

class FetchClient {
  constructor(private readonly baseURL: string) { }


  private async getHeaders(extraHeaders: HeadersInit = {}): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession()

    return {
      'Content-Type': 'application/json',
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      ...extraHeaders
    }
  }

  private buildUrl(url: string, query?: QueryParams): string {
    if (!query) {
      return `${this.baseURL}${url}`;
    }

    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();

    return queryString.length > 0
      ? `${this.baseURL}${url}?${queryString}`
      : `${this.baseURL}${url}`;
  }
  private async request<T>(
    url: string,
    options: RequestInit = {},
    query?: QueryParams
  ): Promise<T> {
    const response = await fetch(this.buildUrl(url, query), {
      ...options,
      headers: await this.getHeaders(options.headers),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  get<T>(url: string, query?: QueryParams): Promise<T> {
    return this.request<T>(url, {}, query);
  }

  delete<T>(url: string): Promise<T> {
    return this.request<T>(url, {
      method: "DELETE",
    });
  }
  post<T>(url: string, data: unknown): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(url: string, data: unknown): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const api = new FetchClient(process.env.EXPO_PUBLIC_HOST!)
