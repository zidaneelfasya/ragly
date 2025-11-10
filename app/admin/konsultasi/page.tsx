import { DataProvider } from "@/app/context/data-context";
import { UserProvider } from "@/app/context/user-context";
import { DataTableAdminKonsultasi } from "@/components/data-table-admin-konsultasi";

export default function AdminPage() {
  return (
    <div className="">
      <UserProvider>
        <DataProvider>
          <DataTableAdminKonsultasi data={[]} />
        </DataProvider>
      </UserProvider>
    </div>
  );
}
