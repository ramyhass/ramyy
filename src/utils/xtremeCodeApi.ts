export interface XtremeCodeCredentials {
  server: string;
  username: string;
  password: string;
}

export interface XtremeCodeUserInfo {
  user_info: {
    username: string;
    password: string;
    message: string;
    auth: number;
    status: string;
    exp_date: string;
    is_trial: string;
    active_cons: string;
    created_at: string;
    max_connections: string;
    allowed_output_formats: string[];
  };
  server_info: {
    url: string;
    port: string;
    https_port: string;
    server_protocol: string;
    rtmp_port: string;
    timezone: string;
    timestamp_now: number;
    time_now: string;
  };
}

export interface XtremeCodeCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface XtremeCodeStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
}

export class XtremeCodeAPI {
  private baseUrl: string;
  private credentials: XtremeCodeCredentials;

  constructor(credentials: XtremeCodeCredentials) {
    this.credentials = credentials;
    this.baseUrl = credentials.server.replace(/\/$/, ''); // Remove trailing slash
  }

  private buildUrl(action: string, params: Record<string, string | number> = {}): string {
    const url = new URL(`${this.baseUrl}/player_api.php`);
    url.searchParams.set('username', this.credentials.username);
    url.searchParams.set('password', this.credentials.password);
    url.searchParams.set('action', action);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString());
    });
    
    return url.toString();
  }

  async getUserInfo(): Promise<XtremeCodeUserInfo> {
    const url = this.buildUrl('get_account_info');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.user_info?.auth !== 1) {
      throw new Error(data.user_info?.message || 'Authentication failed');
    }
    
    return data;
  }

  async getLiveCategories(): Promise<XtremeCodeCategory[]> {
    const url = this.buildUrl('get_live_categories');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async getVodCategories(): Promise<XtremeCodeCategory[]> {
    const url = this.buildUrl('get_vod_categories');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async getSeriesCategories(): Promise<XtremeCodeCategory[]> {
    const url = this.buildUrl('get_series_categories');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async getLiveStreams(categoryId?: string): Promise<XtremeCodeStream[]> {
    const params = categoryId ? { category_id: categoryId } : {};
    const url = this.buildUrl('get_live_streams', params);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async getVodStreams(categoryId?: string): Promise<XtremeCodeStream[]> {
    const params = categoryId ? { category_id: categoryId } : {};
    const url = this.buildUrl('get_vod_streams', params);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async getSeries(categoryId?: string): Promise<XtremeCodeStream[]> {
    const params = categoryId ? { category_id: categoryId } : {};
    const url = this.buildUrl('get_series', params);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  generateM3UPlaylist(streams: XtremeCodeStream[], type: 'live' | 'vod' | 'series' = 'live'): string {
    let m3uContent = '#EXTM3U\n';
    
    streams.forEach(stream => {
      const streamUrl = this.getStreamUrl(stream.stream_id, type);
      const tvgLogo = stream.stream_icon ? ` tvg-logo="${stream.stream_icon}"` : '';
      const groupTitle = ` group-title="${stream.category_id}"`;
      
      m3uContent += `#EXTINF:-1${tvgLogo}${groupTitle},${stream.name}\n`;
      m3uContent += `${streamUrl}\n`;
    });
    
    return m3uContent;
  }

  getStreamUrl(streamId: number, type: 'live' | 'vod' | 'series' = 'live'): string {
    const { username, password } = this.credentials;
    
    switch (type) {
      case 'live':
        return `${this.baseUrl}/live/${username}/${password}/${streamId}.ts`;
      case 'vod':
        return `${this.baseUrl}/movie/${username}/${password}/${streamId}.mp4`;
      case 'series':
        return `${this.baseUrl}/series/${username}/${password}/${streamId}.mp4`;
      default:
        return `${this.baseUrl}/live/${username}/${password}/${streamId}.ts`;
    }
  }

  generatePlaylistUrl(type: 'live' | 'vod' | 'series' = 'live'): string {
    const { username, password } = this.credentials;
    const output = type === 'live' ? 'ts' : 'm3u8';
    return `${this.baseUrl}/get.php?username=${username}&password=${password}&type=m3u_plus&output=${output}`;
  }

  async testConnection(): Promise<boolean> {
    try {
      const userInfo = await this.getUserInfo();
      return userInfo.user_info.auth === 1;
    } catch (error) {
      console.error('Xtreme Code connection test failed:', error);
      return false;
    }
  }
}

export const createXtremeCodeAPI = (credentials: XtremeCodeCredentials): XtremeCodeAPI => {
  return new XtremeCodeAPI(credentials);
};