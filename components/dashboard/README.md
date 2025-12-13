# Dashboard Responsive Sidebar

Komponen sidebar responsif untuk dashboard dengan fitur-fitur berikut:

## Fitur

### Desktop (≥1024px)
- Sidebar terbuka secara default
- Dapat ditutup/dibuka dengan tombol toggle
- Preferensi sidebar disimpan di localStorage
- Tombol toggle bergeser mengikuti posisi sidebar
- Main content menyesuaikan margin secara otomatis

### Mobile (<1024px)
- Sidebar tertutup secara default
- Dapat dibuka dengan tombol toggle di header
- Sidebar menutup otomatis setelah navigasi
- Backdrop gelap saat sidebar terbuka
- Dapat ditutup dengan:
  - Tombol X di sidebar
  - Klik di luar sidebar
  - Tombol ESC

## Struktur Komponen

```
SidebarProvider → Context provider untuk state management
├── Sidebar → Komponen sidebar utama
└── SidebarToggle → Tombol untuk toggle sidebar
```

## Usage

Komponen sudah terintegrasi di `/app/dashboard/layout.tsx`. Untuk menggunakan di tempat lain:

```tsx
import { SidebarProvider, Sidebar, SidebarToggle } from '@/components/dashboard/responsive-sidebar';

<SidebarProvider>
  <Sidebar user={user} navItems={navItems} />
  <main>
    <SidebarToggle />
    {/* konten lainnya */}
  </main>
</SidebarProvider>
```

## CSS Classes

CSS custom telah ditambahkan di `globals.css`:
- `.sidebar-collapsed` - State ketika sidebar tertutup
- `.sidebar-open` - State ketika sidebar terbuka
- `.sidebar-toggle-desktop` - Styling untuk tombol toggle di desktop

## Keyboard Shortcuts

- **ESC** - Menutup sidebar (terutama berguna di mobile)

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅ 
- Safari: ✅
- Mobile browsers: ✅
