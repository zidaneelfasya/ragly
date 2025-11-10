// Utility functions untuk mengakses API Konsultasi SPBE

export interface KonsultasiAPIOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  kategori?: string;
  pic_id?: number;
  instansi?: string;
}

export interface RawDataOptions extends KonsultasiAPIOptions {
  format?: 'basic' | 'export' | 'full';
}

export class KonsultasiAPI {
  private baseUrl = '/api/v1/konsultasi';

  // Mengambil konsultasi dengan filter
  async getKonsultasi(options: KonsultasiAPIOptions = {}) {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Mengambil detail konsultasi berdasarkan ID
  async getKonsultasiById(id: number) {
    const response = await fetch(`${this.baseUrl}?id=${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Mengambil semua data konsultasi (transformed)
  async getAllKonsultasi(options: Omit<KonsultasiAPIOptions, 'status' | 'kategori' | 'pic_id' | 'instansi'> = {}) {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/all?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Mengambil data mentah dengan berbagai format
  async getRawData(options: RawDataOptions = {}) {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/raw?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Mengambil semua data sekaligus (bulk)
  async getBulkData() {
    const response = await fetch(`${this.baseUrl}/bulk`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Mengambil statistik
  async getStats() {
    const response = await fetch(`${this.baseUrl}/stats`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Mengambil daftar PIC
  async getPICList() {
    const response = await fetch(`${this.baseUrl}/pic`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Mengambil daftar unit penanggung jawab
  async getUnits() {
    const response = await fetch(`${this.baseUrl}/units`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Mengambil daftar topik konsultasi
  async getTopics() {
    const response = await fetch(`${this.baseUrl}/topics`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Membuat konsultasi baru
  async createKonsultasi(data: any) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Update konsultasi
  async updateKonsultasi(data: any) {
    const response = await fetch(this.baseUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Hapus konsultasi
  async deleteKonsultasi(id: number) {
    const response = await fetch(`${this.baseUrl}?id=${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  // Helper methods untuk filtering dan pagination
  getPagedData(options: KonsultasiAPIOptions & { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 10, ...otherOptions } = options;
    return this.getKonsultasi({
      ...otherOptions,
      limit: pageSize,
      offset: (page - 1) * pageSize
    });
  }

  // Export data untuk download
  async exportData(format: 'basic' | 'export' | 'full' = 'export') {
    return this.getRawData({ format, limit: 10000 }); // Large limit untuk export semua
  }

  // Search konsultasi berdasarkan instansi
  async searchByInstansi(instansi: string, options: Omit<KonsultasiAPIOptions, 'instansi'> = {}) {
    return this.getKonsultasi({ ...options, instansi });
  }

  // Filter berdasarkan status
  async getByStatus(status: string, options: Omit<KonsultasiAPIOptions, 'status'> = {}) {
    return this.getKonsultasi({ ...options, status });
  }

  // Filter berdasarkan kategori
  async getByKategori(kategori: string, options: Omit<KonsultasiAPIOptions, 'kategori'> = {}) {
    return this.getKonsultasi({ ...options, kategori });
  }

  // Filter berdasarkan PIC
  async getByPIC(pic_id: number, options: Omit<KonsultasiAPIOptions, 'pic_id'> = {}) {
    return this.getKonsultasi({ ...options, pic_id });
  }
}

// Export instance untuk digunakan langsung
export const konsultasiAPI = new KonsultasiAPI();

// Export helper functions
export const KonsultasiHelpers = {
  // Format status untuk display
  formatStatus: (status: string) => {
    const statusMap: Record<string, string> = {
      'new': 'Baru',
      'on process': 'Sedang Diproses',
      'ready to send': 'Siap Kirim',
      'konsultasi zoom': 'Konsultasi Zoom',
      'done': 'Selesai',
      'FU pertanyaan': 'Follow Up Pertanyaan',
      'cancel': 'Dibatalkan'
    };
    return statusMap[status] || status;
  },

  // Format kategori untuk display
  formatKategori: (kategori: string) => {
    const kategoriMap: Record<string, string> = {
      'tata kelola': 'Tata Kelola',
      'infrastruktur': 'Infrastruktur',
      'aplikasi': 'Aplikasi',
      'keamanan informasi': 'Keamanan Informasi',
      'SDM': 'Sumber Daya Manusia'
    };
    return kategoriMap[kategori] || kategori;
  },

  // Get status color untuk UI
  getStatusColor: (status: string) => {
    const colorMap: Record<string, string> = {
      'new': 'blue',
      'on process': 'yellow',
      'ready to send': 'purple',
      'konsultasi zoom': 'orange',
      'done': 'green',
      'FU pertanyaan': 'indigo',
      'cancel': 'red'
    };
    return colorMap[status] || 'gray';
  },

  // Format date untuk display
  formatDate: (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};
