import Modal from "@/Components/Modal";

export const ModalTemplate = ({
    show,
    onClose,
    title,
    icon: Icon,
    iconBgColor,
    iconColor,
    children,
    maxWidth = "md",
}) => (
    <Modal show={show} onClose={onClose} maxWidth={maxWidth}>
        <div className="p-4 sm:p-6">
            {title && (
                <div className="text-center mb-4">
                    {Icon && (
                        <div className={`flex justify-center mb-3`}>
                            <div
                                className={`w-12 h-12 sm:w-16 sm:h-16 ${iconBgColor} rounded-full flex items-center justify-center`}
                            >
                                <Icon
                                    className={`${iconColor} text-2xl sm:text-3xl`}
                                />
                            </div>
                        </div>
                    )}
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>
                </div>
            )}
            {children}
        </div>
    </Modal>
);
