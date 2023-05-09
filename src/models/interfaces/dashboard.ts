export interface IDashboardView {
    list: string[];
}
export interface IStatisticsBox {
    param: string;
    count?: number;
    cssClass: string;
}
export interface IDashboardWidget {
    allowMaximize?: boolean;
    allowMinimize?: boolean;
    allowFullscreen?: boolean;
    reload?: boolean;
    title: any;
    children?: any;
    reloadHandler?: () => void;
    childRef?: any;
    isLoading?: boolean;
    className?: string;
    rootClassName?: string;
    hideHeader?: boolean;
    headerClass?: string;
}