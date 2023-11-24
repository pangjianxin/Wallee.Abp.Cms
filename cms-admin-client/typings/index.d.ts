// / <reference types="vite/client" />
declare module "vue-router" {
  interface RouteMeta {
    // 是否需要认证
    auth?: boolean;
    //菜单图标
    icon?: string;
    //菜单标题
    title?: string;
    //是否可见
    visible?: boolean;
    //描述/分类
    desc?: string;
    //layout
    layout?: "default" | "404";
    //是否为底部菜单
    visibleOnBottom?: boolean;
    //需要的权限信息
    permissions?: Array<string>;
  }
}

declare type MenuInfo = {
  icon: string;
  title: string;
  routeName: string;
  path: string;
};

declare type Pageable = {
  filter?: string;
  pageNum: number;
  pageSize: number;
  total: number;
  sorting?: string;
};
