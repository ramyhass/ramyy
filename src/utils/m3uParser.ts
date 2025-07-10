import { Channel } from '../types';

export interface M3UEntry {
  name: string;
  url: string;
  logo?: string;
  group?: string;
  tvgId?: string;
}

export const parseM3U = (content: string): M3UEntry[] => {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  const entries: M3UEntry[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      const nextLine = lines[i + 1];
      if (nextLine && !nextLine.startsWith('#')) {
        const entry = parseExtInfLine(line, nextLine);
        if (entry) {
          entries.push(entry);
        }
        i++; // Skip the URL line since we processed it
      }
    }
  }
  
  return entries;
};

const parseExtInfLine = (extinfLine: string, urlLine: string): M3UEntry | null => {
  // Parse #EXTINF line format: #EXTINF:duration,title
  // Extended format may include attributes like tvg-logo, group-title, etc.
  
  const match = extinfLine.match(/#EXTINF:([^,]*),(.*)$/);
  if (!match) return null;
  
  const title = match[2].trim();
  const url = urlLine.trim();
  
  if (!title || !url) return null;
  
  // Extract attributes from the EXTINF line
  const attributes = extractAttributes(extinfLine);
  
  return {
    name: title,
    url: url,
    logo: attributes['tvg-logo'] || attributes['logo'],
    group: attributes['group-title'] || attributes['group'],
    tvgId: attributes['tvg-id']
  };
};

const extractAttributes = (line: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  
  // Match attribute="value" or attribute='value' patterns
  const attrRegex = /(\w+(?:-\w+)*)=["']([^"']*?)["']/g;
  let match;
  
  while ((match = attrRegex.exec(line)) !== null) {
    attributes[match[1]] = match[2];
  }
  
  return attributes;
};

export const fetchM3UContent = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Failed to fetch M3U content:', error);
    throw new Error('Failed to fetch playlist. Please check the URL and try again.');
  }
};

export const convertM3UToChannels = (entries: M3UEntry[]): Channel[] => {
  return entries.map((entry, index) => ({
    id: `imported_${Date.now()}_${index}`,
    name: entry.name,
    url: entry.url,
    logo: entry.logo,
    category: entry.group || 'General',
    favorite: false
  }));
};