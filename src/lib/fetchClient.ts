import { supabase } from "./supabase";

class FetchClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = `${baseURL}`
  }

  private async getHeaders(extraHeaders: HeadersInit = {}) {
    const { data: { session } } = await supabase.auth.getSession()

    return {
      'Content-Type': 'application/json',
      ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      ...extraHeaders
    }
  }

  private async request(url: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: await this.getHeaders(options.headers)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return response.json();

  }

  async get(url: string) {
    return await this.request(url)
  }

  async delete(url: string) {
    return await this.request(url)
  }

  async post(url: string, data: any) {
    return await this.request(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async put(url: string, data: any) {
    return await this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }
}

export const api = new FetchClient(process.env.EXPO_PUBLIC_HOST!)
