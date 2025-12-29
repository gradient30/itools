/**
 * 系统公告配置文件
 * 
 * 使用说明：
 * 1. 在 announcements 数组中添加新公告
 * 2. 每条公告需要唯一的 id（用于判断已读状态）
 * 3. 支持多个公告项 (items)，每项有不同的类型标签
 * 4. 最新公告放在数组最前面
 */

export type AnnouncementItemType = "new" | "fix" | "optimize" | "remove" | "notice";

export interface AnnouncementItem {
    /** 公告项类型 */
    type: AnnouncementItemType;
    /** 标题 */
    title: string;
    /** 详细描述 */
    description: string;
}

export interface Announcement {
    /** 唯一标识，用于判断已读状态，建议格式：YYYY-MM-DD-vN */
    id: string;
    /** 发布日期，格式：YYYY-MM-DD */
    date: string;
    /** 发布人 */
    author: string;
    /** 公告项列表 */
    items: AnnouncementItem[];
}

/** 公告类型对应的显示配置 */
export const announcementTypeConfig: Record<AnnouncementItemType, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    new: { label: "新增", variant: "default" },
    fix: { label: "修复", variant: "secondary" },
    optimize: { label: "优化", variant: "outline" },
    remove: { label: "移除", variant: "destructive" },
    notice: { label: "通知", variant: "secondary" },
};

/**
 * 公告列表
 * 最新公告放在数组最前面
 */
export const announcements: Announcement[] = [
    {
        id: "2025-01-01-v1",
        date: "2025-01-01",
        author: "系统",
        items: [
            {
                type: "new",
                title: "文档参考 - 安全测试参考",
                description: "新增安全测试参考文档，包含 OWASP Top 10 详细攻击示例、漏洞代码与安全代码对比、测试 Payload、安全响应头配置、安全工具集合及检查清单等内容。",
            },
        ],
    },
    // 添加新公告示例（取消注释并修改）：
    // {
    //   id: "2025-01-02-v1",
    //   date: "2025-01-02",
    //   author: "管理员",
    //   items: [
    //     {
    //       type: "new",
    //       title: "新功能标题",
    //       description: "新功能的详细描述...",
    //     },
    //     {
    //       type: "fix",
    //       title: "修复问题标题",
    //       description: "修复问题的详细描述...",
    //     },
    //     {
    //       type: "optimize",
    //       title: "优化项标题",
    //       description: "优化内容的详细描述...",
    //     },
    //   ],
    // },
];

/** 获取最新公告 */
export const getLatestAnnouncement = (): Announcement | null => {
    return announcements.length > 0 ? announcements[0] : null;
};

/** 获取最新公告的版本ID（用于已读状态判断） */
export const getLatestAnnouncementId = (): string => {
    return announcements.length > 0 ? announcements[0].id : "";
};

/** 联系方式配置 */
export const contactConfig = {
    qq: "349487325",
    email: "admin@996fb.cn",
};
