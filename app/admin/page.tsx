import { DataTableAdminKonsultasi } from "@/components/data-table-admin-konsultasi";
import { DataProvider } from "../context/data-context";
import { UserProvider } from "../context/user-context";

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
