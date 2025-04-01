// 模拟导航菜单数据
export const menuData = {
  code: 200,
  message: "操作成功",
  data: [
    {
      path: "/dashboard",
      component: "Layout",
      redirect: "/dashboard/index",
      meta: {
        title: "控制台",
        icon: "HomeFilled",
        roles: ["admin", "editor", "user"],
        affix: true
      },
      children: [
        {
          path: "index",
          component: "dashboard/index",
          name: "Dashboard",
          meta: {
            title: "首页",
            icon: "HomeFilled",
            roles: ["admin", "editor", "user"]
          }
        }
      ]
    },
    {
      path: "/system",
      component: "Layout",
      redirect: "/system/user",
      meta: {
        title: "系统管理",
        icon: "Setting",
        roles: ["admin"]
      },
      children: [
        {
          path: "user",
          component: "system/user/index",
          name: "User",
          meta: {
            title: "用户管理",
            icon: "User",
            roles: ["admin"]
          }
        },
        {
          path: "role",
          component: "system/role/index",
          name: "Role",
          meta: {
            title: "角色管理",
            icon: "UserFilled",
            roles: ["admin"]
          }
        },
        {
          path: "menu",
          component: "system/menu/index",
          name: "Menu",
          meta: {
            title: "菜单管理",
            icon: "Menu",
            roles: ["admin"]
          }
        },
        {
          path: "permission",
          component: "system/permission/index",
          name: "Permission",
          meta: {
            title: "权限管理",
            icon: "Lock",
            roles: ["admin"]
          }
        }
      ]
    },
    {
      path: "/content",
      component: "Layout",
      redirect: "/content/article",
      meta: {
        title: "内容管理",
        icon: "Document",
        roles: ["admin", "editor"]
      },
      children: [
        {
          path: "article",
          component: "content/article/index",
          name: "Article",
          meta: {
            title: "文章管理",
            icon: "Document",
            roles: ["admin", "editor"]
          }
        },
        {
          path: "category",
          component: "content/category/index",
          name: "Category",
          meta: {
            title: "分类管理",
            icon: "Files",
            roles: ["admin", "editor"]
          }
        },
        {
          path: "tag",
          component: "content/tag/index",
          name: "Tag",
          meta: {
            title: "标签管理",
            icon: "CollectionTag",
            roles: ["admin", "editor"]
          }
        },
        {
          path: "comment",
          component: "content/comment/index",
          name: "Comment",
          meta: {
            title: "评论管理",
            icon: "ChatDotRound",
            roles: ["admin", "editor"]
          }
        }
      ]
    },
    {
      path: "/media",
      component: "Layout",
      redirect: "/media/image",
      meta: {
        title: "媒体管理",
        icon: "Picture",
        roles: ["admin", "editor"]
      },
      children: [
        {
          path: "image",
          component: "media/image/index",
          name: "Image",
          meta: {
            title: "图片管理",
            icon: "Picture",
            roles: ["admin", "editor"]
          }
        },
        {
          path: "file",
          component: "media/file/index",
          name: "File",
          meta: {
            title: "文件管理",
            icon: "Folder",
            roles: ["admin", "editor"]
          }
        },
        {
          path: "video",
          component: "media/video/index",
          name: "Video",
          meta: {
            title: "视频管理",
            icon: "VideoCamera",
            roles: ["admin", "editor"]
          }
        }
      ]
    },
    {
      path: "/statistics",
      component: "Layout",
      redirect: "/statistics/dashboard",
      meta: {
        title: "统计分析",
        icon: "DataLine",
        roles: ["admin"]
      },
      children: [
        {
          path: "dashboard",
          component: "statistics/dashboard/index",
          name: "StatisticsDashboard",
          meta: {
            title: "数据仪表盘",
            icon: "DataAnalysis",
            roles: ["admin"]
          }
        },
        {
          path: "visitor",
          component: "statistics/visitor/index",
          name: "VisitorStatistics",
          meta: {
            title: "访问统计",
            icon: "View",
            roles: ["admin"]
          }
        }
      ]
    },
    {
      path: "/profile",
      component: "Layout",
      redirect: "/profile/index",
      hidden: false,
      children: [
        {
          path: "index",
          component: "profile/index",
          name: "Profile",
          meta: {
            title: "个人中心",
            icon: "User",
            roles: ["admin", "editor", "user"]
          }
        }
      ]
    },
    {
      path: "/error",
      component: "Layout",
      redirect: "/error/404",
      meta: {
        title: "错误页面",
        icon: "WarningFilled",
        roles: ["admin"]
      },
      children: [
        {
          path: "404",
          component: "error-page/404",
          name: "Page404",
          meta: {
            title: "404页面",
            icon: "Warning",
            roles: ["admin"]
          }
        },
        {
          path: "403",
          component: "error-page/403",
          name: "Page403",
          meta: {
            title: "403页面",
            icon: "CircleCloseFilled",
            roles: ["admin"]
          }
        },
        {
          path: "500",
          component: "error-page/500",
          name: "Page500",
          meta: {
            title: "500页面",
            icon: "WarningFilled",
            roles: ["admin"]
          }
        }
      ]
    }
  ]
};

// 模拟 API 请求
export function mockGetRouters() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(menuData);
    }, 300);
  });
} 