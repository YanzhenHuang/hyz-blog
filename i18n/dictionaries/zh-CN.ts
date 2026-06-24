const zhCN = {
    test: "测试",
    locale: {
        name: "中文",
        flag: "🇨🇳",
    },
    ui: {
        user_ok: "知道了",
        send: "发送",
        select_language: "选择语言",
    },
    llm: {
        card_title: "我的LLM代理",
        card_subtitle: "跟我的代理LLM聊聊天，简单掌握我的讯息！",
        powered_by: "使用Dify 和 Qwen-Max配合RAG完成。",
        assistant_intro: "你好！我是黄彦祯的代理LLM，请问我你想问的问题！",
        safe_declare: "[系统] 目前代理机器人的实现方式为纯RAG，当您的Query未命中资料库时会产生幻觉问题，主人正在针对此优化中。我的回答仅供参考，实际情况请以简历为准~",
        thinking: "思考中...",
        please_ask: "问啥都可以~",
        please_wait: "请等待LLM回答结束^ω^",
        question_empty_toast_title: "请至少输入一个文字~",
        question_empty_toast_description: "欲要成其事，必先利其器",
        server_error_toast_title: "哎呀，有点小错误！",
        server_error_toast_description: "低成本开发，服务器顶不住呀，等会再问呗QAQ",
        console_log_for_employer: "请指正我的Console Error! (^人^)"
    },
    github_status: {
        card_title: "GitHub状态",
        card_subtitle: "我的GitHub资料一览",
    },
    intro_card: {
        card_title: "自我介绍",
        card_subtitle: "一些关于我的信息",
        intro: "本科毕业于澳门大学计算机专业，香港科技大学信息技术专业硕士毕业中。专注于全栈开发和机器学习。我具有方面的技术背景。首先，我熟悉 Linux 下的 Python 虚拟环境及 PyTorch 库的配置与使用；熟练使用多种数据处理相关库 (Pandas, Numpy)。在此基础上，我在硕士学习中培养了LLM前沿论文复现、LLM LoRA微调（包括GPT2、Qwen3系列）、数据处理与下游任务应用与评估（常识推理、幻觉检测等）的技能；我还具有使用Spark框架进行大数据分析的经验。前端工程化方面，我较了解 Node.js 技术栈、 NextJS 与 React 框架，熟练使用 TypeScript，并且能够熟练熟练使用 Docker 等部署工具。",
    },
    education: {
        card_title: "教育背景",
        card_subtitle: "我的教育背景"
    },
    prizes: {
        card_title: "获奖",
        card_subtitle: "我所获得的奖项"
    },
    projects: {
        card_title: "项目",
        card_subtitle: "我的当前正在维护/曾维护过的项目"
    },
} as const;

export default zhCN;