
import { StaticImageData } from 'next/image';
import { RootSidebarDesktop, RootSidebarMobile } from '../RootSideBar';
import RootNavBar from '../RootNavBar';


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
        <div className="flex max-h-screen h-screen overflow-hidden">  
        {/* DESKTOP sidebar */}
        <div className="hidden lg:block h-screen sticky top-0">
            <RootSidebarDesktop navigation={navigation} adminNav={[]}/>
        </div>
       
        {/* MOBILE Navbar + Sidebar */}
        <RootSidebarMobile />
        
        {/* Main content */}
        <div className="flex flex-col px-8 flex-grow h-screen">
        <div className="sticky top-0 w-full z-10 bg-white">
              <RootNavBar />
              {/* <RootTabNavBar /> */}
            </div>
            <main className="flex-1 overflow-y-auto px-1">
                {children}
            </main>
        </div>
    </div>
    );
}

export default MainRoot;
