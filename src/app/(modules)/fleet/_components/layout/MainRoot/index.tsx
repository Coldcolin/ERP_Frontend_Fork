
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <div className="flex flex-col px-8 flex-grow h-screen">
        <div className="sticky top-0 w-full z-10 ">
              <RootNavBar />
              {/* <RootTabNavBar /> */}
            </div>
            <main className="flex-grow overflow-y-auto  px-1">
                {children}
            </main>
        </div>
    </div>
    );
}

export default MainRoot;
