import axios from "axios";
import { Dua, EquranDuaResponse } from "../types";

const equranApi = axios.create({
  baseURL: "https://equran.id/api",
  timeout: 15000,
});

export const fetchAllDuas = async (): Promise<Dua[]> => {
  const { data } = await equranApi.get<EquranDuaResponse[]>("/doa");
  
  if (!Array.isArray(data)) {
    throw new Error("Invalid API response format from EQuran.id");
  }

  return data.map((item) => ({
    id: Number(item.id),
    group: item.grup ?? "",
    title: item.nama ?? "",
    arabic: item.ar ?? "",
    latin: item.tr ?? "",
    translation_id: item.idn ?? "",
    description: item.tentang ?? "",
    // Fallback split fallback if tag is a comma separated string
    tags: item.tag ? item.tag.split(",").map((t) => t.trim()).filter(Boolean) : [],
  }));
};

export const fetchDuaDetail = async (id: number): Promise<Dua> => {
  // equran.id/api/doa doesn't seem to natively document /doa/{id} returning a single object in the same format 
  // reliably, so we fallback to finding it from all requests or fetching the specific ID if supported.
  // The user prompt indicates `GET /api/doa/{id}` is valid, but returns an array of length 1 or just the object.
  // Let's implement it robustly.
  const { data } = await equranApi.get<EquranDuaResponse | EquranDuaResponse[]>(`/doa/${id}`);
  
  const item = Array.isArray(data) ? data[0] : data;
  if (!item) throw new Error("Dua not found");

  return {
    id: Number(item.id),
    group: item.grup ?? "",
    title: item.nama ?? "",
    arabic: item.ar ?? "",
    latin: item.tr ?? "",
    translation_id: item.idn ?? "",
    description: item.tentang ?? "",
    tags: item.tag ? item.tag.split(",").map((t) => t.trim()).filter(Boolean) : [],
  };
};
