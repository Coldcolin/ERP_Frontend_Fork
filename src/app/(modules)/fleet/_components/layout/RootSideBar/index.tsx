'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
// import UserDropdown from '@/components/app/UserDropDown';
import { MessageCircle,Plus  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddVehicleModal } from '../../AddVechicleModal';
// import { AddMenu } from '../AddMenu';

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

type RootSidebarDesktopProps = {
  navigation: NavItem[];
  adminNav: NavItem[];
};

const RootSidebarDesktop: React.FC<RootSidebarDesktopProps> = ({
  navigation
}) => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="lg:z-30 lg:flex hidden lg:flex-col h-screen  w-76 bg-gray-50 ">
      <div className="flex flex-col gap-y-2 overflow-y-auto border-r border-gray-200 bg-grey-50 px-2 py-2 flex-grow">
        <div className="flex  h-auto shrink-0 items-center justify-center">
        <div className="h-24 w-full flex justify-center items-center bg-white cursor-pointer" onClick={() => router.push('/')}> 
            <Image
              src="/assets/images/cover.png"
              className="object-contain h-full w-auto"
              alt="Proteux Logo"
              width={208}
              height={100}
              priority
            />
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
         variant="default"
         size="sm"
         className='h-12'
        >
          <Plus className={`h-5 w-5 transition-transform`} />
          <div className="flex items-center">
            <span className="text-sm font-medium ">Add vehicle</span>
          </div>
    
        </Button>
        <AddVehicleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />


        {/* Main Navigation */}
        <nav className="flex flex-col flex-1 mt-5">
          <ul className="flex flex-1 flex-col gap-y-4">
            {navigation?.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li
                  key={`desktop-navigation-${index}`}
                  className="relative text-center cursor-pointer"
                >
                  <a
                    href={item.href}
                    className={`flex gap-3 items-center text-[12px] px-6 font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-100 text-black pt-3 pb-3 font-bold rounded-xl'
                        : 'hover:text-[#E0864F] text-[#3E4755] font-bold'
                    }`}
                  >
                    <span className="h-5 w-5">{item.icon}</span>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Admin Navigation */}
        <nav className="flex flex-col">
        <Button
          // onClick={() => setIsOpen(!isOpen)}
         variant="default"
         size="sm"
          className='h-12 w-30'
        >
          <MessageCircle className={`h-5 w-5 transition-transform`} />

          <div className="flex items-center">
            
            <span className="text-sm font-medium">help</span>
          </div>
    
        </Button>
        </nav>
      </div>
    </div>
  );
};

const RootSidebarMobile = () => {
  return <div className='lg:hidden'>mobile side bar</div>;
};

export { RootSidebarDesktop, RootSidebarMobile };
