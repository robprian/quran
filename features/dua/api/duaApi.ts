import axios from "axios";
import { Dua, EquranDuaResponse } from "../types";

const equranApi = axios.create({
  baseURL: "https://equran.id/api",
  timeout: 15000,
});

interface ApiListResponse {
  status: string;
  total?: number;
  data: EquranDuaResponse[];
}

interface ApiDetailResponse {
  status: string;
  data: EquranDuaResponse;
}

export const fetchAllDuas = async (): Promise<Dua[]> => {
  const { data } = await equranApi.get<ApiListResponse>("/doa");
  
  const duaList = Array.isArray(data) ? data : data.data; 
  
  if (!duaList || !Array.isArray(duaList)) {
     console.error("Invalid API response format from EQuran.id", data);
     throw new Error("Invalid API response format from EQuran.id");
  }
  
  return duaList.map((item) => ({
    id: Number(item.id),
    group: item.grup || "Umum",
    title: item.nama || "",
    arabic: item.ar || "",
    latin: item.tr || "",
    translation_id: item.idn || "",
    description: item.tentang || "",
    tags: Array.isArray(item.tag) ? item.tag : (typeof item.tag === 'string' ? item.tag.split(",").map((t: string) => t.trim()).filter(Boolean) : [])
  }));
};

export const fetchDuaDetail = async (id: number): Promise<Dua> => {
  const { data } = await equranApi.get<ApiDetailResponse>(`/doa/${id}`);
  
  const item = Array.isArray(data) ? data[0] : (data.data ? data.data : (data as unknown as EquranDuaResponse));
  if (!item) throw new Error("Dua not found");
  
  return {
    id: Number(item.id),
    group: item.grup || "Umum",
    title: item.nama || "",
    arabic: item.ar || "",
    latin: item.tr || "",
    translation_id: item.idn || "",
    description: item.tentang || "",
    tags: Array.isArray(item.tag) ? item.tag : (typeof item.tag === 'string' ? item.tag.split(",").map((t: string) => t.trim()).filter(Boolean) : [])
  };
};
