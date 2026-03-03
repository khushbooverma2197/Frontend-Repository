export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-400 font-medium">{text}</p>
    </div>
  );
}
