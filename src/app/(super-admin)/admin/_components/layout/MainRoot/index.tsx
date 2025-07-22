
import { StaticImageData } from 'next/image';
import { RootSidebarDesktop, RootSidebarMobile } from '../RootSideBar';
// import { useSelector } from 'react-redux';



// import { SidebarDesktop, SidebarMobile } from './ProductSidebar';

export type NavigationSidebarProps = {
    label?: string;
    menu: {
        count?: number;
        href: string;
        label: string;
    }[];
};

export type ProductInfoSwitchProps = {
    logo: StaticImageData;
    slug?: string;
    title: string;
};

type ProductRootProps = {
    children: React.ReactNode;
    navigation: any;
  
};

function MainRoot({ children, navigation }: ProductRootProps) {
    return (
        <div className="flex h-screen">  
        {/* DESKTOP sidebar */}
        <div className="hidden lg:block h-screen sticky top-0">
            <RootSidebarDesktop navigation={navigation} adminNav={[]}/>
        </div>
       
        {/* MOBILE Navbar + Sidebar */}
        <RootSidebarMobile />
        
        {/* Main content */}
        <div className="flex-1 h-screen overflow-y-auto">
            <main className="p-2 md:p-4">
                {children}
            </main>
        </div>
    </div>
    );
}

export default MainRoot;
