# Contoh Penggunaan API Konsultasi SPBE

## Import dan Setup

```typescript
import { konsultasiAPI, KonsultasiHelpers } from '@/lib/konsultasi-api';
```

## 1. Mengambil Semua Data Konsultasi

```typescript
// Mengambil semua data dengan transformasi
const getAllData = async () => {
  try {
    const result = await konsultasiAPI.getAllKonsultasi({
      limit: 50,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    
    console.log('Total data:', result.pagination.total);
    console.log('Data konsultasi:', result.data);
    
    // Data sudah dalam format yang mudah digunakan
    result.data.forEach(item => {
      console.log(`${item.nama_lengkap} - ${item.instansi_organisasi}`);
      console.log(`Status: ${KonsultasiHelpers.formatStatus(item.status)}`);
      console.log(`PIC: ${item.pic_name}`);
      console.log(`Units: ${item.units.map(u => u.unit_name).join(', ')}`);
    });
    
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
```

## 2. Mengambil Data Mentah untuk Export

```typescript
// Export data dalam format Excel/CSV
const exportData = async () => {
  try {
    const result = await konsultasiAPI.exportData('export');
    
    // Konversi ke CSV
    const csvData = result.data.map(item => ({
      ID: item.id,
      Nama: item.nama_lengkap,
      Telepon: item.nomor_telepon,
      Instansi: item.instansi_organisasi,
      Kota: item.asal_kota_kabupaten,
      Provinsi: item.asal_provinsi,
      Status: KonsultasiHelpers.formatStatus(item.status),
      Kategori: KonsultasiHelpers.formatKategori(item.kategori),
      PIC: item.pic_list?.nama_pic,
      'Tanggal Dibuat': KonsultasiHelpers.formatDate(item.created_at)
    }));
    
    // Download atau tampilkan data
    console.log('CSV Data ready:', csvData);
    
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};
```

## 3. Mengambil Data Bulk (Semua Tabel)

```typescript
// Mengambil semua data dari semua tabel sekaligus
const getBulkData = async () => {
  try {
    const result = await konsultasiAPI.getBulkData();
    
    console.log('Total konsultasi:', result.statistics.total_konsultasi);
    console.log('Total PIC:', result.statistics.total_pic);
    
    // Akses semua data
    const { konsultasi, pic_list, units, topics } = result.data;
    
    // Buat lookup maps
    const picMap = new Map(pic_list.map(pic => [pic.id, pic.nama_pic]));
    const unitMap = new Map(units.map(unit => [unit.id, unit.nama_unit]));
    
    // Process data dengan complete information
    konsultasi.forEach(item => {
      console.log(`${item.nama_lengkap} (${item.instansi_organisasi})`);
      console.log(`PIC: ${item.pic_name}`);
      console.log(`Units: ${item.units.map(u => u.unit_name).join(', ')}`);
      console.log(`Topics: ${item.topics.map(t => t.topik_name).join(', ')}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error fetching bulk data:', error);
  }
};
```

## 4. Filtering dan Pencarian

```typescript
// Filter berdasarkan status
const getNewConsultations = async () => {
  try {
    const result = await konsultasiAPI.getByStatus('new', {
      limit: 20,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    
    console.log('Konsultasi baru:', result.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Search berdasarkan instansi
const searchInstansi = async (searchTerm: string) => {
  try {
    const result = await konsultasiAPI.searchByInstansi(searchTerm);
    
    console.log(`Ditemukan ${result.data.length} konsultasi untuk "${searchTerm}"`);
    return result.data;
  } catch (error) {
    console.error('Error searching:', error);
    return [];
  }
};

// Filter berdasarkan PIC
const getKonsultasiByPIC = async (picId: number) => {
  try {
    const result = await konsultasiAPI.getByPIC(picId);
    return result.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};
```

## 5. Pagination

```typescript
// Implementasi pagination
const getPaginatedData = async (page: number = 1, pageSize: number = 10) => {
  try {
    const result = await konsultasiAPI.getPagedData({
      page,
      pageSize,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    
    return {
      data: result.data,
      pagination: {
        currentPage: Math.floor(result.pagination.offset / pageSize) + 1,
        totalPages: Math.ceil(result.pagination.total / pageSize),
        total: result.pagination.total,
        hasNext: result.pagination.hasNext
      }
    };
  } catch (error) {
    console.error('Error:', error);
    return { data: [], pagination: null };
  }
};
```

## 6. Statistik dan Dashboard

```typescript
// Mengambil data untuk dashboard
const getDashboardData = async () => {
  try {
    const [stats, picList, units] = await Promise.all([
      konsultasiAPI.getStats(),
      konsultasiAPI.getPICList(),
      konsultasiAPI.getUnits()
    ]);
    
    // Data untuk charts
    const statusChart = Object.entries(stats.data.byStatus).map(([status, count]) => ({
      name: KonsultasiHelpers.formatStatus(status),
      value: count,
      color: KonsultasiHelpers.getStatusColor(status)
    }));
    
    const kategoriChart = Object.entries(stats.data.byKategori).map(([kategori, count]) => ({
      name: KonsultasiHelpers.formatKategori(kategori),
      value: count
    }));
    
    return {
      totalKonsultasi: stats.data.total,
      statusDistribution: statusChart,
      kategoriDistribution: kategoriChart,
      recentConsultations: stats.data.recent,
      picList: picList.data,
      unitList: units.data
    };
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
};
```

## 7. CRUD Operations

```typescript
// Create new consultation
const createConsultation = async (formData: any) => {
  try {
    const result = await konsultasiAPI.createKonsultasi(formData);
    console.log('Konsultasi berhasil dibuat:', result.data);
    return result;
  } catch (error) {
    console.error('Error creating:', error);
    throw error;
  }
};

// Update consultation
const updateConsultation = async (id: number, updateData: any) => {
  try {
    const result = await konsultasiAPI.updateKonsultasi({
      id,
      ...updateData
    });
    console.log('Konsultasi berhasil diupdate:', result.data);
    return result;
  } catch (error) {
    console.error('Error updating:', error);
    throw error;
  }
};

// Delete consultation
const deleteConsultation = async (id: number) => {
  try {
    const result = await konsultasiAPI.deleteKonsultasi(id);
    console.log('Konsultasi berhasil dihapus');
    return result;
  } catch (error) {
    console.error('Error deleting:', error);
    throw error;
  }
};
```

## 8. React Hook Example

```typescript
// Custom hook untuk React
import { useState, useEffect } from 'react';

export const useKonsultasiData = (options: any = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await konsultasiAPI.getAllKonsultasi(options);
      setData(result.data);
      setPagination(result.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(options)]);

  return { data, loading, error, pagination, refetch: fetchData };
};

// Penggunaan dalam component
const KonsultasiTable = () => {
  const { data, loading, error, pagination } = useKonsultasiData({
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>
          <h3>{item.nama_lengkap}</h3>
          <p>{item.instansi_organisasi}</p>
          <span className={`status-${KonsultasiHelpers.getStatusColor(item.status)}`}>
            {KonsultasiHelpers.formatStatus(item.status)}
          </span>
        </div>
      ))}
    </div>
  );
};
```
