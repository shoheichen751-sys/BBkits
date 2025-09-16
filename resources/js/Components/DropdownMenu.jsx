import { useState } from 'react';

export default function DropdownMenu({ trigger, children, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {trigger}
                </button>
            </div>

            {isOpen && (
                <div
                    className={`absolute right-0 z-50 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-gray-200 focus:outline-none dropdown-menu ${className}`}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    style={{ marginTop: '1px' }}
                >
                    <div className="py-1">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}