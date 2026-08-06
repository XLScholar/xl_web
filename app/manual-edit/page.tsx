'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import profileData from '@/data/profile.json';
import chipGalleryData from '@/data/chip-gallery.json';
import photoGalleryData from '@/data/photo-gallery.json';
import researchData from '@/data/research.json';
import tagsData from '@/data/tags.json';

type ImgSlot = {
  id: string;
  kind: 'portrait' | 'chip' | 'photo';
  label: string;
  savePath: string;
  currentSrc: string;
  title: string;
  subtitle: string;
  caption: string;
  preview?: string;
  fileName?: string;
};

function chipSavePath(id: string, src: string) {
  if (src) {
    const base = src.split('/').pop() || `${id}.png`;
    const stem = base.replace(/\.(jpg|jpeg|png|webp|jfif)$/i, '');
    const extMatch = base.match(/\.(jpg|jpeg|png|webp|jfif)$/i);
    const ext = extMatch ? extMatch[0] : '.png';
    return `source/chip_gallery/originals/${stem}${ext}`;
  }
  return `source/chip_gallery/originals/${id}.png`;
}

function buildSlots(): ImgSlot[] {
  const chips = chipGalleryData.map((c) => ({
    id: `chip-${c.id}`,
    kind: 'chip' as const,
    label: `Chip — ${c.title || c.id}`,
    savePath: chipSavePath(c.id, c.src || ''),
    currentSrc: c.src || '',
    title: c.title,
    subtitle: c.subtitle || '',
    caption: c.caption || '',
  }));

  const photos = photoGalleryData.map((p) => ({
    id: `photo-${p.id}`,
    kind: 'photo' as const,
    label: `Photo — ${p.title || p.id}`,
    savePath:
      p.src === '/portrait.jpg'
        ? 'public/portrait.jpg'
        : `source/photo_gallery/originals/${p.id}.jpg`,
    currentSrc: p.src || '',
    title: p.title,
    subtitle: p.location || '',
    caption: p.caption || '',
  }));

  const photoOnly = photos.filter((p) => !p.savePath.includes('portrait.jpg'));
  while (photoOnly.length < 7) {
    const n = photoOnly.length + 1;
    const id = `photo-${String(n).padStart(2, '0')}`;
    photoOnly.push({
      id: `photo-${id}`,
      kind: 'photo',
      label: `Photo — empty slot ${n}`,
      savePath: `source/photo_gallery/originals/${id}.jpg`,
      currentSrc: '',
      title: `Photo ${String(n).padStart(2, '0')}`,
      subtitle: '',
      caption: 'Edit caption',
    });
  }

  return [
    {
      id: 'portrait',
      kind: 'portrait',
      label: '① Hero Portrait',
      savePath: 'public/portrait.jpg',
      currentSrc: profileData.portrait || '/portrait.jpg',
      title: 'Portrait',
      subtitle: '',
      caption: profileData.name,
    },
    ...chips,
    ...photoOnly,
  ];
}

const editBox =
  'outline-dashed outline-1 outline-[#1a508b]/35 rounded px-2 py-1 focus:outline-[#0f3460] focus:bg-[#f7fbff] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400';

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-10 -mx-4 mb-4 px-4 py-2 bg-[#0f3460] text-white text-sm font-semibold tracking-wide">
      {children}
    </div>
  );
}

function PathHint({ path }: { path: string }) {
  return (
    <code className="block mt-1 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1 break-all">
      保存图片到 → {path}
    </code>
  );
}

function parseNameTitle(raw: string) {
  const parts = raw.split(',').map((s) => s.trim());
  return { name: parts[0] || profileData.name, title: parts[1] || profileData.title };
}

function parseRoleAffiliation(raw: string) {
  const sep = raw.includes('—') ? '—' : '-';
  const parts = raw.split(sep).map((s) => s.trim());
  return { role: parts[0] || profileData.role, affiliation: parts.slice(1).join(sep + ' ') || profileData.affiliation };
}

export default function ManualEditPage() {
  const [slots, setSlots] = useState<ImgSlot[]>(() => buildSlots());
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [textDraft, setTextDraft] = useState({
    name: `${profileData.name}, ${profileData.title}`,
    role: `${profileData.role} — ${profileData.affiliation}`,
    tagline: profileData.tagline,
    about: profileData.about,
    postdocSummary: profileData.postdocSummary,
    researchMainline: profileData.researchMainline,
    email: profileData.email,
    phone: profileData.phone,
    office: profileData.office,
    openTo: profileData.openTo,
    achievements: profileData.achievements.join('\n'),
  });
  const [researchDraft, setResearchDraft] = useState(
    researchData.map((r) => ({
      id: r.id,
      level: r.level,
      title: r.title,
      summary: r.summary,
      focus: r.focus,
      contributions: r.contributions,
      relatedPublications: r.relatedPublications,
      tags: r.tags,
    }))
  );
  const [tagsDraft, setTagsDraft] = useState(tagsData.map((t) => t.name).join(', '));

  const chipSlots = useMemo(() => slots.filter((s) => s.kind === 'chip'), [slots]);
  const photoSlots = useMemo(() => slots.filter((s) => s.kind === 'photo'), [slots]);
  const portraitSlot = slots.find((s) => s.kind === 'portrait');

  const onPickImage = useCallback((slotId: string, file?: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSlots((prev) =>
      prev.map((s) =>
        s.id === slotId ? { ...s, preview: url, fileName: file.name } : s
      )
    );
    setNote(
      `已预览「${file.name}」。请把原图放到 source/photo_gallery/originals/，运行 npm run photos:thumbs 生成网页缩略图。`
    );
  }, []);

  const updateSlotText = useCallback(
    (slotId: string, field: 'title' | 'subtitle' | 'caption', value: string) => {
      setSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  const buildSavePayload = () => {
    const { name, title } = parseNameTitle(textDraft.name);
    const { role, affiliation } = parseRoleAffiliation(textDraft.role);

    const profile = {
      ...profileData,
      name,
      title,
      role,
      affiliation,
      tagline: textDraft.tagline,
      about: textDraft.about,
      postdocSummary: textDraft.postdocSummary,
      researchMainline: textDraft.researchMainline,
      email: textDraft.email,
      phone: textDraft.phone,
      office: textDraft.office,
      openTo: textDraft.openTo,
      achievements: textDraft.achievements.split('\n').map((s) => s.trim()).filter(Boolean),
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    const research = researchDraft.map((r) => ({
      ...r,
      contributions: r.contributions ?? [],
      relatedPublications: r.relatedPublications ?? [],
      tags: r.tags ?? [],
    }));

    const tags = tagsDraft
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));

    const chips = chipSlots.map((s) => {
      const id = s.id.replace(/^chip-/, '');
      const existing = chipGalleryData.find((c) => c.id === id);
      return {
        id,
        title: s.title,
        subtitle: s.subtitle,
        caption: s.caption,
        src: s.currentSrc || existing?.src || '',
        tags: existing?.tags ?? ['Chip Gallery'],
        paperRef: existing?.paperRef ?? '',
      };
    });

    const photos = photoSlots.map((s) => {
      const id = s.id.replace(/^photo-/, '');
      const existing = photoGalleryData.find((p) => p.id === id);
      return {
        id,
        title: s.title,
        location: s.subtitle,
        caption: s.caption,
        src: s.currentSrc || existing?.src || '',
        featured: existing?.featured ?? false,
      };
    });

    return { profile, research, tags, chips, photos };
  };

  const saveToSite = async () => {
    setSaving(true);
    setNote('正在保存…');
    try {
      const payload = buildSavePayload();
      const res = await fetch('/api/content/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setNote(`✅ 已保存到网站：${(data.saved as string[]).join(', ')}。刷新首页即可看到更新。`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '未知错误';
      setNote(`保存失败：${msg}。可改用「复制文字草稿」发给 Cursor。`);
    } finally {
      setSaving(false);
    }
  };

  const exportTextDraft = () => {
    const text = JSON.stringify(buildSavePayload(), null, 2);
    navigator.clipboard.writeText(text).then(
      () => setNote('文字草稿已复制到剪贴板。'),
      () => {
        const w = window.open();
        if (w) w.document.write(`<pre>${text.replace(/</g, '&lt;')}</pre>`);
        setNote('已打开新窗口显示草稿 JSON。');
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-800">
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#0f3460]">网站对照编辑台 / Manual Edit</h1>
            <p className="text-xs text-gray-500">
              文字：点虚线框直接改 → 点「保存到网站」。图片：选图预览后复制到黄色路径。
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <button
              type="button"
              onClick={saveToSite}
              disabled={saving}
              className="px-3 py-1.5 rounded bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-60"
            >
              {saving ? '保存中…' : '保存到网站'}
            </button>
            <button
              type="button"
              onClick={exportTextDraft}
              className="px-3 py-1.5 rounded bg-[#0f3460] text-white hover:bg-[#1a508b]"
            >
              复制草稿
            </button>
            <Link href="/" className="px-3 py-1.5 rounded border text-[#0f3460] hover:bg-gray-50">
              正式首页
            </Link>
            <Link href="/gallery/chips" className="px-3 py-1.5 rounded border text-[#0f3460] hover:bg-gray-50">
              Chip 正式页
            </Link>
          </div>
        </div>
        {note && (
          <div className="bg-emerald-50 border-t border-emerald-200 text-emerald-900 text-xs px-4 py-2">
            {note}
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <section className="bg-white rounded-xl shadow p-5 text-sm leading-relaxed">
          <SectionBadge>使用说明</SectionBadge>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>
              <strong>改文字</strong>：所有蓝色虚线框可直接编辑，改完点右上角「保存到网站」（本地 dev 模式一键写回 data/*.json）。
            </li>
            <li>
              <strong>改图片</strong>：选图后本页预览；再把文件复制到黄色路径，刷新正式站即可。
            </li>
            <li>
              <strong>数据来源</strong>：当前内容来自 <code>Xuliang_Wang_CV_202608.pdf</code>。
            </li>
          </ol>
        </section>

        <section className="bg-white rounded-xl shadow overflow-hidden">
          <SectionBadge>分区 A · Hero 文字 + 头像</SectionBadge>
          <div className="p-6 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-3">
              <label className="block text-xs text-gray-500">姓名 / 头衔</label>
              <input
                className={`w-full text-3xl font-bold text-[#0f3460] ${editBox}`}
                value={textDraft.name}
                onChange={(e) => setTextDraft((t) => ({ ...t, name: e.target.value }))}
              />
              <label className="block text-xs text-gray-500">职位 / 单位</label>
              <input
                className={`w-full text-[#1a508b] font-medium ${editBox}`}
                value={textDraft.role}
                onChange={(e) => setTextDraft((t) => ({ ...t, role: e.target.value }))}
              />
              <label className="block text-xs text-gray-500">一句话简介 (tagline)</label>
              <textarea
                className={`w-full text-gray-700 leading-relaxed min-h-[5rem] ${editBox}`}
                value={textDraft.tagline}
                onChange={(e) => setTextDraft((t) => ({ ...t, tagline: e.target.value }))}
              />
              <label className="block text-xs text-gray-500">研究主线 (researchMainline)</label>
              <textarea
                className={`w-full text-sm text-gray-700 min-h-[4rem] ${editBox}`}
                value={textDraft.researchMainline}
                onChange={(e) => setTextDraft((t) => ({ ...t, researchMainline: e.target.value }))}
              />
            </div>
            {portraitSlot && (
              <ImageSlotCard slot={portraitSlot} onPick={onPickImage} onTextChange={updateSlotText} />
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <SectionBadge>分区 B · About / Achievements</SectionBadge>
          <label className="block text-xs text-gray-500 mb-1">About</label>
          <textarea
            className={`w-full text-sm min-h-[6rem] mb-4 ${editBox}`}
            value={textDraft.about}
            onChange={(e) => setTextDraft((t) => ({ ...t, about: e.target.value }))}
          />
          <label className="block text-xs text-gray-500 mb-1">Postdoc summary</label>
          <textarea
            className={`w-full text-sm min-h-[5rem] mb-4 ${editBox}`}
            value={textDraft.postdocSummary}
            onChange={(e) => setTextDraft((t) => ({ ...t, postdocSummary: e.target.value }))}
          />
          <label className="block text-xs text-gray-500 mb-1">Achievements（每行一条）</label>
          <textarea
            className={`w-full text-sm min-h-[7rem] ${editBox}`}
            value={textDraft.achievements}
            onChange={(e) => setTextDraft((t) => ({ ...t, achievements: e.target.value }))}
          />
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <SectionBadge>分区 C · Tags（逗号分隔）</SectionBadge>
          <textarea
            className={`w-full text-sm min-h-[3rem] ${editBox}`}
            value={tagsDraft}
            onChange={(e) => setTagsDraft(e.target.value)}
          />
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <SectionBadge>分区 D · Chip Gallery（{chipSlots.length} 格）</SectionBadge>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chipSlots.map((slot) => (
              <ImageSlotCard key={slot.id} slot={slot} onPick={onPickImage} onTextChange={updateSlotText} />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <SectionBadge>分区 E · Photo Gallery（{photoSlots.length} 格）</SectionBadge>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photoSlots.map((slot) => (
              <ImageSlotCard key={slot.id} slot={slot} onPick={onPickImage} onTextChange={updateSlotText} />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <SectionBadge>分区 F · Research Interests</SectionBadge>
          <div className="grid md:grid-cols-2 gap-4">
            {researchDraft.map((r, idx) => (
              <div key={r.id} className="border rounded-lg p-4 space-y-2">
                <div className="text-xs uppercase text-[#0f3460]/70">{r.level}</div>
                <input
                  className={`w-full font-semibold text-[#1a508b] ${editBox}`}
                  value={r.title}
                  onChange={(e) =>
                    setResearchDraft((prev) =>
                      prev.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x))
                    )
                  }
                />
                <textarea
                  className={`w-full text-sm text-gray-600 min-h-[3rem] ${editBox}`}
                  value={r.summary}
                  onChange={(e) =>
                    setResearchDraft((prev) =>
                      prev.map((x, i) => (i === idx ? { ...x, summary: e.target.value } : x))
                    )
                  }
                />
                <textarea
                  className={`w-full text-xs text-gray-500 min-h-[4rem] ${editBox}`}
                  value={r.focus}
                  onChange={(e) =>
                    setResearchDraft((prev) =>
                      prev.map((x, i) => (i === idx ? { ...x, focus: e.target.value } : x))
                    )
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <SectionBadge>分区 G · Contact</SectionBadge>
          <div className="space-y-2 text-sm">
            <input className={`w-full ${editBox}`} value={textDraft.email} onChange={(e) => setTextDraft((t) => ({ ...t, email: e.target.value }))} placeholder="Email" />
            <input className={`w-full ${editBox}`} value={textDraft.phone} onChange={(e) => setTextDraft((t) => ({ ...t, phone: e.target.value }))} placeholder="Phone" />
            <textarea className={`w-full min-h-[3rem] ${editBox}`} value={textDraft.office} onChange={(e) => setTextDraft((t) => ({ ...t, office: e.target.value }))} placeholder="Office" />
            <textarea className={`w-full min-h-[3rem] ${editBox}`} value={textDraft.openTo} onChange={(e) => setTextDraft((t) => ({ ...t, openTo: e.target.value }))} placeholder="Open to..." />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6 text-center space-y-3">
          <button
            type="button"
            onClick={saveToSite}
            disabled={saving}
            className="px-6 py-3 rounded bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-60 mr-3"
          >
            {saving ? '保存中…' : '保存到网站'}
          </button>
          <button type="button" onClick={exportTextDraft} className="px-6 py-3 rounded bg-[#0f3460] text-white hover:bg-[#1a508b]">
            复制草稿 JSON
          </button>
        </section>
      </main>
    </div>
  );
}

function ImageSlotCard({
  slot,
  onPick,
  onTextChange,
}: {
  slot: ImgSlot;
  onPick: (id: string, file?: File | null) => void;
  onTextChange: (id: string, field: 'title' | 'subtitle' | 'caption', value: string) => void;
}) {
  const src = slot.preview || slot.currentSrc;
  const isEmpty = !src;

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-3 ${
        isEmpty ? 'border-amber-400 bg-amber-50/40' : 'border-[#0f3460]/40 bg-[#f7fbff]'
      }`}
    >
      <div className="text-xs font-semibold text-[#0f3460] mb-1">
        {slot.label}
        {isEmpty && <span className="ml-2 text-amber-700 font-normal">空位</span>}
      </div>
      <div className="aspect-[4/3] bg-gray-100 rounded overflow-hidden flex items-center justify-center mb-2">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={slot.label} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-amber-700/80 px-2 text-center">空槽位 · 点下方选择图片</span>
        )}
      </div>
      <label className="block text-center text-xs cursor-pointer bg-[#0f3460] text-white rounded py-2 hover:bg-[#1a508b] mb-2">
        {isEmpty ? '选择图片' : '更换图片预览'}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onPick(slot.id, e.target.files?.[0])} />
      </label>
      <PathHint path={slot.savePath} />
      <div className="mt-2 space-y-1">
        <input className={`w-full text-xs font-semibold ${editBox}`} value={slot.title} onChange={(e) => onTextChange(slot.id, 'title', e.target.value)} placeholder="title" />
        <input className={`w-full text-xs ${editBox}`} value={slot.subtitle} onChange={(e) => onTextChange(slot.id, 'subtitle', e.target.value)} placeholder="subtitle" />
        <textarea className={`w-full text-xs min-h-[2.5rem] ${editBox}`} value={slot.caption} onChange={(e) => onTextChange(slot.id, 'caption', e.target.value)} placeholder="caption" />
      </div>
      {slot.fileName && <p className="mt-1 text-[10px] text-emerald-700">预览：{slot.fileName}</p>}
    </div>
  );
}
