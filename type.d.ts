interface GitHubUserData {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: false;
    bio: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

interface GitHubRepoData {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: GitHubUserData;
    html_url: string;
    description: string;
    fork: boolean;
    url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    teams_url: string;
    hooks_url: string;
    issue_events_url: string;
    events_url: string;
    assignees_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    git_tags_url: string;
    git_refs_url: string;
    trees_url: string;
    statuses_url: string;
    languages_url: string;
    stargazers_url: string;
    contributors_url: string;
    subscribers_url: string;
    subscription_url: string;
    commits_url: string;
    git_commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    contents_url: string;
    compare_url: string;
    merges_url: string;
    archive_url: string;
    downloads_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
    releases_url: string;
    deployments_url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    git_url: string;
    ssh_url: string;
    clone_url: string;
    svn_url: string;
    homepage: string;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_discussions: boolean;
    forks_count: number;
    mirror_url: string | null;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license: {
        key: string;
        name: string;
        spdx_id: string;
        url: string;
        node_id: string;
    } | null;
    allow_forking: boolean;
    is_template: boolean;
    web_commit_signoff_required: boolean;
    topics: string[];
    visibility: string;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
}

interface GitHubOrganizationData {
    login: string;
    id: number;
    node_id: string;
    url: string;
    repos_url: string;
    events_url: string;
    hooks_url: string;
    issues_url: string;
    members_url: string;
    public_members_url: string;
    avatar_url: string;
    description: string;
}

interface Education {
    institution: string;
    url: string;
    major: string;
    degree: string;
    start_date: string;
    end_date: string;
    gpa: string;
};

interface Prize {
    title: {
        CN: string,
        EN: string
    },
    about: string,
    date: string,
    issuer: string,
    link: string
}

interface PersonalInfo {
    name: string;
    name_en: string;
    birth: string;
    avatar_url: string;
    phone: { area: string; number: string }[];
    email: {
        work: string[];
        home: string[];
    };
    wechat: string;
    github: string;
    prizes: Prize[];
    education: Education[];
    intro: string;
};

/**
 * LLM-Related
 */

type LLMEventTypes = 
| 'node_started' 
| 'node_finished' 
| 'workflow_started' 
| 'workflow_finished' 
| 'message' 
| 'message_end';

/**
 * 基础事件
 */
interface LLMEventBase {
    event: LLMEventTypes;
    conversation_id: string;
    message_id: string;
    created_at: number;
    task_id: string;
};

/**
 * Dify Workflow节点开始事件
 */
interface LLMNodeStarted extends LLMEventBase {
    event: 'node_started';
    workflow_run_id: string;
    data: {
        id: string;
        node_id: string;
        node_type: string;
        title: string;
        index: string;
        created_at: number;
    } & any;
};

/**
 * Dify Workflow节点结束事件
 */
interface LLMNodeFinished extends LLMEventBase {
  event: 'node_finished';
  workflow_run_id: string;
  data: {
    id: string;
    node_id: string;
    node_type: string;
    title: string;
    index: number;
    predecessor_node_id: string | null;
    inputs: Record<string, any> | null;
    process_data?: Record<string, any>;
    outputs?: Record<string, any>;
    status: 'succeeded' | 'failed';
    error: string | null;
    elapsed_time: number;
    execution_metadata: Record<string, any>;
    created_at: number;
    finished_at: number;
    files?: any[];
    parallel_id?: string | null;
    parent_parallel_id?: string | null;
    parent_parallel_start_node_id?: string | null;
    iteration_id?: string | null;
    loop_id?: string | null;
  };
};

/**
 * Dify 整个Workflow执行开始事件
 */
interface LLMWorkflowStarted extends LLMEventBase {
  event: 'workflow_started';
  workflow_run_id: string;
  data: {
    id: string; // workflow_run_id 的复制
    workflow_id: string;
    inputs: Record<string, any>; // sys.query, sys.user_id, sys.files, ...
    created_at: number;
  };
}

/**
 * Dify 整个Workflow执行完成事件
 */
interface LLMWorkflowFinished extends LLMEventBase {
  event: 'workflow_finished';
  workflow_run_id: string;
  data: {
    id: string;
    status: 'succeeded' | 'failed' | 'cancelled';
    error: string | null;
    created_at: number;
    finished_at: number;
    outputs?: Record<string, any>;
    execution_metadata: Record<string, any>;
    files?: any[];
  };
};

/**
 * LLM 响应正式结束事件
 */
interface LLMMessageEnd extends LLMEventBase {
  event: 'message_end';
  data: {
    reason?: string;
  };
}

/** 
 * LLM 流式响应事件
 */
interface LLMMessage extends LLMEventBase {
    event: 'message';
    id: string;
    answer: string;
    from_variable_selector: string[];
}

type LLMEvents =
  | LLMWorkflowStarted
  | LLMNodeStarted
  | LLMNodeFinished
  | LLMWorkflowFinished
  | LLMMessage
  | LLMMessageEnd;

/** Frontend */

type FrontendMessageTypes = 'text' | 'process' | 'ended';

interface FrontendMessageBase {
    type: FrontendMessageTypes;
    message: string;
    conversation_id: string;
}

interface FrontendMessageText extends FrontendMessageBase {
    type: 'text';
}

interface FrontendMessageProcess extends FrontendMessageBase {
    type: 'process';
}

interface FrontendMessageEnded extends FrontendMessageBase {
    type: 'ended';
}

type FrontendMessages = 
| FrontendMessageText 
| FrontendMessageProcess 
| FrontendMessageEnded;