import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

export interface TableStackItem {
  id: string | number;
  image?: string;
  name: string;
  position?: string;
  email?: string;
  status?: 'active' | 'inactive' | 'pending';
  actions?: React.ReactNode;
}

export interface TableStackProps {
  title?: string;
  items: TableStackItem[];
  className?: string;
  onItemClick?: (item: TableStackItem) => void;
}

const TableStack: React.FC<TableStackProps> = ({ title = 'Users List', items, className, onItemClick }) => {
  return (
    <section className={cn('relative z-10 overflow-hidden bg-white py-20 lg:py-[100px]', className)}>
      <div className="container mx-auto">
        <TableStackWrapper title={title}>
          {items.map((item) => (
            <StackItem key={item.id} item={item} onClick={() => onItemClick?.(item)} />
          ))}
        </TableStackWrapper>
      </div>
    </section>
  );
};

const TableStackWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <>
      <h3 className="mb-8 text-2xl font-medium text-black sm:text-[28px]">{title}</h3>
      <div className="border-stroke max-w-[370px] border bg-white py-[10px]">{children}</div>
    </>
  );
};

const StackItem: React.FC<{ item: TableStackItem; onClick?: () => void }> = ({ item, onClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target as Node) || trigger.current?.contains(target as Node))
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'inactive':
        return 'text-danger';
      case 'pending':
        return 'text-warning';
      default:
        return 'text-body-color';
    }
  };

  return (
    <div
      className="flex items-center justify-between py-[18px] pl-6 pr-4 hover:bg-[#F5F5F5] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        {item.image && (
          <div className="mr-[18px] h-[50px] w-full max-w-[50px] overflow-hidden rounded-full">
            <img src={item.image} alt={item.name} className="rounded-full object-cover object-center" />
          </div>
        )}
        <div>
          <h4 className="text-base font-medium text-black">{item.name}</h4>
          {item.position && <p className="text-body-color text-base">{item.position}</p>}
          {item.email && <p className="text-sm text-body-color">{item.email}</p>}
          {item.status && <span className={cn('text-sm font-medium', getStatusColor(item.status))}>{item.status}</span>}
        </div>
      </div>
      <div>
        {item.actions || (
          <Dropdown
            trigger={trigger}
            dropdown={dropdown}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
          />
        )}
      </div>
    </div>
  );
};

const Dropdown: React.FC<{
  trigger: React.RefObject<HTMLButtonElement>;
  dropdown: React.RefObject<HTMLDivElement>;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
}> = ({ trigger, dropdown, dropdownOpen, setDropdownOpen }) => {
  return (
    <div className="relative">
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-1 text-body-color hover:text-dark"
      >
        <span className="text-lg">⋯</span>
      </button>
      {dropdownOpen && (
        <div
          ref={dropdown}
          className="absolute right-0 top-full z-40 mt-2 w-32 rounded-md border border-stroke bg-white py-2 shadow-lg"
        >
          <button className="block w-full px-4 py-2 text-left text-sm text-body-color hover:bg-gray-100">Edit</button>
          <button className="block w-full px-4 py-2 text-left text-sm text-body-color hover:bg-gray-100">Delete</button>
        </div>
      )}
    </div>
  );
};

export default TableStack;
