import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import NProgress from "nprogress";

export const RouterPush = (router: AppRouterInstance, path: string) => {
    NProgress.start();
    router.push(path);
    // NProgress.done();
};


// 'use client'

// import { usePathname, useRouter } from "next/navigation";
// import NProgress from "nprogress";

// export const useRouterPush = () => {
//     const router = useRouter();
//     const pathname = usePathname();

//     const push = (path: string) => {
//         // 1. Check if we are already on that path to avoid redundant progress bars
//         if (pathname === path) return;

//         // 2. Start Progress
//         NProgress.start();

//         // 3. Navigate
//         router.push(path);
//     };

//     return push;
// };