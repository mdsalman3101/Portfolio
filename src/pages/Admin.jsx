import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { publicUrl, supabase } from "../lib/supabase";

const emptyProject = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  year: new Date().getFullYear(),
  tags: "",
  live_url: "",
  github_url: "",
  featured: false,
  published: true,
  sort_order: 0,
};
const emptyCertificate = {
  title: "",
  issuer: "",
  issue_date: "",
  published: true,
  sort_order: 0,
};
const tabs = ["Projects", "Certificates", "Site content", "Media"];
export default function Admin() {
  const nav = useNavigate();
  const [session, setSession] = useState(undefined),
    [authorized, setAuthorized] = useState(false),
    [tab, setTab] = useState("Projects"),
    [projects, setProjects] = useState([]),
    [certificates, setCertificates] = useState([]),
    [content, setContent] = useState([]),
    [editing, setEditing] = useState(null),
    [form, setForm] = useState(emptyProject),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(async ({ data }) => {
      const s = data.session;
      setSession(s);
      if (s) {
        const { data: m } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", s.user.id)
          .maybeSingle();
        setAuthorized(Boolean(m));
      }
    });
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s),
    );
    return () => l.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (authorized) load();
  }, [authorized]);
  async function load() {
    const [p, c, s] = await Promise.all([
      supabase
        .from("projects")
        .select("*,project_media(*)")
        .order("sort_order"),
      supabase.from("certificates").select("*").order("sort_order"),
      supabase.from("site_content").select("*").order("key"),
    ]);
    setProjects(p.data || []);
    setCertificates(c.data || []);
    setContent(s.data || []);
  }
  function openNew() {
    setEditing(null);
    setForm(tab === "Projects" ? emptyProject : emptyCertificate);
  }
  function edit(item) {
    setEditing(item);
    setForm({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
    });
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    const table = tab === "Projects" ? "projects" : "certificates";
    const payload = { ...form };
    delete payload.project_media;
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    if (table === "projects")
      payload.tags = String(payload.tags || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    const query = editing
      ? supabase.from(table).update(payload).eq("id", editing.id)
      : supabase.from(table).insert(payload);
    const { error } = await query;
    setBusy(false);
    if (error) {
      setNotice(error.message);
      return;
    }
    setNotice(`${tab.slice(0, -1)} saved.`);
    setEditing(null);
    setForm(table === "projects" ? emptyProject : emptyCertificate);
    load();
  }
  async function remove(item) {
    if (!confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    const table = tab === "Projects" ? "projects" : "certificates";
    if (tab === "Projects") {
      for (const m of item.project_media || []) await deleteMedia(m);
    }
    for (const p of [
      item.cover_path,
      item.pdf_path,
      item.thumbnail_path,
    ].filter(Boolean)) {
      await supabase.storage.from("portfolio-media").remove([p]);
    }
    await supabase.from(table).delete().eq("id", item.id);
    load();
  }
  async function toggle(item, key) {
    await supabase
      .from(tab === "Projects" ? "projects" : "certificates")
      .update({ [key]: !item[key] })
      .eq("id", item.id);
    load();
  }
  async function reorder(list, index, dir) {
    const other = index + dir;
    if (other < 0 || other >= list.length) return;
    const table = tab === "Projects" ? "projects" : "certificates";
    await Promise.all([
      supabase
        .from(table)
        .update({ sort_order: other })
        .eq("id", list[index].id),
      supabase
        .from(table)
        .update({ sort_order: index })
        .eq("id", list[other].id),
    ]);
    load();
  }
  async function upload(file, folder) {
    if (!file) return null;
    const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${folder}/${crypto.randomUUID()}-${safe}`;
    const { error } = await supabase.storage
      .from("portfolio-media")
      .upload(path, file);
    if (error) throw error;
    return path;
  }
  async function uploadProject(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget),
      projectId = fd.get("project"),
      cover = fd.get("cover"),
      screens = fd.getAll("screens"),
      video = fd.get("video");
    setBusy(true);
    try {
      if (cover?.size) {
        const path = await upload(cover, "projects/covers");
        const current = projects.find((p) => p.id === projectId);
        if (current?.cover_path)
          await supabase.storage
            .from("portfolio-media")
            .remove([current.cover_path]);
        await supabase
          .from("projects")
          .update({ cover_path: path })
          .eq("id", projectId);
      }
      let order =
        projects.find((p) => p.id === projectId)?.project_media?.length || 0;
      for (const file of [...screens, ...(video?.size ? [video] : [])]) {
        if (!file.size) continue;
        const media_type = file.type.startsWith("video") ? "video" : "image";
        const file_path = await upload(file, `projects/${media_type}s`);
        await supabase
          .from("project_media")
          .insert({
            project_id: projectId,
            file_path,
            media_type,
            alt_text: `Project media for ${projects.find((p) => p.id === projectId)?.title}`,
            sort_order: order++,
          });
      }
      setNotice("Media uploaded.");
      e.currentTarget.reset();
      load();
    } catch (err) {
      setNotice(err.message);
    }
    setBusy(false);
  }
  async function deleteMedia(m) {
    await supabase.storage.from("portfolio-media").remove([m.file_path]);
    await supabase.from("project_media").delete().eq("id", m.id);
  }
  async function moveMedia(media, index, direction) {
    const target = index + direction;
    if (target < 0 || target >= media.length) return;
    await Promise.all([
      supabase.from("project_media").update({ sort_order: target }).eq("id", media[index].id),
      supabase.from("project_media").update({ sort_order: index }).eq("id", media[target].id),
    ]);
    load();
  }
  async function uploadCertificate(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget),
      id = fd.get("certificate");
    setBusy(true);
    try {
      const payload = {};
      for (const [name, folder] of [
        ["pdf", "certificates/pdfs"],
        ["thumbnail", "certificates/thumbnails"],
      ]) {
        const file = fd.get(name);
        if (file?.size) payload[`${name}_path`] = await upload(file, folder);
      }
      await supabase.from("certificates").update(payload).eq("id", id);
      setNotice("Certificate files uploaded.");
      e.currentTarget.reset();
      load();
    } catch (err) {
      setNotice(err.message);
    }
    setBusy(false);
  }
  async function saveContent(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    let value;
    try {
      value = JSON.parse(fd.get("value"));
    } catch {
      setNotice("Value must be valid JSON.");
      return;
    }
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: fd.get("key"), value });
    setNotice(error?.message || "Site content saved.");
    load();
  }
  if (session === undefined)
    return <main className="admin-loading">Loading secure dashboard…</main>;
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!authorized)
    return (
      <main className="auth-page">
        <div className="auth-card">
          <h1>Access denied.</h1>
          <p>Your signed-in account is not in the admin_users table.</p>
          <button
            className="admin-primary"
            onClick={() =>
              supabase.auth.signOut().then(() => nav("/admin/login"))
            }
          >
            Sign out
          </button>
        </div>
      </main>
    );
  const list = tab === "Projects" ? projects : certificates;
  return (
    <div className="dashboard">
      <aside>
        <a className="brand" href="/">
          salman<span>.</span>
        </a>
        <p>PORTFOLIO CMS</p>
        <nav>
          {tabs.map((x) => (
            <button
              className={tab === x ? "active" : ""}
              key={x}
              onClick={() => {
                setTab(x);
                setEditing(null);
                setNotice("");
              }}
            >
              {x}
            </button>
          ))}
        </nav>
        <button className="signout" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </aside>
      <main className="dash-main">
        <header>
          <div>
            <span>ADMIN DASHBOARD</span>
            <h1>{tab}</h1>
          </div>
          {(tab === "Projects" || tab === "Certificates") && (
            <button className="admin-primary" onClick={openNew}>
              + Add new
            </button>
          )}
        </header>
        {notice && (
          <div className="notice" role="status">
            {notice}
          </div>
        )}
        {(tab === "Projects" || tab === "Certificates") && (
          <>
            <section className="admin-list">
              {list.map((item, i) => (
                <article key={item.id}>
                  <div>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <h3>{item.title}</h3>
                    <small>
                      {item.published ? "Published" : "Draft"}
                      {item.featured ? " · Featured" : ""}
                    </small>
                  </div>
                  <div className="row-actions">
                    <button
                      onClick={() => reorder(list, i, -1)}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => reorder(list, i, 1)}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button onClick={() => toggle(item, "published")}>
                      {item.published ? "Unpublish" : "Publish"}
                    </button>
                    {tab === "Projects" && (
                      <button onClick={() => toggle(item, "featured")}>
                        {item.featured ? "Unfeature" : "Feature"}
                      </button>
                    )}
                    <button onClick={() => edit(item)}>Edit</button>
                    <button className="danger" onClick={() => remove(item)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </section>
            <form className="editor" onSubmit={save}>
              <h2>
                {editing ? "Edit" : "Add"} {tab.slice(0, -1)}
              </h2>
              <div className="form-grid">
                {tab === "Projects" ? (
                  <>
                    <Field
                      name="title"
                      value={form.title}
                      set={setForm}
                      required
                    />
                    <Field
                      name="slug"
                      value={form.slug}
                      set={setForm}
                      required
                    />
                    <Field
                      name="summary"
                      value={form.summary}
                      set={setForm}
                      wide
                      textarea
                    />
                    <Field
                      name="description"
                      value={form.description}
                      set={setForm}
                      wide
                      textarea
                    />
                    <Field
                      name="year"
                      type="number"
                      value={form.year}
                      set={setForm}
                    />
                    <Field
                      name="tags"
                      label="Tags (comma separated)"
                      value={form.tags}
                      set={setForm}
                    />
                    <Field
                      name="live_url"
                      label="Live URL"
                      value={form.live_url}
                      set={setForm}
                    />
                    <Field
                      name="github_url"
                      label="GitHub URL"
                      value={form.github_url}
                      set={setForm}
                    />
                  </>
                ) : (
                  <>
                    <Field
                      name="title"
                      value={form.title}
                      set={setForm}
                      required
                    />
                    <Field name="issuer" value={form.issuer} set={setForm} />
                    <Field
                      name="issue_date"
                      label="Issue date"
                      type="date"
                      value={form.issue_date || ""}
                      set={setForm}
                    />
                  </>
                )}
                <Field
                  name="sort_order"
                  label="Sort order"
                  type="number"
                  value={form.sort_order}
                  set={setForm}
                />
                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                  />{" "}
                  Published
                </label>
                {tab === "Projects" && (
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                    />{" "}
                    Featured
                  </label>
                )}
              </div>
              <button className="admin-primary" disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </button>
            </form>
          </>
        )}
        {tab === "Media" && (
          <div className="media-layout">
            <form className="editor" onSubmit={uploadProject}>
              <h2>Project media</h2>
              <label>
                Project
                <select name="project" required>
                  {projects.map((p) => (
                    <option value={p.id} key={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Cover image
                <input name="cover" type="file" accept="image/*" />
              </label>
              <label>
                Screenshots
                <input name="screens" type="file" accept="image/*" multiple />
              </label>
              <label>
                Demo video
                <input name="video" type="file" accept="video/*" />
              </label>
              <button className="admin-primary" disabled={busy}>
                Upload project media
              </button>
            </form>
            <form className="editor" onSubmit={uploadCertificate}>
              <h2>Certificate files</h2>
              <label>
                Certificate
                <select name="certificate" required>
                  {certificates.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                PDF
                <input name="pdf" type="file" accept="application/pdf" />
              </label>
              <label>
                Thumbnail
                <input name="thumbnail" type="file" accept="image/*" />
              </label>
              <button className="admin-primary" disabled={busy}>
                Upload certificate files
              </button>
            </form>
            <div className="media-gallery">
              {projects.flatMap((p) =>
                (p.project_media || []).map((m, mediaIndex) => (
                  <article key={m.id}>
                    {m.media_type === "image" ? (
                      <img
                        src={publicUrl(m.file_path)}
                        alt={m.alt_text || ""}
                      />
                    ) : (
                      <video
                        src={publicUrl(m.file_path)}
                        controls
                        preload="metadata"
                      />
                    )}
                    <span>{p.title}</span>
                    <div className="row-actions">
                      <button onClick={() => moveMedia(p.project_media, mediaIndex, -1)} aria-label="Move media up">↑</button>
                      <button onClick={() => moveMedia(p.project_media, mediaIndex, 1)} aria-label="Move media down">↓</button>
                    <button
                      className="danger"
                      onClick={async () => {
                        await deleteMedia(m);
                        load();
                      }}
                    >
                      Delete
                    </button>
                    </div>
                  </article>
                )),
              )}
            </div>
          </div>
        )}
        {tab === "Site content" && (
          <>
            <form className="editor content-editor" onSubmit={saveContent}>
              <h2>Edit public content</h2>
              <label>
                Content key
                <select name="key">
                  {["hero", "about", "contact"].map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
              <label>
                JSON value
                <textarea
                  name="value"
                  rows="9"
                  defaultValue={JSON.stringify(
                    content.find((x) => x.key === "hero")?.value || {
                      eyebrow: "Hey, I am Salman",
                      headline: "CREATIVE DEVELOPER",
                      description: "Your hero introduction.",
                    },
                    null,
                    2,
                  )}
                />
              </label>
              <button className="admin-primary">Save content</button>
            </form>
            <div className="content-cards">
              {content.map((x) => (
                <article key={x.key}>
                  <b>{x.key}</b>
                  <pre>{JSON.stringify(x.value, null, 2)}</pre>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
function Field({
  name,
  label,
  type = "text",
  value,
  set,
  wide,
  textarea,
  required,
}) {
  const common = {
    name,
    value: value ?? "",
    required,
    onChange: (e) =>
      set((x) => ({
        ...x,
        [name]: type === "number" ? Number(e.target.value) : e.target.value,
      })),
  };
  return (
    <label className={wide ? "wide" : ""}>
      {label || name.replace("_", " ")}
      {textarea ? (
        <textarea rows="3" {...common} />
      ) : (
        <input type={type} {...common} />
      )}
    </label>
  );
}
