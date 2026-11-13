import React, { useState } from 'react';
import { SubjectCourse, SnippetScreenshot } from '../../types';
import {
  Users,
  MessageSquare,
  Sparkles,
  Heart,
  Share2,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  Filter,
  Search,
  Plus,
  Send,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Brain,
  ThumbsUp,
  Clock,
  Eye,
  Check,
  X,
  Minus,
  UserPlus,
  UserCheck,
  Circle,
  Coffee,
  Smile,
  Paperclip,
  PhoneCall,
  Video,
  MoreVertical,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

export interface MedicalFriend {
  id: string;
  name: string;
  role: string;
  institution: string;
  specialty: string;
  avatar: string;
  status: 'online' | 'on-call' | 'in-library' | 'offline';
  isFriend: boolean;
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

export interface MedicalGroupItem {
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

export interface CommunityPost {
  id: string;
  type: 'case' | 'mnemonic' | 'group' | 'qa';
  title: string;
  author: {
    name: string;
    role: string;
    hospitalOrCollege: string;
    avatar: string;
    badge?: string;
  };
  timeAgo: string;
  subject: SubjectCourse;
  content: string;
  tags: string[];
  likes: number;
  commentsCount: number;
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
    highYieldExam: 'USMLE Step 1' | 'USMLE Step 2' | 'NEET PG' | 'NEXT / PLAB';
  };
  groupData?: {
    membersCount: number;
    meetingTime: string;
    isJoined?: boolean;
  };
}

const INITIAL_FRIENDS: MedicalFriend[] = [];

const INITIAL_GROUPS: MedicalGroupItem[] = [];

const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {};

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [];

interface StudyRoom {
  id: string;
  name: string;
  topic: string;
  host: string;
  members: number;
  maxMembers: number;
  timeRemainingMinutes: number;
  tags: string[];
}

const INITIAL_STUDY_ROOMS: StudyRoom[] = [];

interface CommunityViewProps {
  currentSubject: SubjectCourse;
  onSnipToNote?: (snippet: SnippetScreenshot) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ currentSubject, onSnipToNote }) => {
  // 2 Primary Compartments: 'friends' | 'groups' (Peer Study Lounge removed)
  const [activeSection, setActiveSection] = useState<'friends' | 'groups' | 'chat' | 'feed'>('friends');
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>(INITIAL_STUDY_ROOMS);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Facebook-style Bottom Corner Chat Window state
  const [isFbChatOpen, setIsFbChatOpen] = useState<boolean>(false);
  const [isFbChatMinimized, setIsFbChatMinimized] = useState<boolean>(false);

  // Friends & Groups state
  const [friends, setFriends] = useState<MedicalFriend[]>(INITIAL_FRIENDS);
  const [groups, setGroups] = useState<MedicalGroupItem[]>(INITIAL_GROUPS);

  // Quick creators for empty user-driven format
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendRole, setNewFriendRole] = useState('');
  const [newFriendSpecialty, setNewFriendSpecialty] = useState('');
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Study Circle');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Live Chat state (starts null when community is empty)
  const [activeChatTarget, setActiveChatTarget] = useState<{ id: string; name: string; avatar: string; isGroup?: boolean } | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [messageInput, setMessageInput] = useState('');

  // Feed state
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'case' | 'mnemonic' | 'group' | 'qa'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [snippedId, setSnippedId] = useState<string | null>(null);

  // New Post Modal
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostType, setNewPostType] = useState<'case' | 'mnemonic' | 'qa' | 'group'>('mnemonic');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('Pharmacology, High-Yield');
  const [newPostAcronym, setNewPostAcronym] = useState('');

  // Toggle Friend
  const handleToggleFriend = (friendId: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === friendId ? { ...f, isFriend: !f.isFriend } : f))
    );
  };

  // Toggle Group Join
  const handleToggleGroupJoin = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              isJoined: !g.isJoined,
              membersCount: g.isJoined ? g.membersCount - 1 : g.membersCount + 1,
            }
          : g
      )
    );
  };

  // Open Chat with a friend or group (opens Facebook-style bottom dock)
  const handleOpenChatWith = (id: string, name: string, avatar: string, isGroup = false) => {
    setActiveChatTarget({ id, name, avatar, isGroup });
    setIsFbChatOpen(true);
    setIsFbChatMinimized(false);
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatTarget) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      senderAvatar: '',
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

  // Like feed post
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked,
            likes: hasLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  // Poll vote
  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.casePoll && !p.casePoll.userVote) {
          const updatedOptions = p.casePoll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...p,
            casePoll: {
              ...p.casePoll,
              userVote: optionId,
              options: updatedOptions,
              totalVotes: p.casePoll.totalVotes + 1,
            },
          };
        }
        return p;
      })
    );
  };

  // Snip post to note
  const handleSnipPost = (p: CommunityPost) => {
    if (onSnipToNote) {
      onSnipToNote({
        id: `snip-comm-${Date.now()}`,
        dataUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
        sourceBookTitle: `Community: ${p.title}`,
        pageNumber: 1,
        caption: `[${p.type.toUpperCase()}] ${p.title} - Shared by ${p.author.name}: ${p.content.slice(0, 160)}...`,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
    setSnippedId(p.id);
    setTimeout(() => setSnippedId(null), 2000);
  };

  const currentMessages = activeChatTarget ? chatMessages[activeChatTarget.id] || [] : [];

  return (
    <div className="themed-workspace-surface flex-1 flex flex-col h-full bg-[#f8f7f3] dark:bg-[#110c09] text-stone-900 dark:text-stone-100 overflow-hidden transition-colors">
      {/* 1. TOP COMMUNITY NAVIGATION BAR (Friends & Groups) */}
      <div className="themed-glass-bar px-4 sm:px-6 py-2.5 bg-white dark:bg-[#18110c] border-b border-stone-200/80 dark:border-[#382518] shrink-0 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-[#140e0a] p-1 rounded-xl border border-stone-200 dark:border-[#352317]">
          <button
            onClick={() => setActiveSection('friends')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'friends'
                ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-500" />
            <span>Friends ({friends.filter((f) => f.isFriend).length})</span>
          </button>

          <button
            onClick={() => setActiveSection('groups')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSection === 'groups'
                ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>Groups ({groups.length})</span>
          </button>
        </div>

        {/* Right: Toggle Floating Chat Dock */}
        <div className="flex items-center gap-2">
          {!isFbChatOpen && (
            <button
              onClick={() => {
                setIsFbChatOpen(true);
                setIsFbChatMinimized(false);
              }}
              className="themed-soft-pill px-3 py-1.5 rounded-xl bg-[#A47C43]/15 hover:bg-[#A47C43]/25 text-[#784d22] dark:text-amber-300 border border-[#A47C43]/35 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#A47C43] dark:text-amber-400" />
              <span>Open Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN SECTION CONTENT */}
      <div className="flex-1 overflow-hidden flex relative">
        {/* Ambient Group Study Students Watermark in empty area */}
        {((activeSection === 'friends' && friends.length === 0) ||
          (activeSection === 'groups' && groups.length === 0)) && (
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-x-0 bottom-4 top-28 flex items-center justify-center overflow-hidden z-0"
          >
            <svg
              viewBox="0 0 640 340"
              className="w-[min(560px,86vw)] h-auto text-[#7c4d25] dark:text-[#d4a36a] opacity-[0.14] dark:opacity-[0.15]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Warm study glow halo */}
              <ellipse cx="320" cy="185" rx="220" ry="110" fill="currentColor" opacity="0.16" />
              {/* Overhead desk lamp */}
              <path d="M320 26 V68" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M286 68 H354 L366 90 H274 L286 68 Z" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.14" strokeLinejoin="round" />
              <path d="M276 92 L220 198 H420 L364 92" fill="currentColor" opacity="0.08" />

              {/* Left Student sitting & writing */}
              <circle cx="152" cy="138" r="22" stroke="currentColor" strokeWidth="3.2" fill="currentColor" fillOpacity="0.09" />
              <path d="M132 132 C136 116 168 116 172 134" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M116 202 C118 176 134 166 152 166 C170 166 186 176 192 202" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="currentColor" fillOpacity="0.07" />
              <path d="M168 182 L212 204" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

              {/* Center Student discussing over open textbook */}
              <circle cx="320" cy="126" r="23" stroke="currentColor" strokeWidth="3.2" fill="currentColor" fillOpacity="0.09" />
              <path d="M298 122 C302 103 338 103 342 122" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M280 198 C284 170 300 158 320 158 C340 158 356 170 360 198" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="currentColor" fillOpacity="0.07" />
              <path d="M294 178 L272 204 M346 178 L368 204" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />

              {/* Right Student taking notes / tablet */}
              <circle cx="486" cy="140" r="22" stroke="currentColor" strokeWidth="3.2" fill="currentColor" fillOpacity="0.09" />
              <path d="M466 135 C470 116 502 118 506 136" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M446 202 C450 176 468 166 486 166 C504 166 522 176 524 202" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="currentColor" fillOpacity="0.07" />
              <path d="M464 184 L424 204" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

              {/* Shared Group Study Table */}
              <rect x="86" y="204" width="468" height="16" rx="8" stroke="currentColor" strokeWidth="3.2" fill="currentColor" fillOpacity="0.16" />
              <path d="M126 220 V296 M514 220 V296 M160 220 V284 M480 220 V284" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />

              {/* Open books, notebook, coffee mug & stethoscope on table */}
              <path d="M196 204 L212 184 L244 190 L228 204" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.12" strokeLinejoin="round" />
              <path d="M284 204 C298 192 310 192 320 202 C330 192 342 192 356 204" stroke="currentColor" strokeWidth="2.6" fill="currentColor" fillOpacity="0.12" strokeLinejoin="round" />
              <rect x="386" y="191" width="52" height="13" rx="3" stroke="currentColor" strokeWidth="2.4" fill="currentColor" fillOpacity="0.12" />
              <rect x="456" y="182" width="18" height="22" rx="3" stroke="currentColor" strokeWidth="2.4" />
              <path d="M474 187 C481 187 481 198 474 198" stroke="currentColor" strokeWidth="2.2" />

              {/* Subtle floating thought/idea sparkles */}
              <circle cx="242" cy="112" r="3" fill="currentColor" opacity="0.55" />
              <circle cx="396" cy="108" r="3" fill="currentColor" opacity="0.55" />
              <path d="M236 86 Q268 72 288 86" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4 4" strokeLinecap="round" opacity="0.55" />
              <path d="M352 86 Q378 72 404 88" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4 4" strokeLinecap="round" opacity="0.55" />
            </svg>
          </div>
        )}
        {/* ========================================================================= */}
        {/* VIEW A: LIVE CHAT MESSENGER (DIRECT & GROUP)                              */}
        {/* ========================================================================= */}
        {activeSection === 'chat' && (
          <div className="flex-1 flex h-full overflow-hidden">
            {/* Left Chat Contacts / Conversations List */}
            <div className="themed-glass-bar w-64 border-r border-stone-200 dark:border-[#352317] bg-white dark:bg-[#160f0b] flex flex-col h-full shrink-0">
              <div className="p-3 border-b border-stone-200/80 dark:border-[#352317]">
                <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 mb-2">
                  Conversations
                </div>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search peers or groups..."
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-[#211711] border border-stone-200 dark:border-[#382518] text-xs text-slate-900 dark:text-zinc-100 outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                {/* Active Study Groups */}
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 font-bold">
                  Study Groups
                </div>
                {groups
                  .filter((g) => g.isJoined)
                  .map((grp) => {
                    const isSelected = activeChatTarget?.id === grp.id;
                    return (
                      <button
                        key={grp.id}
                        onClick={() => handleOpenChatWith(grp.id, grp.name, grp.avatar, true)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'themed-soft-pill bg-amber-50 dark:bg-amber-950/45 border border-amber-300/70 dark:border-amber-700/50'
                            : 'hover:bg-stone-50 dark:hover:bg-[#211711]'
                        }`}
                      >
                        <img
                          src={grp.avatar}
                          alt={grp.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-stone-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                              {grp.name}
                            </h4>
                            {grp.unreadCount && (
                              <span className="themed-accent-btn w-4 h-4 rounded-full bg-[#A47C43] text-white font-mono text-[9px] flex items-center justify-center font-bold">
                                {grp.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-[10.5px] text-slate-500 dark:text-stone-400 truncate">
                            {grp.recentTopic}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                {/* Direct Medical Friends */}
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1 pt-3 font-bold">
                  Direct Messages
                </div>
                {friends.map((friend) => {
                  const isSelected = activeChatTarget?.id === friend.id;
                  return (
                    <button
                      key={friend.id}
                      onClick={() => handleOpenChatWith(friend.id, friend.name, friend.avatar, false)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'themed-soft-pill bg-amber-50 dark:bg-amber-950/45 border border-amber-300/70 dark:border-amber-700/50'
                          : 'hover:bg-stone-50 dark:hover:bg-[#211711]'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#160f0b] ${
                            friend.status === 'online'
                              ? 'bg-[#A47C43]'
                              : friend.status === 'on-call'
                              ? 'bg-amber-500'
                              : friend.status === 'in-library'
                              ? 'bg-sky-500'
                              : 'bg-stone-400'
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                            {friend.name}
                          </h4>
                          <span className="text-[9.5px] font-mono text-slate-400">
                            {friend.status === 'online' ? 'Active' : friend.status}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 dark:text-stone-400 truncate">
                          {friend.role}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Chat Conversation Viewport */}
            <div className="themed-workspace-surface flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-[#0e0907]">
              {!activeChatTarget ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-stone-400 space-y-2">
                  <MessageSquare className="w-10 h-10 opacity-40 text-[#A47C43]" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">No active conversation</p>
                  <p className="text-[11px] max-w-xs">Add a peer or study circle first to start messaging.</p>
                </div>
              ) : (
              <>
              {/* Chat Header */}
              <div className="themed-glass-bar p-3.5 bg-white dark:bg-[#160f0b] border-b border-stone-200 dark:border-[#352317] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={activeChatTarget.avatar}
                    alt={activeChatTarget.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#A47C43]/35"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>{activeChatTarget.name}</span>
                      {activeChatTarget.isGroup && (
                        <span className="themed-soft-pill px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                          Group
                        </span>
                      )}
                    </h3>
                    <p className="text-[10.5px] text-[#A47C43] dark:text-amber-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A47C43] animate-pulse" />
                      <span>Encrypted Clinical Chat · Online</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <button className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-[#231912] transition-colors" title="Voice consultation">
                    <PhoneCall className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-[#231912] transition-colors" title="Clinical case video share">
                    <Video className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Flow */}
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                {currentMessages.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 space-y-1">
                    <MessageSquare className="w-10 h-10 mx-auto text-slate-300 dark:text-stone-600 mb-2" />
                    <p className="text-xs font-semibold">No messages yet with {activeChatTarget.name}</p>
                    <p className="text-[11px] text-slate-500">Say hello or share a clinical case question!</p>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 max-w-xl ${
                        msg.isMe ? 'ml-auto flex-row-reverse' : ''
                      }`}
                    >
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className={`space-y-1 ${msg.isMe ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-zinc-300">
                            {msg.senderName}
                          </span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            msg.isMe
                              ? 'bg-[#8f6730] text-white rounded-tr-none shadow-xs'
                              : 'bg-white dark:bg-[#1d140f] text-slate-800 dark:text-zinc-100 border border-stone-200 dark:border-[#382518] rounded-tl-none shadow-2xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="themed-glass-bar p-3 bg-white dark:bg-[#160f0b] border-t border-stone-200 dark:border-[#352317] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message ${activeChatTarget.name}...`}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-[#211711] border border-stone-200 dark:border-[#382518] text-xs text-slate-900 dark:text-zinc-100 outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="themed-accent-btn px-4 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
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

        {/* ========================================================================= */}
        {/* VIEW B: FRIENDS & MEDICAL PEERS DIRECTORY                                  */}
        {/* ========================================================================= */}
        {activeSection === 'friends' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar max-w-5xl mx-auto w-full space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                  Medical Friends & Colleagues
                </h3>
                <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">
                  Connect with residents, classmates, and verified medical fellows worldwide
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-500/25">
                  {friends.filter((f) => f.isFriend).length} Connected
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddFriendOpen((p) => !p)}
                  className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Peer</span>
                </button>
              </div>
            </div>

            {isAddFriendOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newFriendName.trim()) return;
                  const peer: MedicalFriend = {
                    id: `peer-${Date.now()}`,
                    name: newFriendName.trim(),
                    role: newFriendRole.trim() || 'Study Peer',
                    institution: 'Ach1ev Workspace',
                    specialty: newFriendSpecialty.trim() || currentSubject,
                    avatar: '',
                    status: 'online',
                    isFriend: true,
                    mutualGroups: 0,
                  };
                  setFriends((prev) => [peer, ...prev]);
                  setNewFriendName('');
                  setNewFriendRole('');
                  setNewFriendSpecialty('');
                  setIsAddFriendOpen(false);
                }}
                className="p-4 rounded-2xl bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end"
              >
                <div>
                  <label className="block text-[10.5px] font-bold text-stone-600 dark:text-stone-300 mb-1">Peer Name</label>
                  <input type="text" required value={newFriendName} onChange={(e) => setNewFriendName(e.target.value)} placeholder="Name" className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-stone-600 dark:text-stone-300 mb-1">Role / Year</label>
                  <input type="text" value={newFriendRole} onChange={(e) => setNewFriendRole(e.target.value)} placeholder="e.g. MS-3" className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-stone-600 dark:text-stone-300 mb-1">Subject</label>
                  <input type="text" value={newFriendSpecialty} onChange={(e) => setNewFriendSpecialty(e.target.value)} placeholder={currentSubject} className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none" />
                </div>
                <button type="submit" className="themed-accent-btn px-4 py-1.5 rounded-lg bg-[#A47C43] text-white text-xs font-bold cursor-pointer">
                  Connect
                </button>
              </form>
            )}

            {friends.length === 0 && (
              <div className="p-10 rounded-2xl border border-dashed border-stone-300 dark:border-[#382518] bg-white/60 dark:bg-[#18110c]/60 text-center space-y-2.5">
                <Users className="w-8 h-8 mx-auto text-[#A47C43]/70" />
                <p className="text-sm font-serif font-bold text-stone-800 dark:text-stone-200">No connected peers yet</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                  Add classmates or medical fellows when you collaborate — your connected peers and chat triggers will display here.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="themed-glass-card bg-white dark:bg-[#18110c] rounded-2xl border border-stone-200/80 dark:border-[#382518] p-4 flex items-center justify-between gap-3 shadow-xs hover:border-amber-500/40 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      {friend.avatar ? (
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#A47C43]/20 text-[#784d22] dark:text-amber-300 font-bold text-sm flex items-center justify-center ring-2 ring-amber-500/25">
                          {friend.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-[#18110c] ${
                          friend.status === 'online'
                            ? 'bg-[#A47C43]'
                            : friend.status === 'on-call'
                            ? 'bg-amber-500'
                            : friend.status === 'in-library'
                            ? 'bg-sky-500'
                            : 'bg-stone-400'
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-zinc-100 truncate">
                        {friend.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-stone-400 truncate">
                        {friend.role} · {friend.institution}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.2 rounded text-[9.5px] font-mono font-medium bg-stone-100 dark:bg-[#231912] text-amber-700 dark:text-amber-300 border border-stone-200 dark:border-[#382518]">
                          {friend.specialty}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {friend.mutualGroups} mutual circles
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenChatWith(friend.id, friend.name, friend.avatar, false)}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-[#231912] hover:bg-stone-200 dark:hover:bg-[#2f2218] text-slate-700 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => handleToggleFriend(friend.id)}
                      className={`p-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                        friend.isFriend
                          ? 'bg-[#A47C43]/15 dark:bg-[#A47C43]/25 text-[#784d22] dark:text-amber-200 border border-[#A47C43]/40'
                          : 'themed-accent-btn bg-[#A47C43] text-white hover:bg-[#8e6834]'
                      }`}
                      title={friend.isFriend ? 'Connected' : 'Add Friend'}
                    >
                      {friend.isFriend ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW C: STUDY GROUPS DIRECTORY                                            */}
        {/* ========================================================================= */}
        {activeSection === 'groups' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar max-w-5xl mx-auto w-full space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                  Medical Study Circles & Ward Cohorts
                </h3>
                <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5">
                  Collaborative groups sharing ECGs, pharmacology mnemonics, and live study schedules
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateGroupOpen((p) => !p)}
                className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Group</span>
              </button>
            </div>

            {isCreateGroupOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newGroupName.trim()) return;
                  const grp: MedicalGroupItem = {
                    id: `grp-${Date.now()}`,
                    name: newGroupName.trim(),
                    category: newGroupCategory.trim() || currentSubject,
                    description: newGroupDesc.trim() || 'Collaborative study group for shared cases and notes.',
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
                  <label className="block text-[10.5px] font-bold text-stone-600 dark:text-stone-300 mb-1">Group Name</label>
                  <input type="text" required value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="e.g. Pharmacology Revision" className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-stone-600 dark:text-stone-300 mb-1">Category</label>
                  <input type="text" value={newGroupCategory} onChange={(e) => setNewGroupCategory(e.target.value)} placeholder="Study Circle" className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-[10.5px] font-bold text-stone-600 dark:text-stone-300 mb-1">Focus</label>
                  <input type="text" value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} placeholder="Topic or exam goal" className="w-full px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] text-xs outline-none" />
                </div>
                <button type="submit" className="themed-accent-btn px-4 py-1.5 rounded-lg bg-[#A47C43] text-white text-xs font-bold cursor-pointer">
                  Create Circle
                </button>
              </form>
            )}

            {groups.length === 0 && (
              <div className="p-10 rounded-2xl border border-dashed border-stone-300 dark:border-[#382518] bg-white/60 dark:bg-[#18110c]/60 text-center space-y-2.5">
                <GraduationCap className="w-8 h-8 mx-auto text-[#A47C43]/70" />
                <p className="text-sm font-serif font-bold text-stone-800 dark:text-stone-200">No study circles created yet</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                  Start your own medical study circle using Create Group above — group cards and chats will appear in this grid.
                </p>
              </div>
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
                        {grp.avatar ? (
                          <img
                            src={grp.avatar}
                            alt={grp.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-500/20 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-[#A47C43]/20 text-[#784d22] dark:text-amber-300 font-bold text-sm flex items-center justify-center ring-2 ring-amber-500/25 shrink-0">
                            {grp.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="px-2 py-0.2 rounded text-[9.5px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            {grp.category}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 dark:text-zinc-100 mt-0.5">
                            {grp.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {grp.membersCount} Medical Students Enrolled
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                      {grp.description}
                    </p>

                    <div className="p-2 rounded-lg bg-stone-50 dark:bg-[#140e0a] border border-stone-200/60 dark:border-[#352317] text-[11px] text-slate-700 dark:text-stone-300">
                      <strong>Recent Topic: </strong> {grp.recentTopic}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 dark:border-[#352317] flex items-center justify-between">
                    <button
                      onClick={() => handleOpenChatWith(grp.id, grp.name, grp.avatar, true)}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-[#231912] hover:bg-stone-200 dark:hover:bg-[#2f2218] text-slate-700 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Group Chat</span>
                    </button>

                    <button
                      onClick={() => handleToggleGroupJoin(grp.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                        grp.isJoined
                          ? 'themed-soft-pill bg-[#A47C43]/15 text-[#784d22] dark:text-amber-200 border border-[#A47C43]/40 shadow-xs'
                          : 'themed-accent-btn bg-[#A47C43] hover:bg-[#8e6834] text-white shadow-xs'
                      }`}
                    >
                      {grp.isJoined ? '✓ Joined Circle' : 'Join Circle'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW D: WARD FEED & GRAND ROUNDS CASES (ORIGINAL ENGAGING FEED)           */}
        {/* ========================================================================= */}
        {activeSection === 'feed' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-4 max-w-5xl mx-auto w-full">
            {posts.map((post) => (
              <div
                key={post.id}
                className="themed-glass-card bg-white dark:bg-[#18110c] rounded-2xl border border-stone-200/80 dark:border-[#382518] p-4 sm:p-5 shadow-xs hover:border-amber-500/40 transition-all space-y-3.5"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-zinc-100 truncate">
                          {post.author.name}
                        </span>
                        {post.author.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shrink-0">
                            {post.author.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-stone-400 truncate">
                        {post.author.role} · {post.author.hospitalOrCollege}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        post.type === 'case'
                          ? 'bg-[#7f1d1d]/12 dark:bg-[#6e171b]/35 text-[#6e1418] dark:text-[#d97074] border border-[#7f1d1d]/25 dark:border-[#962d32]/50'
                          : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      }`}
                    >
                      {post.type === 'case' ? 'Grand Rounds' : post.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{post.timeAgo}</span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-700 dark:text-zinc-300 mt-1.5 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Case Poll */}
                {post.casePoll && (
                  <div className="rounded-xl p-3.5 bg-stone-50 dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#6e1418] dark:text-[#c94a4f] flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5" />
                        Differential Diagnosis & Action Poll
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {post.casePoll.totalVotes} Doctors Voted
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                      {post.casePoll.question}
                    </p>

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
                            onClick={() => handleVotePoll(post.id, option.id)}
                            disabled={hasVoted}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium relative overflow-hidden transition-all ${
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
                              <span className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
                                {hasVoted && option.isCorrect && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A47C43] shrink-0" />
                                )}
                                {option.text}
                              </span>
                              {hasVoted && (
                                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-stone-400 shrink-0">
                                  {percentage}%
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {post.casePoll.userVote && (
                      <div className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                        <strong>Clinical Reasoning:</strong> {post.casePoll.explanation}
                      </div>
                    )}
                  </div>
                )}

                {/* Mnemonic Data */}
                {post.mnemonicData && (
                  <div className="rounded-xl p-3.5 bg-purple-50/70 dark:bg-[#1f1630] border border-purple-200/80 dark:border-[#382654] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-mono tracking-wider text-purple-700 dark:text-purple-300">
                        ⚡ {post.mnemonicData.acronym}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                        Target: {post.mnemonicData.highYieldExam}
                      </span>
                    </div>
                    <p className="text-xs text-purple-950 dark:text-purple-100 font-mono leading-relaxed">
                      {post.mnemonicData.meaning}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-[#352317] text-xs text-slate-500 dark:text-stone-400">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      post.hasLiked
                        ? 'text-[#6e1418] dark:text-[#c94a4f] font-bold bg-[#7f1d1d]/10 dark:bg-[#6e171b]/30'
                        : 'hover:bg-stone-100 dark:hover:bg-[#231912] text-slate-600 dark:text-stone-300'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-[#7f1d1d] text-[#7f1d1d] dark:fill-[#c94a4f] dark:text-[#c94a4f]' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSnipPost(post)}
                      className="px-2.5 py-1 rounded-lg border border-stone-200 dark:border-[#382518] hover:bg-stone-100 dark:hover:bg-[#231912] text-slate-700 dark:text-zinc-200 transition-all flex items-center gap-1 text-xs"
                    >
                      {snippedId === post.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#A47C43]" />
                          <span className="text-[#A47C43] font-bold">Snipped!</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3 h-3" />
                          <span>Snip to Note</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. NEW POST / GROUP MODAL */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="themed-glass-card bg-white dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="themed-glass-bar px-5 py-4 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xl text-slate-900 dark:text-zinc-100">
                  Share with Medical Community
                </h3>
              </div>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-[#231912] text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPostTitle.trim()) return;
                const newPost: CommunityPost = {
                  id: `post-${Date.now()}`,
                  type: newPostType,
                  title: newPostTitle.trim(),
                  author: {
                    name: 'User',
                    role: 'Member',
                    hospitalOrCollege: 'Ach1ev Workspace',
                    avatar: '',
                    badge: 'Member',
                  },
                  timeAgo: 'Just now',
                  subject: currentSubject,
                  content: newPostContent.trim(),
                  tags: newPostTags.split(',').map((t) => t.trim()).filter(Boolean),
                  likes: 1,
                  commentsCount: 0,
                  hasLiked: true,
                };
                setPosts([newPost, ...posts]);
                setIsNewPostModalOpen(false);
                setNewPostTitle('');
                setNewPostContent('');
              }}
              className="p-5 overflow-y-auto space-y-4 text-xs"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'case', label: '🩺 Clinical Case' },
                    { id: 'mnemonic', label: '⚡ Mnemonic Pearl' },
                    { id: 'qa', label: '❓ Board Q&A' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setNewPostType(t.id as any)}
                      className={`p-2 rounded-xl text-center font-semibold border ${
                        newPostType === t.id
                          ? 'bg-[#A47C43] text-white border-[#A47C43]'
                          : 'bg-stone-50 dark:bg-[#120c08] text-slate-700 dark:text-zinc-300 border-stone-200 dark:border-[#382518]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. ECG Case: Wellens Type A Biphasic T-waves in V2-V3"
                  className="w-full px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#382518] text-slate-900 dark:text-zinc-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">
                  Details / Clinical Presentation
                </label>
                <textarea
                  rows={4}
                  required
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Describe patient findings, lab values, or memory breakdown..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#382518] text-slate-900 dark:text-zinc-100 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-[#382518] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-slate-600 dark:text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="themed-accent-btn px-4 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white font-semibold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. FACEBOOK-STYLE FLOATING BOTTOM-CORNER CHAT WINDOW DOCK */}
      {isFbChatOpen && activeChatTarget && (
        <div className="themed-glass-card fixed bottom-3 right-5 z-40 w-72 sm:w-80 shadow-2xl rounded-2xl bg-white dark:bg-[#18110c] border border-stone-300 dark:border-[#4b3322] overflow-hidden flex flex-col transition-all duration-200">
          {/* FB Chat Titlebar */}
          <div
            onClick={() => setIsFbChatMinimized(!isFbChatMinimized)}
            className="px-3 py-2 bg-gradient-to-r from-[#231811] to-[#1a120d] text-white flex items-center justify-between cursor-pointer select-none border-b border-[#382518]"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="relative">
                {activeChatTarget.avatar ? (
                  <img
                    src={activeChatTarget.avatar}
                    alt={activeChatTarget.name}
                    className="w-6 h-6 rounded-full object-cover border border-white/30"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#A47C43] text-white text-[10px] font-bold flex items-center justify-center border border-white/30">
                    {activeChatTarget.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute -bottom-0.5 -right-0.5 ring-1 ring-stone-900" />
              </div>
              <span className="text-xs font-semibold truncate">{activeChatTarget.name}</span>
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsFbChatMinimized(!isFbChatMinimized)}
                className="p-1 hover:bg-white/20 rounded text-stone-300 hover:text-white transition-colors cursor-pointer"
                title={isFbChatMinimized ? 'Maximize' : 'Minimize'}
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsFbChatOpen(false)}
                className="p-1 hover:bg-[#7f1d1d] rounded text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* FB Chat Body (when not minimized) */}
          {!isFbChatMinimized && (
            <>
              {/* Message History */}
              <div className="p-3 h-64 overflow-y-auto custom-scrollbar space-y-2 bg-stone-50 dark:bg-[#110c09] text-xs">
                {currentMessages.length === 0 ? (
                  <div className="text-center text-stone-400 py-8">
                    <p>Start conversation with {activeChatTarget.name}</p>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-1.5 rounded-2xl text-xs leading-relaxed ${
                          msg.isMe
                            ? 'bg-[#8f6730] text-white rounded-br-xs'
                            : 'bg-white dark:bg-[#221811] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-[#382518] rounded-bl-xs shadow-2xs'
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

              {/* Quick Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-2 bg-white dark:bg-[#18110c] border-t border-stone-200 dark:border-[#382518] flex items-center gap-1.5"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-stone-100 dark:bg-[#110c09] border border-stone-200 dark:border-[#382518] rounded-full px-3 py-1.5 text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="themed-accent-btn p-1.5 rounded-full bg-[#A47C43] hover:bg-[#8e6834] text-white disabled:opacity-40 transition-all cursor-pointer"
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
