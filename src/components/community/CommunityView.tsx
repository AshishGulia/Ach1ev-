import React, { useState, useEffect } from 'react';
import { SubjectCourse, SnippetScreenshot, UserProfile } from '../../types';
import {
  Users,
  MessageSquare,
  Sparkles,
  Heart,
  Bookmark,
  CheckCircle2,
  Stethoscope,
  Search,
  Plus,
  Send,
  Check,
  X,
  Minus,
  UserPlus,
  UserCheck,
  GraduationCap,
  Newspaper,
  Clock,
  BookOpen,
  AtSign,
  UserX,
  MessageCircle,
} from 'lucide-react';

export interface StudyPeer {
  id: string;
  name: string;
  username: string;
  role: string;
  institution: string;
  specialty: string;
  avatar: string;
  status: 'online' | 'studying' | 'in-library' | 'offline';
  connectionState: 'friend' | 'incoming_request' | 'outgoing_pending' | 'discover';
  mutualGroups: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe?: boolean;
}

export interface StudyGroupItem {
  id: string;
  name: string;
  category: string;
  description: string;
  membersCount: number;
  avatar: string;
  isJoined: boolean;
  lastActive: string;
  recentTopic: string;
  unreadCount?: number;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorUsername: string;
  text: string;
  timeAgo: string;
}

export interface CommunityPost {
  id: string;
  type: 'note' | 'case' | 'mnemonic' | 'qa';
  title: string;
  author: {
    name: string;
    username: string;
    role: string;
    hospitalOrCollege: string;
    avatar: string;
    badge?: string;
  };
  timeAgo: string;
  subject: SubjectCourse | string;
  content: string;
  tags: string[];
  likes: number;
  comments: PostComment[];
  hasLiked?: boolean;
  isBookmarked?: boolean;
  casePoll?: {
    question: string;
    options: { id: string; text: string; votes: number; isCorrect?: boolean }[];
    totalVotes: number;
    userVote?: string;
    explanation: string;
  };
  mnemonicData?: {
    acronym: string;
    meaning: string;
    highYieldExam: string;
  };
}

const STARTER_PEERS: StudyPeer[] = [
  {
    id: 'peer-aarav',
    name: 'Aarav Sharma',
    username: 'aarav_med',
    role: 'MBBS Year 3',
    institution: 'AIIMS Study Circle',
    specialty: 'Pharmacology',
    avatar: '',
    status: 'online',
    connectionState: 'friend',
    mutualGroups: 2,
  },
  {
    id: 'peer-ananya',
    name: 'Ananya Verma',
    username: 'ananya_neuro',
    role: 'NEET PG Aspirant',
    institution: 'KEM Scholars',
    specialty: 'Neuroanatomy',
    avatar: '',
    status: 'studying',
    connectionState: 'incoming_request',
    mutualGroups: 1,
  },
  {
    id: 'peer-kabir',
    name: 'Kabir Mehta',
    username: 'kabir_cardio',
    role: 'USMLE Step 1 Prep',
    institution: 'Ach1ev Cohort',
    specialty: 'Cardiology',
    avatar: '',
    status: 'in-library',
    connectionState: 'discover',
    mutualGroups: 1,
  },
  {
    id: 'peer-zoya',
    name: 'Zoya Khan',
    username: 'zoya_notes',
    role: 'Pathology Fellow',
    institution: 'MAMC Library',
    specialty: 'Pathology',
    avatar: '',
    status: 'online',
    connectionState: 'discover',
    mutualGroups: 3,
  },
];

const STARTER_GROUPS: StudyGroupItem[] = [
  {
    id: 'grp-morning-pomodoro',
    name: '5 AM Deep Focus Study Squad',
    category: 'Daily Revision',
    description: 'Synchronized 50/10 study sprints, daily MCQs, and active recall summaries.',
    membersCount: 42,
    avatar: '',
    isJoined: true,
    lastActive: 'Active now',
    recentTopic: 'Autonomic Pharmacology & Receptor Agonists',
    unreadCount: 2,
  },
  {
    id: 'grp-highyield-mnemonics',
    name: 'Visual Mnemonics & Flowchart Exchange',
    category: 'Shared Notes',
    description: 'Share compact memory hooks, flowcharts, and annotated PDF pages with peers.',
    membersCount: 31,
    avatar: '',
    isJoined: false,
    lastActive: '18m ago',
    recentTopic: 'Coagulation Cascade Shortcut Flowchart',
  },
];

const STARTER_POSTS: CommunityPost[] = [
  {
    id: 'post-hub-1',
    type: 'mnemonic',
    title: 'Rapid Recall: Cranial Nerve Parasympathetic Ganglia',
    author: {
      name: 'Aarav Sharma',
      username: 'aarav_med',
      role: 'MBBS Year 3',
      hospitalOrCollege: 'Ach1ev Study Circle',
      avatar: '',
      badge: 'Top Contributor',
    },
    timeAgo: '14m ago',
    subject: 'Anatomy',
    content:
      'Grouped the four parasympathetic ganglia with their exit nerves and target glands into a 10-second recall matrix so you never mix up Otic vs Submandibular under exam pressure.',
    tags: ['Anatomy', 'Mnemonic', 'High-Yield'],
    likes: 18,
    hasLiked: false,
    comments: [
      {
        id: 'c-1',
        authorName: 'Zoya Khan',
        authorUsername: 'zoya_notes',
        text: 'Saved straight to my quick revision notebook — thank you!',
        timeAgo: '6m ago',
      },
    ],
    mnemonicData: {
      acronym: 'C-P-S-O → 3-7-7-9',
      meaning: 'Ciliary (CN III) · Pterygopalatine (CN VII) · Submandibular (CN VII) · Otic (CN IX)',
      highYieldExam: 'NEET PG / USMLE',
    },
  },
  {
    id: 'post-hub-2',
    type: 'case',
    title: 'Practice Question: First-Line Drug in Acute Hyperkalemia with ECG Peaked T-Waves',
    author: {
      name: 'Ananya Verma',
      username: 'ananya_neuro',
      role: 'NEET PG Aspirant',
      hospitalOrCollege: 'KEM Scholars',
      avatar: '',
      badge: 'Study Group Lead',
    },
    timeAgo: '1h ago',
    subject: 'Pharmacology',
    content:
      'A patient arrives with K+ 6.9 mEq/L and peaked T-waves on lead II. Which intervention stabilizes the myocardial membrane FIRST before shifting potassium intracellularly?',
    tags: ['Emergency', 'Pharmacology', 'MCQ'],
    likes: 27,
    hasLiked: false,
    comments: [],
    casePoll: {
      question: 'Select the immediate membrane-stabilizing step:',
      options: [
        { id: 'a', text: 'IV Calcium Gluconate 10%', votes: 21, isCorrect: true },
        { id: 'b', text: 'Regular Insulin + 50% Dextrose', votes: 6 },
        { id: 'c', text: 'Nebulized Albuterol', votes: 2 },
        { id: 'd', text: 'Oral Potassium Binder', votes: 1 },
      ],
      totalVotes: 30,
      explanation:
        'IV Calcium Gluconate stabilizes cardiac membrane threshold potential within 1–3 minutes without lowering serum K+. Insulin + glucose follows immediately to shift K+ intracellularly.',
    },
  },
];

interface CommunityViewProps {
  currentSubject: SubjectCourse;
  userProfile?: UserProfile;
  onSnipToNote?: (snippet: SnippetScreenshot) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  currentSubject,
  userProfile,
  onSnipToNote,
}) => {
  const myName = userProfile?.name || 'Scholar';
  const myUsername = userProfile?.username || 'scholar';

  // Study-centric Ach1evers Hub tabs: Feed (default FB-style hub), Friends & Requests, Study Groups, Messenger
  const [activeSection, setActiveSection] = useState<'feed' | 'friends' | 'groups' | 'chat'>('feed');

  // Floating bottom chat dock
  const [isFbChatOpen, setIsFbChatOpen] = useState<boolean>(false);
  const [isFbChatMinimized, setIsFbChatMinimized] = useState<boolean>(false);

  // Persisted state
  const [peers, setPeers] = useState<StudyPeer[]>(() => {
    try {
      const saved = localStorage.getItem('ach1ev_hub_friends_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return STARTER_PEERS;
  });

  const [groups, setGroups] = useState<StudyGroupItem[]>(() => {
    try {
      const saved = localStorage.getItem('ach1ev_hub_groups_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return STARTER_GROUPS;
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('ach1ev_hub_posts_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return STARTER_POSTS;
  });

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('ach1ev_hub_chats_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('ach1ev_hub_friends_v1', JSON.stringify(peers));
    } catch {}
  }, [peers]);

  useEffect(() => {
    try {
      localStorage.setItem('ach1ev_hub_groups_v1', JSON.stringify(groups));
    } catch {}
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem('ach1ev_hub_posts_v1', JSON.stringify(posts));
    } catch {}
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem('ach1ev_hub_chats_v1', JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages]);

  // Inline composer + search states
  const [composerTitle, setComposerTitle] = useState('');
  const [composerContent, setComposerContent] = useState('');
  const [composerType, setComposerType] = useState<'note' | 'mnemonic' | 'case' | 'qa'>('note');
  const [composerAcronym, setComposerAcronym] = useState('');
  const [feedFilter, setFeedFilter] = useState<'all' | 'note' | 'mnemonic' | 'case' | 'qa'>('all');
  const [feedSearch, setFeedSearch] = useState('');

  // Comments expansion per post
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Friends search (matches name OR @username) + add custom @username peer
  const [friendSearch, setFriendSearch] = useState('');
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [newPeerName, setNewPeerName] = useState('');
  const [newPeerUsername, setNewPeerUsername] = useState('');
  const [newPeerSubject, setNewPeerSubject] = useState('');

  // Study Groups create form
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Study Circle');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Active Chat Target
  const [activeChatTarget, setActiveChatTarget] = useState<{
    id: string;
    name: string;
    username?: string;
    avatar: string;
    isGroup?: boolean;
  } | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [snippedId, setSnippedId] = useState<string | null>(null);

  const incomingRequests = peers.filter((p) => p.connectionState === 'incoming_request');
  const connectedFriends = peers.filter((p) => p.connectionState === 'friend');

  const handleSendFriendRequest = (peerId: string) => {
    setPeers((prev) =>
      prev.map((p) =>
        p.id === peerId ? { ...p, connectionState: 'outgoing_pending' } : p
      )
    );
  };

  const handleAcceptRequest = (peerId: string) => {
    setPeers((prev) =>
      prev.map((p) => (p.id === peerId ? { ...p, connectionState: 'friend' } : p))
    );
  };

  const handleDeclineOrRemove = (peerId: string) => {
    setPeers((prev) =>
      prev.map((p) => (p.id === peerId ? { ...p, connectionState: 'discover' } : p))
    );
  };

  const handleToggleGroupJoin = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              isJoined: !g.isJoined,
              membersCount: g.isJoined ? Math.max(0, g.membersCount - 1) : g.membersCount + 1,
            }
          : g
      )
    );
  };

  const handleOpenChatWith = (
    id: string,
    name: string,
    avatar: string,
    isGroup = false,
    username?: string
  ) => {
    setActiveChatTarget({ id, name, avatar, isGroup, username });
    setIsFbChatOpen(true);
    setIsFbChatMinimized(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatTarget) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: myName,
      senderAvatar: userProfile?.avatarUrl || '',
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    const targetId = activeChatTarget.id;
    setChatMessages((prev) => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), newMsg],
    }));
    setMessageInput('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerContent.trim() && !composerTitle.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      type: composerType,
      title: composerTitle.trim() || `${currentSubject} Study Update`,
      author: {
        name: myName,
        username: myUsername,
        role: userProfile?.institution ? `${userProfile.institution} Scholar` : 'Ach1ev Scholar',
        hospitalOrCollege: userProfile?.institution || 'Ach1ev Study Hub',
        avatar: userProfile?.avatarUrl || '',
        badge: 'Ach1ever',
      },
      timeAgo: 'Just now',
      subject: currentSubject,
      content: composerContent.trim(),
      tags: [currentSubject, composerType === 'mnemonic' ? 'Mnemonic' : 'Study Note'],
      likes: 0,
      hasLiked: false,
      comments: [],
      ...(composerType === 'mnemonic' && composerAcronym.trim()
        ? {
            mnemonicData: {
              acronym: composerAcronym.trim(),
              meaning: composerContent.trim(),
              highYieldExam: 'Board Exam Recall',
            },
          }
        : {}),
    };

    setPosts((prev) => [newPost, ...prev]);
    setComposerTitle('');
    setComposerContent('');
    setComposerAcronym('');
  };

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              hasLiked: !p.hasLiked,
              likes: p.hasLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
            }
          : p
      )
    );
  };

  const handleAddComment = (postId: string) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    const newComment: PostComment = {
      id: `cmt-${Date.now()}`,
      authorName: myName,
      authorUsername: myUsername,
      text,
      timeAgo: 'Just now',
    };
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.casePoll && !p.casePoll.userVote) {
          return {
            ...p,
            casePoll: {
              ...p.casePoll,
              userVote: optionId,
              options: p.casePoll.options.map((opt) =>
                opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
              ),
              totalVotes: p.casePoll.totalVotes + 1,
            },
          };
        }
        return p;
      })
    );
  };

  const handleSnipPost = (p: CommunityPost) => {
    if (onSnipToNote) {
      onSnipToNote({
        id: `snip-comm-${Date.now()}`,
        dataUrl: '',
        sourceBookTitle: `Ach1evers Hub: ${p.title}`,
        pageNumber: 1,
        caption: `[${p.type.toUpperCase()}] ${p.title} (@${p.author.username}): ${p.content.slice(0, 180)}`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
    setSnippedId(p.id);
    setTimeout(() => setSnippedId(null), 2000);
  };

  const currentMessages = activeChatTarget ? chatMessages[activeChatTarget.id] || [] : [];

  const filteredPosts = posts.filter((p) => {
    if (feedFilter !== 'all' && p.type !== feedFilter) return false;
    if (!feedSearch.trim()) return true;
    const q = feedSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.author.name.toLowerCase().includes(q) ||
      p.author.username.toLowerCase().includes(q) ||
      String(p.subject).toLowerCase().includes(q)
    );
  });

  const filteredPeers = peers.filter((p) => {
    if (!friendSearch.trim()) return true;
    const q = friendSearch.toLowerCase().replace(/^@/, '');
    return (
      p.name.toLowerCase().includes(q) ||
      p.username.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q)
    );
  });

  return (
    <div className="themed-workspace-surface flex-1 flex flex-col h-full bg-[#f8f7f3] dark:bg-[#110c09] text-stone-900 dark:text-stone-100 overflow-hidden transition-colors">
      {/* 1. TOP ACH1EVERS HUB NAVIGATION BAR */}
      <div className="themed-glass-bar px-4 sm:px-6 py-2.5 bg-white dark:bg-[#18110c] border-b border-stone-200/80 dark:border-[#382518] shrink-0 flex flex-wrap items-center justify-between gap-2.5 shadow-2xs">
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-[#140e0a] p-1 rounded-xl border border-stone-200 dark:border-[#352317] flex-wrap">
          <button
            type="button"
            onClick={() => setActiveSection('feed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'feed'
                ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-[#110c09] shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5 text-[#A47C43]" />
            <span>Ach1evers Hub</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('friends')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'friends'
                ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-[#110c09] shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-500" />
            <span>Friends ({connectedFriends.length})</span>
            {incomingRequests.length > 0 && (
              <span className="themed-accent-btn px-1.5 py-0.2 rounded-full bg-[#A47C43] text-white text-[10px] font-bold">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('groups')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'groups'
                ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-[#110c09] shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>Study Groups ({groups.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('chat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'chat'
                ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-[#110c09] shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Chats</span>
          </button>
        </div>

        {/* Right: Current Scholar Username Badge + Quick Chat Dock */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#211711] border border-stone-200 dark:border-[#382518] text-[11px] font-mono text-stone-700 dark:text-[#d8c7b0]">
            <AtSign className="w-3 h-3 text-[#A47C43]" />
            <span>{myUsername}</span>
          </span>
          {!isFbChatOpen && (
            <button
              type="button"
              onClick={() => {
                setIsFbChatOpen(true);
                setIsFbChatMinimized(false);
              }}
              className="themed-soft-pill px-3 py-1.5 rounded-xl bg-[#A47C43]/15 hover:bg-[#A47C43]/25 text-[#784d22] dark:text-amber-300 border border-[#A47C43]/35 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#A47C43] dark:text-amber-400" />
              <span>Quick Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN SECTION CONTENT */}
      <div className="flex-1 overflow-hidden flex relative">
        {/* ========================================================================= */}
        {/* VIEW 1: ACH1EVERS HUB COMMON STUDY FEED (FB-STYLE, STUDY CENTRIC)         */}
        {/* ========================================================================= */}
        {activeSection === 'feed' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            <div className="max-w-3xl mx-auto space-y-5">
              {/* FB-Style Study Post Composer */}
              <form
                onSubmit={handleCreatePost}
                className="themed-glass-card bg-white dark:bg-[#18110c] rounded-2xl border border-stone-200/90 dark:border-[#382518] p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#A47C43]/20 text-[#784d22] dark:text-amber-300 font-bold text-sm flex items-center justify-center shrink-0 overflow-hidden border border-[#A47C43]/30">
                    {userProfile?.avatarUrl ? (
                      <img src={userProfile.avatarUrl} alt={myName} className="w-full h-full object-cover" />
                    ) : (
                      myName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <input
                    type="text"
                    value={composerTitle}
                    onChange={(e) => setComposerTitle(e.target.value)}
                    placeholder={`Topic headline (${currentSubject}) — e.g. Summary of Glycolysis Steps`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs font-semibold outline-none focus:border-[#A47C43]"
                  />
                </div>

                <textarea
                  rows={2}
                  value={composerContent}
                  onChange={(e) => setComposerContent(e.target.value)}
                  placeholder="Share study notes, explanations, memory tricks, or an exam doubt with all Ach1evers..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none focus:border-[#A47C43] resize-none"
                />

                {composerType === 'mnemonic' && (
                  <input
                    type="text"
                    value={composerAcronym}
                    onChange={(e) => setComposerAcronym(e.target.value)}
                    placeholder="Optional Acronym / Formula Hook (e.g. MUDPILES)"
                    className="w-full px-3.5 py-1.5 rounded-xl bg-purple-50/70 dark:bg-[#1f1630] border border-purple-200 dark:border-[#382654] text-xs font-mono outline-none"
                  />
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100 dark:border-[#352317]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { id: 'note', label: 'Study Note' },
                      { id: 'mnemonic', label: 'Mnemonic' },
                      { id: 'qa', label: 'Doubt / Q&A' },
                      { id: 'case', label: 'MCQ / Case' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setComposerType(t.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-all ${
                          composerType === t.id
                            ? 'themed-accent-btn bg-[#A47C43] text-white border-transparent'
                            : 'bg-stone-100 dark:bg-[#231912] text-stone-600 dark:text-stone-300 border-stone-200 dark:border-[#382518]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={!composerContent.trim() && !composerTitle.trim()}
                    className="themed-accent-btn px-4 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post to Hub</span>
                  </button>
                </div>
              </form>

              {/* Search & Filter Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={feedSearch}
                    onChange={(e) => setFeedSearch(e.target.value)}
                    placeholder="Search posts by topic, @username, or subject..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] text-xs outline-none focus:border-[#A47C43]"
                  />
                </div>
                <div className="flex items-center gap-1">
                  {(['all', 'note', 'mnemonic', 'case', 'qa'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFeedFilter(f)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize cursor-pointer ${
                        feedFilter === f
                          ? 'themed-accent-btn bg-stone-900 text-white dark:bg-[#A47C43]'
                          : 'bg-white dark:bg-[#18110c] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-[#382518]'
                      }`}
                    >
                      {f === 'all' ? 'All' : f === 'qa' ? 'Q&A' : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Feed Posts */}
              {filteredPosts.map((post) => {
                const showComments = Boolean(expandedComments[post.id]);
                return (
                  <div
                    key={post.id}
                    className="themed-glass-card bg-white dark:bg-[#18110c] rounded-2xl border border-stone-200/80 dark:border-[#382518] p-4 sm:p-5 shadow-xs space-y-3.5"
                  >
                    {/* Post Author Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-[#A47C43]/20 text-[#784d22] dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-[#A47C43]/30">
                          {post.author.avatar ? (
                            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                          ) : (
                            post.author.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-zinc-100">
                              {post.author.name}
                            </span>
                            <span className="text-[11px] font-mono text-stone-500 dark:text-[#a69079]">
                              @{post.author.username}
                            </span>
                            {post.author.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                                {post.author.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-stone-400">
                            {post.author.role} · {post.subject} · {post.timeAgo}
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-[#231912] text-stone-700 dark:text-amber-300 border border-stone-200 dark:border-[#382518] shrink-0">
                        {post.type}
                      </span>
                    </div>

                    {/* Body */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-slate-700 dark:text-zinc-300 mt-1.5 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>

                    {/* MCQ Poll if present */}
                    {post.casePoll && (
                      <div className="rounded-xl p-3.5 bg-stone-50 dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317] space-y-2.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#6e1418] dark:text-[#c94a4f] flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Practice Question Poll</span>
                          </span>
                          <span className="font-mono text-slate-400">
                            {post.casePoll.totalVotes} Responses
                          </span>
                        </div>
                        <p className="text-xs font-semibold">{post.casePoll.question}</p>
                        <div className="space-y-1.5">
                          {post.casePoll.options.map((option) => {
                            const percentage =
                              post.casePoll?.totalVotes && post.casePoll.totalVotes > 0
                                ? Math.round((option.votes / post.casePoll.totalVotes) * 100)
                                : 0;
                            const isVoted = post.casePoll?.userVote === option.id;
                            const hasVoted = Boolean(post.casePoll?.userVote);

                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => handleVotePoll(post.id, option.id)}
                                disabled={hasVoted}
                                className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium relative overflow-hidden cursor-pointer ${
                                  isVoted
                                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/35'
                                    : hasVoted && option.isCorrect
                                    ? 'border-[#A47C43] bg-amber-50/50 dark:bg-amber-950/30'
                                    : 'border-stone-200 dark:border-[#382518] bg-white dark:bg-[#211711] hover:border-amber-500/60'
                                }`}
                              >
                                {hasVoted && (
                                  <div
                                    className={`absolute left-0 top-0 bottom-0 opacity-15 ${
                                      option.isCorrect ? 'bg-[#A47C43]' : 'bg-stone-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                )}
                                <div className="flex items-center justify-between relative z-10">
                                  <span className="flex items-center gap-2">
                                    {hasVoted && option.isCorrect && (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A47C43] shrink-0" />
                                    )}
                                    {option.text}
                                  </span>
                                  {hasVoted && (
                                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-stone-400">
                                      {percentage}%
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {post.casePoll.userVote && (
                          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                            <strong>Concept Explanation:</strong> {post.casePoll.explanation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Mnemonic Hook */}
                    {post.mnemonicData && (
                      <div className="rounded-xl p-3.5 bg-purple-50/70 dark:bg-[#1f1630] border border-purple-200/80 dark:border-[#382654] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold font-mono tracking-wider text-purple-700 dark:text-purple-300">
                            {post.mnemonicData.acronym}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                            {post.mnemonicData.highYieldExam}
                          </span>
                        </div>
                        <p className="text-xs text-purple-950 dark:text-purple-100 font-mono leading-relaxed">
                          {post.mnemonicData.meaning}
                        </p>
                      </div>
                    )}

                    {/* Action Bar: Like, Comment, Snip to Note */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-[#352317] text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer ${
                            post.hasLiked
                              ? 'text-[#6e1418] dark:text-[#c94a4f] font-bold bg-[#7f1d1d]/10 dark:bg-[#6e171b]/30'
                              : 'hover:bg-stone-100 dark:hover:bg-[#231912] text-slate-600 dark:text-stone-300'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-current' : ''}`} />
                          <span>{post.likes} Helpful</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                          }
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-[#231912] text-slate-600 dark:text-stone-300 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.comments.length} Discuss</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSnipPost(post)}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-[#382518] hover:bg-stone-100 dark:hover:bg-[#231912] text-slate-700 dark:text-zinc-200 flex items-center gap-1 text-xs cursor-pointer"
                      >
                        {snippedId === post.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#A47C43]" />
                            <span className="text-[#A47C43] font-bold">Saved!</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3 h-3" />
                            <span>Save to Notes</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Inline FB-style Comments Section */}
                    {showComments && (
                      <div className="pt-2 border-t border-stone-100 dark:border-[#352317] space-y-2.5">
                        {post.comments.map((cmt) => (
                          <div
                            key={cmt.id}
                            className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#140e0a] border border-stone-200/70 dark:border-[#352317] text-xs space-y-0.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-stone-900 dark:text-stone-100">
                                {cmt.authorName}{' '}
                                <span className="font-mono font-normal text-stone-400">
                                  @{cmt.authorUsername}
                                </span>
                              </span>
                              <span className="text-[10px] text-stone-400">{cmt.timeAgo}</span>
                            </div>
                            <p className="text-stone-700 dark:text-stone-300">{cmt.text}</p>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddComment(post.id);
                              }
                            }}
                            placeholder="Write a study comment or explanation..."
                            className="flex-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none focus:border-[#A47C43]"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(post.id)}
                            className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#A47C43] text-white text-xs font-semibold cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: FRIENDS, @USERNAME SEARCH & FRIEND REQUESTS                       */}
        {/* ========================================================================= */}
        {activeSection === 'friends' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar max-w-5xl mx-auto w-full space-y-5 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                  Study Friends &amp; Peer Requests
                </h3>
                <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">
                  Search classmates by Name or <span className="font-mono font-bold">@{myUsername}</span> username handle, send friend requests, and chat live
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-500/25">
                  Your Handle: @{myUsername}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddFriendOpen((p) => !p)}
                  className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add by @username</span>
                </button>
              </div>
            </div>

            {/* Search bar by Name or @username */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
                placeholder="Search study peers by full name, @username, or subject..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] text-xs outline-none focus:border-[#A47C43] shadow-2xs"
              />
            </div>

            {isAddFriendOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPeerName.trim() && !newPeerUsername.trim()) return;
                  const cleanHandle = (newPeerUsername || newPeerName)
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, '') || `scholar_${Date.now().toString().slice(-3)}`;
                  const peer: StudyPeer = {
                    id: `peer-${Date.now()}`,
                    name: newPeerName.trim() || `@${cleanHandle}`,
                    username: cleanHandle,
                    role: 'Study Peer',
                    institution: 'Ach1ev Network',
                    specialty: newPeerSubject.trim() || currentSubject,
                    avatar: '',
                    status: 'online',
                    connectionState: 'outgoing_pending',
                    mutualGroups: 0,
                  };
                  setPeers((prev) => [peer, ...prev]);
                  setNewPeerName('');
                  setNewPeerUsername('');
                  setNewPeerSubject('');
                  setIsAddFriendOpen(false);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end"
              >
                <div>
                  <label className="block text-[10.5px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newPeerName}
                    onChange={(e) => setNewPeerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                    Username Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={newPeerUsername}
                    onChange={(e) => setNewPeerUsername(e.target.value.replace(/^@/, ''))}
                    placeholder="e.g. rohan_notes"
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-stone-600 dark:text-stone-300 mb-1">
                    Subject Focus
                  </label>
                  <input
                    type="text"
                    value={newPeerSubject}
                    onChange={(e) => setNewPeerSubject(e.target.value)}
                    placeholder={currentSubject}
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="themed-accent-btn px-4 py-1.5 rounded-lg bg-[#A47C43] text-white text-xs font-bold cursor-pointer"
                >
                  Send Request
                </button>
              </form>
            )}

            {/* Incoming Friend Requests */}
            {incomingRequests.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Incoming Friend Requests ({incomingRequests.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-700/40 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{req.name}</div>
                        <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                          @{req.username} · {req.specialty}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(req.id)}
                          className="themed-accent-btn px-3 py-1.5 rounded-lg bg-[#A47C43] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineOrRemove(req.id)}
                          className="p-1.5 rounded-lg bg-stone-200 dark:bg-[#231912] text-stone-600 dark:text-stone-300 cursor-pointer"
                          title="Decline"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Directory & Connected Friends Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPeers
                .filter((p) => p.connectionState !== 'incoming_request')
                .map((peer) => (
                  <div
                    key={peer.id}
                    className="themed-glass-card bg-white dark:bg-[#18110c] rounded-2xl border border-stone-200/80 dark:border-[#382518] p-4 flex items-center justify-between gap-3 shadow-xs hover:border-amber-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-[#A47C43]/20 text-[#784d22] dark:text-amber-300 font-bold text-sm flex items-center justify-center ring-2 ring-amber-500/25 shrink-0">
                        {peer.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-zinc-100 truncate">
                          {peer.name}
                        </h4>
                        <div className="text-[11px] font-mono text-[#A47C43] dark:text-amber-300 truncate">
                          @{peer.username}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-stone-400 truncate">
                          {peer.role} · {peer.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {peer.connectionState === 'friend' && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenChatWith(peer.id, peer.name, peer.avatar, false, peer.username)
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-[#231912] hover:bg-stone-200 dark:hover:bg-[#2f2218] text-slate-700 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeclineOrRemove(peer.id)}
                            className="p-1.5 rounded-xl bg-[#A47C43]/15 text-[#784d22] dark:text-amber-200 border border-[#A47C43]/40 cursor-pointer"
                            title="Connected (click to remove)"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {peer.connectionState === 'outgoing_pending' && (
                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(peer.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          title="Request Pending (click to mark accepted)"
                        >
                          <Clock className="w-3 h-3" />
                          <span>Requested</span>
                        </button>
                      )}

                      {peer.connectionState === 'discover' && (
                        <button
                          type="button"
                          onClick={() => handleSendFriendRequest(peer.id)}
                          className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add Friend</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: STUDY GROUPS DIRECTORY                                            */}
        {/* ========================================================================= */}
        {activeSection === 'groups' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar max-w-5xl mx-auto w-full space-y-4 relative z-10">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                  Study Groups &amp; Subject Squads
                </h3>
                <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">
                  Create study groups with friends, share flashcards, and run live group discussions
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateGroupOpen((p) => !p)}
                className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Study Group</span>
              </button>
            </div>

            {isCreateGroupOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newGroupName.trim()) return;
                  const grp: StudyGroupItem = {
                    id: `grp-${Date.now()}`,
                    name: newGroupName.trim(),
                    category: newGroupCategory.trim() || currentSubject,
                    description: newGroupDesc.trim() || 'Collaborative study group for shared notes and revision.',
                    membersCount: 1,
                    avatar: '',
                    isJoined: true,
                    lastActive: 'Just now',
                    recentTopic: currentSubject,
                  };
                  setGroups((prev) => [grp, ...prev]);
                  setNewGroupName('');
                  setNewGroupDesc('');
                  setIsCreateGroupOpen(false);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end"
              >
                <div>
                  <label className="block text-[10.5px] font-bold mb-1">Group Name</label>
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g. Pharmacology Revision"
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold mb-1">Subject</label>
                  <input
                    type="text"
                    value={newGroupCategory}
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    placeholder="Study Circle"
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold mb-1">Focus</label>
                  <input
                    type="text"
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    placeholder="Goal or exam"
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="themed-accent-btn px-4 py-1.5 rounded-lg bg-[#A47C43] text-white text-xs font-bold cursor-pointer"
                >
                  Create Group
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((grp) => (
                <div
                  key={grp.id}
                  className="themed-glass-card bg-white dark:bg-[#18110c] rounded-2xl border border-stone-200/80 dark:border-[#382518] p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs hover:border-amber-500/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#A47C43]/20 text-[#784d22] dark:text-amber-300 font-bold text-sm flex items-center justify-center ring-2 ring-amber-500/25 shrink-0">
                          {grp.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="px-2 py-0.2 rounded text-[9.5px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            {grp.category}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 dark:text-zinc-100 mt-0.5">
                            {grp.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-stone-400">
                            {grp.membersCount} Students · {grp.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                      {grp.description}
                    </p>

                    <div className="p-2 rounded-lg bg-stone-50 dark:bg-[#140e0a] border border-stone-200/60 dark:border-[#352317] text-[11px] text-slate-700 dark:text-stone-300">
                      <strong>Current Topic: </strong> {grp.recentTopic}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 dark:border-[#352317] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenChatWith(grp.id, grp.name, grp.avatar, true)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-[#231912] hover:bg-stone-200 dark:hover:bg-[#2f2218] text-slate-700 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Group Chat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleGroupJoin(grp.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        grp.isJoined
                          ? 'themed-soft-pill bg-[#A47C43]/15 text-[#784d22] dark:text-amber-200 border border-[#A47C43]/40'
                          : 'themed-accent-btn bg-[#A47C43] hover:bg-[#8e6834] text-white'
                      }`}
                    >
                      {grp.isJoined ? 'Joined' : 'Join Group'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: FULL MESSENGER (FRIENDS + STUDY GROUPS CHAT)                      */}
        {/* ========================================================================= */}
        {activeSection === 'chat' && (
          <div className="flex-1 flex h-full overflow-hidden">
            <div className="themed-glass-bar w-64 border-r border-stone-200 dark:border-[#352317] bg-white dark:bg-[#160f0b] flex flex-col h-full shrink-0">
              <div className="p-3 border-b border-stone-200/80 dark:border-[#352317] text-xs font-bold">
                Conversations
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 font-bold">
                  Study Groups
                </div>
                {groups
                  .filter((g) => g.isJoined)
                  .map((grp) => (
                    <button
                      key={grp.id}
                      type="button"
                      onClick={() => handleOpenChatWith(grp.id, grp.name, grp.avatar, true)}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer ${
                        activeChatTarget?.id === grp.id
                          ? 'bg-amber-50 dark:bg-amber-950/45 border border-amber-300/70'
                          : 'hover:bg-stone-50 dark:hover:bg-[#211711]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#A47C43]/20 text-xs font-bold flex items-center justify-center shrink-0">
                        {grp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">{grp.name}</div>
                        <div className="text-[10px] text-stone-400 truncate">{grp.recentTopic}</div>
                      </div>
                    </button>
                  ))}

                <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 pt-3 font-bold">
                  Friends
                </div>
                {connectedFriends.map((friend) => (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() =>
                      handleOpenChatWith(friend.id, friend.name, friend.avatar, false, friend.username)
                    }
                    className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer ${
                      activeChatTarget?.id === friend.id
                        ? 'bg-amber-50 dark:bg-amber-950/45 border border-amber-300/70'
                        : 'hover:bg-stone-50 dark:hover:bg-[#211711]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#A47C43]/20 text-xs font-bold flex items-center justify-center shrink-0">
                      {friend.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{friend.name}</div>
                      <div className="text-[10px] font-mono text-stone-400 truncate">@{friend.username}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-[#0e0907]">
              {!activeChatTarget ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-2">
                  <MessageSquare className="w-10 h-10 opacity-40 text-[#A47C43]" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Select a friend or study group to start messaging
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-3.5 bg-white dark:bg-[#160f0b] border-b border-stone-200 dark:border-[#352317] flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 rounded-full bg-[#A47C43] text-white font-bold text-xs flex items-center justify-center">
                      {activeChatTarget.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{activeChatTarget.name}</h3>
                      <p className="text-[10.5px] text-[#A47C43]">
                        {activeChatTarget.isGroup ? 'Study Group Chat' : `@${activeChatTarget.username || 'friend'}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                    {currentMessages.length === 0 ? (
                      <div className="text-center py-16 text-slate-400 text-xs">
                        Say hello or share study notes with {activeChatTarget.name}!
                      </div>
                    ) : (
                      currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                              msg.isMe
                                ? 'bg-[#8f6730] text-white rounded-tr-none'
                                : 'bg-white dark:bg-[#1d140f] border border-stone-200 dark:border-[#382518] rounded-tl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[9.5px] text-slate-400 mt-1">{msg.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="p-3 bg-white dark:bg-[#160f0b] border-t border-stone-200 dark:border-[#352317] flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder={`Message ${activeChatTarget.name}...`}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-[#211711] border border-stone-200 dark:border-[#382518] text-xs outline-none focus:border-[#A47C43]"
                    />
                    <button
                      type="submit"
                      className="themed-accent-btn px-4 py-2 rounded-xl bg-[#A47C43] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING FACEBOOK-STYLE BOTTOM CHAT DOCK */}
      {isFbChatOpen && activeChatTarget && (
        <div className="themed-glass-card fixed bottom-3 right-5 z-40 w-72 sm:w-80 shadow-2xl rounded-2xl bg-white dark:bg-[#18110c] border border-stone-300 dark:border-[#4b3322] overflow-hidden flex flex-col">
          <div
            onClick={() => setIsFbChatMinimized(!isFbChatMinimized)}
            className="px-3 py-2 bg-gradient-to-r from-[#231811] to-[#1a120d] text-white flex items-center justify-between cursor-pointer select-none border-b border-[#382518]"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-full bg-[#A47C43] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                {activeChatTarget.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-semibold truncate">{activeChatTarget.name}</span>
            </div>
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setIsFbChatMinimized(!isFbChatMinimized)}
                className="p-1 hover:bg-white/20 rounded text-stone-300 cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setIsFbChatOpen(false)}
                className="p-1 hover:bg-[#7f1d1d] rounded text-stone-300 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {!isFbChatMinimized && (
            <>
              <div className="p-3 h-64 overflow-y-auto custom-scrollbar space-y-2 bg-stone-50 dark:bg-[#110c09] text-xs">
                {currentMessages.length === 0 ? (
                  <div className="text-center text-stone-400 py-8">
                    Start conversation with {activeChatTarget.name}
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-1.5 rounded-2xl text-xs ${
                          msg.isMe
                            ? 'bg-[#8f6730] text-white rounded-br-xs'
                            : 'bg-white dark:bg-[#221811] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-[#382518] rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-stone-400 mt-0.5 px-1 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-2 bg-white dark:bg-[#18110c] border-t border-stone-200 dark:border-[#382518] flex items-center gap-1.5"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-stone-100 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] rounded-full px-3 py-1.5 text-xs outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="themed-accent-btn p-1.5 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
