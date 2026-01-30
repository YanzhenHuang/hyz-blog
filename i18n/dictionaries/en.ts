const en = {
    "test": "test",
    locale: {
        name: "English",
        flag: "🇺🇸",
    },
    ui: {
        user_ok: "Got it!",
        send: "Send",
        select_language: "Select Language",
    },
    llm: {
        card_title: "My LLM Agent",
        card_subtitle: "Chat with my LLM agent to quickly get to know about me!",
        powered_by: "Powered by Dify + Qwen-Max, using RAG.",
        assistant_intro: "Hi, I'm Huang Yanzhen's LLM agent. Please feel free to ask me anything!",
        safe_declare: "[System] The current implementation of the LLM agent is pure RAG. When your query does not match the database, hallucination may occur. I am optimizing this issue. My responses are for reference only, please refer to my resume for actual information.",
        please_ask: "Please ask me anything ~",
        please_wait: "Please wait for LLM's response ^ω^",
        thinking: "Thinking...",
        question_empty_toast: "Please at least put in one character ~",
        question_empty_toast_description: "To get things done, one must first sharpen their tools.",
        server_error_toast_title: "Oops, a little error occurred!",
        server_error_toast_description: "Low-cost development, the server can't handle it, please ask again later QAQ",
        console_log_for_employer: "Please point out my Console Error! (^人^)"
    },
    github_status: {
        card_title: "GitHub Status",
        card_subtitle: "A brief overview of my GitHub profile.",
    },
    intro_card: {
        card_title: "Introduction",
        card_subtitle: "A brief summary about me.",
        intro: "Undergraduate graduate from University of Macau, majoring in Computer Science, currently pursuing MSc in Information Technology at HKUST. Specialized in full-stack development and Machine learning.",
    },
    education: {
        card_title: "Education",
        card_subtitle: "My educational background."
    },
    prizes: {
        card_title: "Prizes",
        card_subtitle: "Academic awards I've received."
    },
    projects: {
        card_title: "Projects",
        card_subtitle: "Projects I've been working on/maintained before."
    },

} as const;

export default en;