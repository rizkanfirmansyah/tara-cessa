// lib/fetchCustom.ts

interface FetchResult<T> {
  data?: T;
  error?: string | unknown;
}

const fetchCustom = async <T>(url: string, token?: string): Promise<FetchResult<T>> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}. Status: ${response.status}`);
    }

    const data: T = await response.json();

    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : error };
  }
};

export default fetchCustom;
