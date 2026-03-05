export const PriceInfo = ({ label, value }) => (
    <div>
        <span className="text-xs text-gray-500 dark:text-gray-500">
            {label}
        </span>
        <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100">
            {value}
        </p>
    </div>
);
