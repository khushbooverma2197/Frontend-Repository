export default function PrimaryButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow focus:ring-blue-500',
    secondary:
      'bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300 shadow-sm',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm',
    outline:
      'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost:
      'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-base gap-2',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
