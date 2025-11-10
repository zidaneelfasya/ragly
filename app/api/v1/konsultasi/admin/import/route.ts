import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as XLSX from 'xlsx';

interface ImportedRow {
  nama_lengkap?: string;
  nomor_telepon?: string;
  instansi_organisasi?: string;
  asal_kota_kabupaten?: string;
  asal_provinsi?: string;

  uraian_kebutuhan_konsultasi?: string;
  topik_konsultasi?: string
  skor_indeks_spbe?: number;
  kondisi_implementasi_spbe?: string;
  fokus_tujuan?: string;
  mekanisme_konsultasi?: string;
  surat_permohonan?: string;
  butuh_konsultasi_lanjut?: string | boolean;
  kategori?: string;
  status?: string;
  pic_name?: string;
  unit_names?: string; // Comma-separated unit names
  topik_names?: string; // Comma-separated topic names
  solusi?: string;
  // ticket?: string;
  timestamp?: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
    data?: any;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check user authentication and permissions
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload Excel (.xlsx, .xls) or CSV file.' },
        { status: 400 }
      );
    }

    // Read file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as ImportedRow[];

    if (jsonData.length === 0) {
      return NextResponse.json(
        { error: 'File is empty or no valid data found' },
        { status: 400 }
      );
    }

    // Get reference data for validation
    const [picResult, unitResult, topikResult] = await Promise.all([
      supabase.from('pic_list').select('id, nama_pic'),
      supabase.from('unit_penanggungjawab').select('id, nama_unit'),
      supabase.from('topik_konsultasi').select('id, nama_topik')
    ]);

    const picMap = new Map(
      picResult.data?.map(pic => [pic.nama_pic.toLowerCase(), pic.id]) || []
    );
    const unitMap = new Map(
      unitResult.data?.map(unit => [unit.nama_unit.toLowerCase(), unit.id]) || []
    );
    const topikMap = new Map(
      topikResult.data?.map(topik => [topik.nama_topik.toLowerCase(), topik.id]) || []
    );

    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: []
    };

    // Process each row
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2; // +2 because Excel rows start at 1 and we skip header

      try {
        // Validate required fields
        if (!row.nama_lengkap?.trim()) {
          throw new Error('Nama lengkap is required');
        }

        // Validate enum values
        const validKategori = ['tata kelola', 'infrastruktur', 'aplikasi', 'keamanan informasi', 'SDM'];
        const validStatus = ['new', 'on process', 'ready to send', 'konsultasi zoom', 'done', 'FU pertanyaan', 'cancel'];

        if (row.kategori && !validKategori.includes(row.kategori.toLowerCase())) {
          throw new Error(`Invalid kategori: ${row.kategori}`);
        }

        if (row.status && !validStatus.includes(row.status.toLowerCase())) {
          throw new Error(`Invalid status: ${row.status}`);
        }

        // Find PIC ID
        let picId = null;
        if (row.pic_name?.trim()) {
          picId = picMap.get(row.pic_name.toLowerCase().trim());
          if (!picId) {
            console.warn(`PIC not found: ${row.pic_name} (row ${rowNumber})`);
          }
        }

        // Parse timestamp
        let timestamp = null;
        if (row.timestamp) {
          timestamp = new Date(row.timestamp);
          if (isNaN(timestamp.getTime())) {
            timestamp = null;
          }
        }

        // Parse butuh_konsultasi_lanjut
        let butuhKonsultasiLanjut = null;
        if (row.butuh_konsultasi_lanjut !== undefined && row.butuh_konsultasi_lanjut !== null) {
          if (typeof row.butuh_konsultasi_lanjut === 'boolean') {
            butuhKonsultasiLanjut = row.butuh_konsultasi_lanjut;
          } else if (typeof row.butuh_konsultasi_lanjut === 'string') {
            const lowerValue = row.butuh_konsultasi_lanjut.toLowerCase().trim();
            butuhKonsultasiLanjut = ['ya', 'yes', 'true', '1'].includes(lowerValue);
          }
        }

        // Insert konsultasi
        const konsultasiData = {
          nama_lengkap: row.nama_lengkap?.trim() || null,
          nomor_telepon: row.nomor_telepon?.trim() || null,
          instansi_organisasi: row.instansi_organisasi?.trim() || null,
          asal_kota_kabupaten: row.asal_kota_kabupaten?.trim() || null,
          asal_provinsi: row.asal_provinsi?.trim() || null,
          uraian_kebutuhan_konsultasi: row.uraian_kebutuhan_konsultasi?.trim() || null,
          topik_konsultasi: row.topik_konsultasi?.trim() || null,
          skor_indeks_spbe: row.skor_indeks_spbe ? Number(row.skor_indeks_spbe) : null,
          kondisi_implementasi_spbe: row.kondisi_implementasi_spbe?.trim() || null,
          fokus_tujuan: row.fokus_tujuan?.trim() || null,
          mekanisme_konsultasi: row.mekanisme_konsultasi?.trim() || null,
          surat_permohonan: row.surat_permohonan?.trim() || null,
          butuh_konsultasi_lanjut: butuhKonsultasiLanjut,
          kategori: row.kategori?.toLowerCase() || 'tata kelola',
          status: row.status?.toLowerCase() || 'new',
          pic_id: picId,
          solusi: row.solusi?.trim() || null,
          // ticket: row.ticket?.trim() || null,
          timestamp,
        };

        const { data: insertedKonsultasi, error: insertError } = await supabase
          .from('konsultasi_spbe')
          .insert(konsultasiData)
          .select('id')
          .single();

        if (insertError) {
          throw new Error(`Failed to insert konsultasi: ${insertError.message}`);
        }

        const konsultasiId = insertedKonsultasi.id;

        // Insert units if provided
        if (row.unit_names?.trim()) {
          const unitNames = row.unit_names.split(',').map(name => name.trim());
          const unitInserts = [];

          for (const unitName of unitNames) {
            const unitId = unitMap.get(unitName.toLowerCase());
            if (unitId) {
              unitInserts.push({
                konsultasi_id: konsultasiId,
                unit_id: unitId
              });
            } else {
              console.warn(`Unit not found: ${unitName} (row ${rowNumber})`);
            }
          }

          if (unitInserts.length > 0) {
            const { error: unitError } = await supabase
              .from('konsultasi_unit')
              .insert(unitInserts);

            if (unitError) {
              console.warn(`Failed to insert units for row ${rowNumber}:`, unitError);
            }
          }
        }

        // Insert topics if provided
        if (row.topik_names?.trim()) {
          const topikNames = row.topik_names.split(',').map(name => name.trim());
          const topikInserts = [];

          for (const topikName of topikNames) {
            const topikId = topikMap.get(topikName.toLowerCase());
            if (topikId) {
              topikInserts.push({
                konsultasi_id: konsultasiId,
                topik_id: topikId
              });
            } else {
              console.warn(`Topik not found: ${topikName} (row ${rowNumber})`);
            }
          }

          if (topikInserts.length > 0) {
            const { error: topikError } = await supabase
              .from('konsultasi_topik')
              .insert(topikInserts);

            if (topikError) {
              console.warn(`Failed to insert topics for row ${rowNumber}:`, topikError);
            }
          }
        }

        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: rowNumber,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: row
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import completed. ${result.success} records imported successfully, ${result.failed} failed.`,
      result
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { 
        error: 'Import failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}