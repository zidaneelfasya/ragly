export default function NoAccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
      <p className="text-lg text-muted-foreground">
        You do not have permission to access this page.
      </p>
    </div>
  );
}