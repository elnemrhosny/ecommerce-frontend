// components/Spinner.jsx
export default function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
    </div>
  );
}