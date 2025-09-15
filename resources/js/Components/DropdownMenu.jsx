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
                    className={`absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl bg-white/98 backdrop-blur-20 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dropdown-menu ${className}`}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <div className="py-2">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}