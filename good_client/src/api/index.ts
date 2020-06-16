import axios from 'axios';
import Cookie from 'js-cookie';

export async function apiRequest({
  data = null,
  endpoint,
  method = 'GET',
}: {
  data?: any,
  endpoint: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'GET';
}) {
  const headers: any = {};

  if (method !== 'GET') {
    headers['x-csrf-token'] = Cookie.get('csrf_token') ?? '';
  }

  const response = await axios(
    `http://api.good.com:4000${endpoint}`,
    {
      data,
      headers,
      method,
      withCredentials: true,
    }
  );

  return response;
}
