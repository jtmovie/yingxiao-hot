// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。
//
// 营销行业版：类别按平台分，key 和营销通鉴网站「平台动态」的分类 slug 一致
// （yingxiaoclub 仓库 lib/platform-updates/topics.ts），同步时直接对应，改 key 要两边一起改。
// 内容类型（平台规则、营销案例、报告数据、观点方法……）放在分类标签里。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节，这里是「行业与品牌」）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "xiaohongshu", label: "小红书", feedLabel: "小红书动态", section: "小红书", guide: "小红书平台的规则、功能、流量政策、商业产品（聚光、蒲公英、乘风等）、电商与治理公告，以及以小红书为主战场的营销动作。" },
  { key: "douyin", label: "抖音", feedLabel: "抖音动态", section: "抖音", guide: "抖音、巨量引擎、巨量千川、抖音电商、今日头条等字节系营销平台的规则、功能、流量政策、治理与数据。字节的通用 AI 模型发布不归这里。" },
  { key: "shipinhao", label: "视频号", feedLabel: "视频号动态", section: "视频号", guide: "微信视频号的内容、直播、带货、流量和商业化规则与功能。公众号、朋友圈、企业微信归私域。" },
  { key: "private-traffic", label: "私域", feedLabel: "私域与微信生态", section: "私域与微信生态", guide: "微信生态（公众号、朋友圈、小程序、搜一搜、微信广告）、企业微信、社群和会员运营相关的规则、功能和做法。" },
  { key: "ecommerce", label: "电商", feedLabel: "电商动态", section: "电商", guide: "淘宝天猫、京东、拼多多、美团、快手电商等电商与本地生活平台的规则、商家工具、大促节点和经营数据。平台给自家商家上线的 AI 工具也归这里，不归 AI。" },
  { key: "ai-marketing", label: "AI", feedLabel: "AI 营销", section: "AI 营销", guide: "明确面向营销、广告、内容生产场景的独立 AI 产品与能力，AI 广告的商业化动作，以及 AIGC 在品牌营销中的具体落地。通用大模型发布、AI 硬件、与营销无关的 AI 新闻不归这里。" },
  { key: "general", label: "综合", feedLabel: "行业与品牌", section: "行业与品牌", guide: "不属于上面任一平台的营销行业新闻：品牌营销案例、广告公司与代理商变化、行业监管、行业报告与数据、快手/B站/微博/知乎等其他平台，以及海外营销动态。" },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（AI 行业是新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * 营销行业没有这样单独计数的一类发布，设成 null，报头不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["ai", "aigc", "api", "gmv", "roi", "kol", "koc", "ip", "dau", "mau", "ceo", "ipo", "618", "双11"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["platform_rule", "platform_feature", "industry_event", "brand_campaign", "data_report", "ai_marketing", "method_opinion"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "平台规则", "平台功能", "商业化/广告产品", "营销案例", "行业动态", "报告/数据", "AI营销", "方法/观点", "政策/监管", "人事/组织", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "种草", "直播", "短视频", "达人/KOL", "内容营销", "品牌联名", "代言人", "广告投放", "大促", "本地生活", "出海", "会员/私域", "搜索营销", "IP营销", "AIGC",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["小红书", "抖音", "巨量引擎", "微信", "腾讯广告", "淘宝天猫", "京东", "拼多多", "美团", "快手", "B站", "微博"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  规则: "平台规则", 治理: "平台规则", 新规: "平台规则", 处罚: "平台规则", 公告: "平台规则",
  功能: "平台功能", 新功能: "平台功能", 上线: "平台功能", 产品更新: "平台功能",
  广告产品: "商业化/广告产品", 商业化: "商业化/广告产品", 广告: "商业化/广告产品", 投放工具: "商业化/广告产品",
  案例: "营销案例", 品牌案例: "营销案例", campaign: "营销案例", 创意: "营销案例", 广告片: "营销案例",
  行业: "行业动态", 动态: "行业动态", 融资: "行业动态", 收购: "行业动态", 财报: "行业动态", 代理商: "行业动态",
  报告: "报告/数据", 数据: "报告/数据", 研究: "报告/数据", 白皮书: "报告/数据", 榜单: "报告/数据",
  ai: "AI营销", "AI 营销": "AI营销", 人工智能: "AI营销",
  观点: "方法/观点", 方法: "方法/观点", 方法论: "方法/观点", 复盘: "方法/观点", 教程: "方法/观点", 趋势: "方法/观点",
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管",
  人事: "人事/组织", 任命: "人事/组织", 离职: "人事/组织", 组织调整: "人事/组织",
  达人: "达人/KOL", kol: "达人/KOL", 博主: "达人/KOL", 联名: "品牌联名", 双十一: "大促", 双11: "大促", 618: "大促",
  私域: "会员/私域", 会员: "会员/私域", 社群: "会员/私域", 天猫: "淘宝天猫", 淘宝: "淘宝天猫", 阿里妈妈: "淘宝天猫",
  巨量千川: "巨量引擎", 千川: "巨量引擎", 抖音电商: "抖音", 视频号: "微信", 企业微信: "微信", 公众号: "微信",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是公司自己的其他称呼（官方账号名、子品牌），
 * 把事实的主体对到发布方时也认它们。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {
  xiaohongshu: { name: "小红书", displayTag: "小红书", aliases: ["小红书", "RED", "蒲公英", "聚光", "乘风"], otherNames: ["小红书商业动态", "小红书商业化", "行吟信息"] },
  bytedance: { name: "字节跳动 / 抖音", displayTag: "抖音", aliases: ["抖音", "字节跳动", "巨量引擎", "巨量千川", "抖音电商", "今日头条", "TikTok"], otherNames: ["巨量算数", "巨量学堂", "抖音电商学习中心", "ByteDance"] },
  tencent: { name: "腾讯 / 微信", displayTag: "微信", aliases: ["腾讯", "微信", "视频号", "企业微信", "公众号", "腾讯广告"], otherNames: ["微信公开课", "腾讯营销洞察", "Tencent"] },
  alibaba: { name: "阿里巴巴 / 淘宝天猫", displayTag: "淘宝天猫", aliases: ["阿里巴巴", "淘宝", "天猫", "阿里妈妈", "淘天"], otherNames: ["淘天集团", "Alibaba"] },
  jd: { name: "京东", displayTag: "京东", aliases: ["京东", "京准通", "京东零售"], otherNames: ["JD"] },
  pinduoduo: { name: "拼多多", displayTag: "拼多多", aliases: ["拼多多", "Temu"], otherNames: ["PDD"] },
  meituan: { name: "美团", displayTag: "美团", aliases: ["美团", "大众点评", "美团外卖"] },
  kuaishou: { name: "快手", displayTag: "快手", aliases: ["快手", "磁力引擎", "磁力金牛", "快手电商"] },
  bilibili: { name: "哔哩哔哩", displayTag: "B站", aliases: ["B站", "哔哩哔哩", "bilibili", "花火"], otherNames: ["bilibili商业观察"] },
  weibo: { name: "微博", displayTag: "微博", aliases: ["微博", "新浪微博"] },
  baidu: { name: "百度", displayTag: null, aliases: ["百度", "百度营销"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 营销新闻里平台名容易被模型写错（把视频号的规则写成抖音的），所以主要平台都列上。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "xiaohongshu", name: "小红书", patterns: [/小红书|蒲公英|聚光平台|\bRED\b/] },
  { id: "bytedance", name: "抖音 / 字节", patterns: [/抖音|字节跳动|巨量|千川|今日头条|bytedance|tiktok/i] },
  { id: "tencent", name: "腾讯 / 微信", patterns: [/腾讯|微信|视频号|企业微信|公众号|tencent|wechat/i] },
  { id: "alibaba", name: "阿里 / 淘宝天猫", patterns: [/阿里|淘宝|天猫|淘天|alibaba|taobao|tmall/i] },
  { id: "jd", name: "京东", patterns: [/京东|\bJD\b/] },
  { id: "pinduoduo", name: "拼多多", patterns: [/拼多多|\btemu\b|\bPDD\b/i] },
  { id: "meituan", name: "美团", patterns: [/美团|大众点评/] },
  { id: "kuaishou", name: "快手", patterns: [/快手|磁力引擎|磁力金牛/] },
  { id: "bilibili", name: "B站", patterns: [/B站|哔哩哔哩|bilibili/i] },
  { id: "weibo", name: "微博", patterns: [/微博|weibo/i] },
  { id: "baidu", name: "百度", patterns: [/百度|baidu/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "xiaohongshu", domains: ["xiaohongshu.com"] },
  { entityId: "bytedance", domains: ["oceanengine.com", "bytedance.com"] },
  { entityId: "tencent", domains: ["tencent.com", "e.qq.com"] },
  { entityId: "alibaba", domains: ["alimama.com", "alibabagroup.com"] },
  { entityId: "jd", domains: ["jd.com"] },
  { entityId: "kuaishou", domains: ["kuaishou.com"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [];
