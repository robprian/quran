export interface Dua {
  id: number;
  group: string;
  title: string;
  arabic: string;
  latin: string;
  translation_id: string;
  description: string;
  tags: string[];
}

export interface EquranDuaResponse {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  mood?: string;
  tag?: string;
}
