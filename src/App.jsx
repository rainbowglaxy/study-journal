import { useState, useEffect, useRef } from "react";

const DEFAULT_SUBJECTS = ["数学", "语文", "英语", "物理", "化学", "历史", "编程", "其他"];
const MOODS = [
  { label: "很好", emoji: "😊", color: "#f59e0b" },
  { label: "不错", emoji: "🙂", color: "#10b981" },
  { label: "一般", emoji: "😐", color: "#6b7280" },
  { label: "疲惫", emoji: "😩", color: "#ef4444" },
];

const S = {
  bg: "#0f0e17",
  card: "rgba(255,255,255,0.03)",
  cardBorder: "rgba(255,255,255,0.07)",
  cardHoverBorder: "rgba(255,255,255,0.14)",
  muted: "#555",
  muted2: "#3a3a4a",
  text: "#c4c4d4",
  accent: "#e53170",
  mono: "'DM Mono', monospace",
  serif: "'Noto Serif SC', Georgia, serif",
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ── helpers ────────────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <div style={{ fontSize: 11, color: S.muted, marginBottom: 10, letterSpacing: 1.5, fontFamily: S.mono, textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

function Tag({ children, accent }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 3, fontSize: 12, fontFamily: S.mono,
      background: accent ? "rgba(229,49,112,0.12)" : "rgba(255,255,255,0.05)",
      color: accent ? S.accent : "#a7a9be",
    }}>{children}</span>
  );
}

function RecordCard({ record, onClick }) {
  const mood = MOODS[record.mood];
  return (
    <div onClick={onClick} style={{
      padding: "16px 20px", cursor: "pointer", display: "flex", gap: 16, alignItems: "flex-start",
      background: S.card, border: `1px solid ${S.cardBorder}`, borderRadius: 8, transition: "all 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = S.cardHoverBorder; }}
      onMouseLeave={e => { e.currentTarget.style.background = S.card; e.currentTarget.style.borderColor = S.cardBorder; }}
    >
      <div style={{ minWidth: 44, textAlign: "center" }}>
        <div style={{ fontSize: 22 }}>{mood?.emoji}</div>
        <div style={{ fontSize: 10, color: S.muted, fontFamily: S.mono, marginTop: 4 }}>{record.date?.slice(5)}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <Tag accent>{record.subject}</Tag>
          {record.duration && <span style={{ fontSize: 11, color: S.muted, fontFamily: S.mono }}>{record.duration}h</span>}
          {record.photos?.length > 0 && <span style={{ fontSize: 11, color: S.muted, fontFamily: S.mono }}>📷{record.photos.length}</span>}
        </div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{record.title}</div>
        <div style={{ fontSize: 13, color: S.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{record.content}</div>
      </div>
      <div style={{ color: S.muted2, fontSize: 18, paddingTop: 4 }}>›</div>
    </div>
  );
}

// ── Subject Picker ─────────────────────────────────────────────────────────
function SubjectPicker({ value, onChange, subjects, onAddSubject, onDeleteSubject }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef();
  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);

  const commit = () => {
    const s = draft.trim();
    if (s && !subjects.includes(s)) { onAddSubject(s); onChange(s); }
    else if (s && subjects.includes(s)) onChange(s);
    setAdding(false); setDraft("");
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {subjects.map(s => {
        const sel = value === s;
        const custom = !DEFAULT_SUBJECTS.includes(s);
        return (
          <div key={s} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <button onClick={() => onChange(s)} style={{
              padding: `7px ${custom ? "26px" : "14px"} 7px 14px`, borderRadius: 4,
              border: sel ? `2px solid ${S.accent}` : "1px solid rgba(255,255,255,0.1)",
              background: sel ? "rgba(229,49,112,0.14)" : "rgba(255,255,255,0.04)",
              color: sel ? S.accent : "#a7a9be", fontSize: 13, cursor: "pointer", fontFamily: S.mono,
            }}>{s}</button>
            {custom && (
              <button onClick={e => { e.stopPropagation(); onDeleteSubject(s); if (value === s) onChange(subjects[0]); }}
                style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 12, padding: "2px 4px" }}
              >×</button>
            )}
          </div>
        );
      })}
      {adding ? (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setAdding(false); setDraft(""); } }}
            placeholder="科目名称"
            style={{ width: 90, padding: "7px 10px", fontSize: 13, borderRadius: 4, border: "1px solid rgba(229,49,112,0.5)", background: "rgba(255,255,255,0.05)", color: "#fff", outline: "none" }}
          />
          <button onClick={commit} style={{ padding: "7px 12px", background: S.accent, border: "none", borderRadius: 4, color: "#fff", fontSize: 12, cursor: "pointer" }}>✓</button>
          <button onClick={() => { setAdding(false); setDraft(""); }} style={{ padding: "7px 12px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 4, color: "#a7a9be", fontSize: 12, cursor: "pointer" }}>✕</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          style={{ padding: "7px 14px", borderRadius: 4, border: "1px dashed rgba(255,255,255,0.15)", background: "transparent", color: S.muted, fontSize: 13, cursor: "pointer", fontFamily: S.mono }}
          onMouseEnter={e => { e.currentTarget.style.color = "#a7a9be"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = S.muted; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
        >+ 自定义</button>
      )}
    </div>
  );
}

// ── Search / Filter View ───────────────────────────────────────────────────
function SearchView({ records, subjects, onSelectRecord, onBack }) {
  const [tab, setTab] = useState("date");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selSubject, setSelSubject] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const allSubjects = ["全部", ...subjects];

  const filtered = records.filter(r => {
    if (tab === "date") {
      if (dateFrom && r.date < dateFrom) return false;
      if (dateTo && r.date > dateTo) return false;
    }
    if (tab === "subject") {
      if (selSubject !== "全部" && r.subject !== selSubject) return false;
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      if (!(r.title + r.content + r.subject).toLowerCase().includes(kw)) return false;
    }
    return true;
  });

  const subjectStats = subjects.map(s => ({
    name: s,
    count: records.filter(r => r.subject === s).length,
    hours: records.filter(r => r.subject === s).reduce((a, r) => a + (parseFloat(r.duration) || 0), 0),
  })).filter(s => s.count > 0);

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "10px 14px", borderRadius: 4, fontSize: 13, outline: "none", fontFamily: S.mono };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
        <button className="btn-ghost" onClick={onBack} style={{ fontSize: 13 }}>← 返回</button>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>查询记录</h2>
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: 4, width: "fit-content" }}>
        {[{ id: "date", label: "📅 按日期" }, { id: "subject", label: "📚 按科目" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 20px", borderRadius: 4, border: "none", cursor: "pointer", fontSize: 13, fontFamily: S.mono,
            background: tab === t.id ? S.accent : "transparent",
            color: tab === t.id ? "#fff" : "#a7a9be",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text" placeholder="关键词搜索（标题 / 内容 / 科目）…" value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ ...inputStyle, width: "100%" }}
          onFocus={e => e.target.style.borderColor = "rgba(229,49,112,0.6)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />
      </div>

      {tab === "date" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          <div>
            <Label>开始日期</Label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              style={{ ...inputStyle, width: "100%" }}
              onFocus={e => e.target.style.borderColor = "rgba(229,49,112,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
          </div>
          <div>
            <Label>结束日期</Label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              style={{ ...inputStyle, width: "100%" }}
              onFocus={e => e.target.style.borderColor = "rgba(229,49,112,0.6)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"} />
          </div>
          {(dateFrom || dateTo) && (
            <div style={{ gridColumn: "1/-1" }}>
              <button onClick={() => { setDateFrom(""); setDateTo(""); }}
                style={{ background: "transparent", border: "none", color: S.muted, fontSize: 12, cursor: "pointer", fontFamily: S.mono }}
              >✕ 清除日期筛选</button>
            </div>
          )}
        </div>
      )}

      {tab === "subject" && (
        <div style={{ marginBottom: 24 }}>
          {!keyword && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px,1fr))", gap: 10, marginBottom: 16 }}>
              {subjectStats.map(s => (
                <div key={s.name} onClick={() => setSelSubject(selSubject === s.name ? "全部" : s.name)}
                  style={{
                    padding: "12px 14px", borderRadius: 6, cursor: "pointer", transition: "all 0.2s",
                    background: selSubject === s.name ? "rgba(229,49,112,0.14)" : "rgba(255,255,255,0.04)",
                    border: selSubject === s.name ? `1px solid ${S.accent}` : "1px solid rgba(255,255,255,0.08)",
                  }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: selSubject === s.name ? S.accent : "#fff" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: S.muted, fontFamily: S.mono }}>{s.count}篇 · {s.hours.toFixed(1)}h</div>
                </div>
              ))}
              {subjectStats.length === 0 && <div style={{ color: S.muted, fontSize: 13 }}>暂无记录</div>}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {allSubjects.map(s => (
              <button key={s} onClick={() => setSelSubject(s)} style={{
                padding: "6px 14px", borderRadius: 4, border: selSubject === s ? `2px solid ${S.accent}` : "1px solid rgba(255,255,255,0.1)",
                background: selSubject === s ? "rgba(229,49,112,0.14)" : "rgba(255,255,255,0.04)",
                color: selSubject === s ? S.accent : "#a7a9be", fontSize: 13, cursor: "pointer", fontFamily: S.mono,
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: S.muted2, letterSpacing: 1, fontFamily: S.mono }}>结果</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
        <span style={{ fontSize: 12, color: S.muted, fontFamily: S.mono }}>{filtered.length} 条</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: S.muted }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
          <div>未找到符合条件的记录</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(r => <RecordCard key={r.id} record={r} onClick={() => onSelectRecord(r)} />)}
        </div>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function StudyJournal() {
  const [view, setView] = useState("home");
  const [records, setRecords] = useState([]);
  const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [prevView, setPrevView] = useState("home");
  const [lightboxImg, setLightboxImg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const blankForm = () => ({ date: getTodayStr(), subject: subjects[0] || "其他", mood: 1, duration: "", title: "", content: "", goals: "", photos: [] });
  const [form, setForm] = useState(blankForm());
  const fileInputRef = useRef();

  useEffect(() => {
    try {
      const r = localStorage.getItem("study_records");
      if (r) setRecords(JSON.parse(r));
      const s = localStorage.getItem("study_subjects");
      if (s) setSubjects(JSON.parse(s));
    } catch (e) { console.error(e); }
  }, []);

  const saveRecords = async (list) => {
    setSaving(true);
    try { localStorage.setItem("study_records", JSON.stringify(list)); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 1500); } catch (e) { console.error(e); }
    setSaving(false);
  };

  const saveSubjects = async (list) => { try { localStorage.setItem("study_subjects", JSON.stringify(list)); } catch (e) { console.error(e); } };

  const handleAddSubject = s => { const next = [...subjects.filter(x => x !== "其他"), s, "其他"]; setSubjects(next); saveSubjects(next); };
  const handleDeleteSubject = s => { const next = subjects.filter(x => x !== s); setSubjects(next); saveSubjects(next); };

  const handlePhotoUpload = e => {
    Array.from(e.target.files).forEach(file => {
      const r = new FileReader();
      r.onload = ev => setForm(f => ({ ...f, photos: [...f.photos, { url: ev.target.result, name: file.name }] }));
      r.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    const next = [{ ...form, id: Date.now() }, ...records];
    setRecords(next); await saveRecords(next);
    setForm({ ...blankForm(), subject: form.subject });
    setView("home");
  };

  const deleteRecord = async id => {
    const next = records.filter(r => r.id !== id);
    setRecords(next); await saveRecords(next); setView("list");
  };

  const goDetail = (r, from) => { setSelectedRecord(r); setPrevView(from); setView("detail"); };

  const totalHours = records.reduce((s, r) => s + (parseFloat(r.duration) || 0), 0);
  const streak = (() => {
    const dates = [...new Set(records.map(r => r.date))].sort().reverse();
    let n = 0, cur = new Date();
    for (const d of dates) { if (Math.round((cur - new Date(d)) / 86400000) <= 1) { n++; cur = new Date(d); } else break; }
    return n;
  })();

  return (
    <div style={{ minHeight: "100vh", background: S.bg, color: "#fffffe", fontFamily: S.serif }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1a1927; }
        ::-webkit-scrollbar-thumb { background: #e53170; border-radius: 2px; }
        .btn-primary { background: #e53170; color: #fff; border: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.2s; font-family: 'DM Mono', monospace; }
        .btn-primary:hover { background: #ff2965; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(229,49,112,0.3); }
        .btn-primary:disabled { opacity: 0.35; transform: none; cursor: not-allowed; }
        .btn-ghost { background: transparent; color: #a7a9be; border: 1px solid rgba(167,169,190,0.2); padding: 8px 18px; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: 'DM Mono', monospace; }
        .btn-ghost:hover { border-color: rgba(229,49,112,0.5); color: #e53170; }
        textarea { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 14px 16px; border-radius: 6px; font-size: 14px; width: 100%; resize: vertical; outline: none; font-family: 'Noto Serif SC', Georgia, serif; line-height: 1.8; }
        textarea:focus { border-color: rgba(229,49,112,0.6); background: rgba(229,49,112,0.04); }
        input[type="text"], input[type="number"], input[type="date"] { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 14px; border-radius: 4px; font-size: 13px; outline: none; transition: border-color 0.2s; font-family: 'DM Mono', monospace; }
        input[type="text"]:focus, input[type="number"]:focus, input[type="date"]:focus { border-color: rgba(229,49,112,0.6); }
        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px,1fr)); gap: 8px; }
        .photo-thumb { width:100%; aspect-ratio:1; object-fit:cover; border-radius:4px; cursor:pointer; transition:transform 0.2s; }
        .photo-thumb:hover { transform:scale(1.05); }
        .lightbox { position:fixed; inset:0; background:rgba(0,0,0,0.93); z-index:100; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .lightbox img { max-width:90vw; max-height:90vh; border-radius:4px; }
      `}</style>

      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="" />
        </div>
      )}

      {/* NAV */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, background: S.bg, zIndex: 50 }}>
        <div onClick={() => setView("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: S.accent, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📓</div>
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: 2 }}>学习日志</span>
        </div>
        <div style={{ flex: 1 }} />
        <button className="btn-ghost" onClick={() => setView("search")} style={{ fontSize: 13 }}>🔍 查询</button>
        <button className="btn-ghost" onClick={() => setView("list")} style={{ fontSize: 13 }}>📋 全部</button>
        <button className="btn-primary" onClick={() => { setForm({ ...blankForm(), subject: form.subject }); setView("new"); }}>+ 新建记录</button>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 24px" }}>
        {/* HOME */}
        {view === "home" && (
          <div className="fade-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "累计记录", value: records.length, unit: "篇" },
                { label: "学习时长", value: totalHours.toFixed(1), unit: "小时" },
                { label: "连续打卡", value: streak, unit: "天" },
              ].map(s => (
                <div key={s.label} style={{ padding: "24px 20px", background: S.card, border: `1px solid ${S.cardBorder}`, borderRadius: 8, textAlign: "center" }}>
                  <div style={{ fontFamily: S.mono, fontSize: 34, color: S.accent }}>{s.value}<span style={{ fontSize: 15, color: S.muted, marginLeft: 4 }}>{s.unit}</span></div>
                  <div style={{ color: S.muted, fontSize: 13, marginTop: 6, letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: S.muted2, letterSpacing: 2, fontFamily: S.mono }}>最近记录</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            </div>

            {records.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#444" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
                <div>还没有学习记录，点击「新建记录」开始吧</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {records.slice(0, 5).map(r => <RecordCard key={r.id} record={r} onClick={() => goDetail(r, "home")} />)}
                {records.length > 5 && (
                  <button className="btn-ghost" onClick={() => setView("list")} style={{ margin: "8px auto 0" }}>查看全部 {records.length} 条记录 →</button>
                )}
              </div>
            )}
          </div>
        )}

        {/* LIST */}
        {view === "list" && (
          <div className="fade-in">
            <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
              <button className="btn-ghost" onClick={() => setView("home")} style={{ fontSize: 13 }}>← 返回</button>
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>全部记录</h2>
              <span style={{ color: S.muted, fontSize: 13, fontFamily: S.mono }}>{records.length} 条</span>
            </div>
            {records.length === 0
              ? <div style={{ textAlign: "center", padding: 60, color: S.muted }}>暂无记录</div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {records.map(r => <RecordCard key={r.id} record={r} onClick={() => goDetail(r, "list")} />)}
              </div>
            }
          </div>
        )}

        {/* SEARCH */}
        {view === "search" && (
          <SearchView
            records={records}
            subjects={subjects}
            onSelectRecord={r => goDetail(r, "search")}
            onBack={() => setView("home")}
          />
        )}

        {/* NEW */}
        {view === "new" && (
          <div className="fade-in">
            <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}>
              <button className="btn-ghost" onClick={() => setView("home")} style={{ fontSize: 13 }}>← 返回</button>
              <h2 style={{ fontSize: 20, fontWeight: 600 }}>新建学习记录</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div><Label>日期</Label><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ width: "100%" }} /></div>
                <div><Label>学习时长（小时）</Label><input type="number" min="0" step="0.5" placeholder="如 1.5" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} style={{ width: "100%" }} /></div>
              </div>
              <div>
                <Label>科目 <span style={{ color: "#444", fontWeight: 400, textTransform: "none" }}></span></Label>
                <SubjectPicker value={form.subject} onChange={s => setForm(f => ({ ...f, subject: s }))} subjects={subjects} onAddSubject={handleAddSubject} onDeleteSubject={handleDeleteSubject} />
              </div>
              <div>
                <Label>今日状态</Label>
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  {MOODS.map((m, i) => (
                    <button key={m.label} onClick={() => setForm(f => ({ ...f, mood: i }))}
                      style={{ flex: 1, padding: "10px 0", border: `2px solid ${form.mood === i ? m.color : "rgba(255,255,255,0.08)"}`, borderRadius: 6, background: form.mood === i ? `${m.color}18` : "rgba(255,255,255,0.03)", cursor: "pointer", color: form.mood === i ? m.color : "#a7a9be", transition: "all 0.2s" }}>
                      <div style={{ fontSize: 22 }}>{m.emoji}</div>
                      <div style={{ marginTop: 4 }}>{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div><Label>标题</Label><input type="text" placeholder="今天学了什么？" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ width: "100%" }} /></div>
              <div><Label>学习内容记录</Label><textarea rows={5} placeholder="详细记录今天的学习内容…" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /></div>
              <div><Label>明日目标（可选）</Label><textarea rows={2} placeholder="明天计划学什么？" value={form.goals} onChange={e => setForm(f => ({ ...f, goals: e.target.value }))} /></div>
              <div>
                <Label>上传照片</Label>
                {form.photos.length > 0 && (
                  <div className="photo-grid" style={{ marginBottom: 10 }}>
                    {form.photos.map((p, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img src={p.url} alt={p.name} className="photo-thumb" onClick={() => setLightboxImg(p.url)} />
                        <button onClick={() => setForm(f => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }))}
                          style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", borderRadius: "50%", width: 22, height: 22, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => fileInputRef.current.click()}
                  style={{ width: "100%", padding: "16px 0", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 6, background: "transparent", color: S.muted, fontSize: 13, cursor: "pointer", fontFamily: S.mono }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(229,49,112,0.5)"; e.currentTarget.style.color = "#a7a9be"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = S.muted; }}
                >点击上传照片（支持多张）</button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: "none" }} />
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8 }}>
                <button className="btn-ghost" onClick={() => setView("home")}>取消</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={!form.title.trim() || !form.content.trim()}>
                  {saving ? "保存中..." : saveSuccess ? "✓ 已保存" : "保存记录"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DETAIL */}
        {view === "detail" && selectedRecord && (
          <div className="fade-in">
            <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}>
              <button className="btn-ghost" onClick={() => setView(prevView)} style={{ fontSize: 13 }}>← 返回</button>
              <div style={{ flex: 1 }} />
              <button onClick={() => { if (confirm("确定删除这条记录？")) deleteRecord(selectedRecord.id); }}
                style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "8px 16px", borderRadius: 6, fontSize: 13, cursor: "pointer", fontFamily: S.mono }}
              >删除</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              <Tag accent>{selectedRecord.subject}</Tag>
              <Tag>{MOODS[selectedRecord.mood]?.emoji} {MOODS[selectedRecord.mood]?.label}</Tag>
              {selectedRecord.duration && <Tag>{selectedRecord.duration}h</Tag>}
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 600, margin: "16px 0 6px", lineHeight: 1.4 }}>{selectedRecord.title}</h1>
            <div style={{ color: "#444", fontSize: 13, marginBottom: 28, fontFamily: S.mono }}>{formatDate(selectedRecord.date)}</div>
            <div style={{ fontSize: 15, lineHeight: 1.9, color: S.text, whiteSpace: "pre-wrap" }}>{selectedRecord.content}</div>
            {selectedRecord.goals && (
              <div style={{ marginBottom: 28, padding: "16px 20px", background: "rgba(229,49,112,0.08)", borderRadius: 8, marginTop: 24 }}>
                <div style={{ fontSize: 11, color: S.accent, marginBottom: 8, letterSpacing: 1, fontFamily: S.mono }}>明日目标</div>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: S.text, whiteSpace: "pre-wrap" }}>{selectedRecord.goals}</div>
              </div>
            )}
            {selectedRecord.photos?.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: "#444", marginBottom: 12, letterSpacing: 1, fontFamily: S.mono }}>照片</div>
                <div className="photo-grid">
                  {selectedRecord.photos.map((p, i) => <img key={i} src={p.url} alt={p.name} className="photo-thumb" onClick={() => setLightboxImg(p.url)} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
