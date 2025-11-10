// lib/units-api.ts
export interface Unit {
  id: number;
  nama_unit: string;
  nama_pic: string | null;
}

export interface UnitsResponse {
  success: boolean;
  data: Unit[];
  message?: string;
}

export class UnitsAPI {
  private static baseUrl = '/api/v1/units';

  // Get all units
  static async getUnits(): Promise<Unit[]> {
    const response = await fetch(this.baseUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: UnitsResponse = await response.json();
    return result.data;
  }
}

// Helper function untuk mengambil units
export const getUnits = async (): Promise<Unit[]> => {
  return UnitsAPI.getUnits();
};
