/* ======================================================================= */
/*  AYA ALSHANTEER - 202111261 AlAmer Smart Inventory System (ASIS) — MVP  */
/* ======================================================================= */
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  Boxes,
  Building2,
  Check,
  ClipboardList,
  Clock,
  Eye,
  EyeOff,
  LayoutGrid,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  Menu,
  Minus,
  Navigation,
  Package,
  PartyPopper,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingDown,
  TriangleAlert,
  Trash2,
  Trophy,
  User,
  Users,
  X,
} from "lucide-react";

/* ======================================================================= */
/*  بيانات أولية — نظام العامر الذكي للجرد (ASIS) — هواتف وإلكترونيات       */
/* ======================================================================= */

function formatNumber(value) {
  return new Intl.NumberFormat("ar-JO").format(value);
}

const BRANCH = { name: "فرع عمّان — المقر الرئيسي", radiusMeters: 150 };

const initialInventory = [
  { id: "itm-01", name: "آيفون 15 برو ماكس", model: "iPhone 15 Pro Max 256GB", sku: "APL-15PM-256", kind: "device", expected: 14, counted: 0, verified: false, price: 1049, location: "خزنة العرض — رف A1" },
  { id: "itm-02", name: "سامسونج جالكسي S24 ألترا", model: "Galaxy S24 Ultra 512GB", sku: "SAM-S24U-512", kind: "device", expected: 9, counted: 0, verified: false, price: 989, location: "خزنة العرض — رف A2" },
  { id: "itm-03", name: "آيفون 14", model: "iPhone 14 128GB", sku: "APL-14-128", kind: "device", expected: 21, counted: 0, verified: false, price: 599, location: "المستودع — رف B4" },
  { id: "itm-04", name: "شاومي ريدمي نوت 13 برو", model: "Redmi Note 13 Pro 256GB", sku: "XMI-RN13P-256", kind: "device", expected: 32, counted: 0, verified: false, price: 249, location: "المستودع — رف B1" },
  { id: "itm-05", name: "إيربودز برو الجيل الثاني", model: "AirPods Pro (2nd Gen)", sku: "APL-APP-G2", kind: "accessory", expected: 18, counted: 0, verified: false, price: 239, location: "واجهة الملحقات — درج C1" },
  { id: "itm-06", name: "شاحن أبل 20 واط", model: "Apple 20W USB-C Adapter", sku: "APL-CHG-20W", kind: "accessory", expected: 64, counted: 0, verified: false, price: 21, location: "واجهة الملحقات — درج C2" },
  { id: "itm-07", name: "واقي شاشة زجاجي", model: "Tempered Glass 9H — Universal", sku: "ACC-GLS-9H", kind: "accessory", expected: 120, counted: 0, verified: false, price: 4, location: "واجهة الملحقات — درج C4" },
  { id: "itm-08", name: "ساعة أبل الإصدار العاشر", model: "Apple Watch Series 10 46mm", sku: "APL-AW10-46", kind: "device", expected: 7, counted: 0, verified: false, price: 449, location: "خزنة العرض — رف A4" },
  { id: "itm-09", name: "باور بانك أنكر 20 ألف", model: "Anker PowerCore 20000mAh", sku: "ANK-PB-20K", kind: "accessory", expected: 26, counted: 0, verified: false, price: 39, location: "واجهة الملحقات — درج C3" },
  { id: "itm-10", name: "جالكسي بادز 3 برو", model: "Galaxy Buds3 Pro", sku: "SAM-BD3P", kind: "accessory", expected: 11, counted: 0, verified: false, price: 179, location: "واجهة الملحقات — درج C5" },
];

const initialUsers = [
  { id: "u-01", name: "آية الشنتير", role: "مديرة النظام", branch: "عمّان", status: "نشط", lastSeen: "الآن" },
  { id: "u-02", name: "خالد الزعبي", role: "مدير فرع", branch: "إربد", status: "نشط", lastSeen: "قبل 4 دقائق" },
  { id: "u-03", name: "ليان مرعي", role: "موظف جرد", branch: "عمّان", status: "نشط", lastSeen: "قبل 12 دقيقة" },
  { id: "u-04", name: "عمر الحديد", role: "أمين مستودع", branch: "عمّان", status: "نشط", lastSeen: "قبل 26 دقيقة" },
  { id: "u-05", name: "سجود العتوم", role: "موظف جرد", branch: "إربد", status: "موقوف", lastSeen: "أمس 18:40" },
  { id: "u-06", name: "يزن قطيشات", role: "موظف جرد", branch: "إربد", status: "نشط", lastSeen: "قبل ساعة" },
];

const initialAlerts = [
  { id: "al-01", item: "آيفون 15 برو ماكس 256GB", daysLeft: 2, confidence: 94, note: "نموذج TensorFlow.js (انحدار خطي) حلّل مبيعات آخر 14 يوماً — معدل البيع تضاعف بعد عرض نهاية الشهر." },
  { id: "al-02", item: "شاحن أبل 20 واط", daysLeft: 5, confidence: 88, note: "تنبؤ TensorFlow.js: استهلاك مرتفع مرتبط بمبيعات الأجهزة خلال آخر 14 يوماً." },
  { id: "al-03", item: "جالكسي بادز 3 برو", daysLeft: 6, confidence: 81, note: "المخزون الحالي أقل من حد الأمان بـ 40% وفق انحدار خطي لبيانات 14 يوماً." },
];

/* ======================================================================= */
/*  التنسيق العام — يحافظ على هوية التصميم الأصلية (Light / RTL)           */
/* ======================================================================= */

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');

      :root {
        --background: oklch(0.985 0.002 250);
        --foreground: oklch(0.21 0.02 260);
        --card: oklch(1 0 0);
        --primary: oklch(0.51 0.16 258);
        --primary-foreground: oklch(0.99 0.005 250);
        --muted: oklch(0.968 0.004 250);
        --muted-foreground: oklch(0.55 0.015 258);
        --accent-foreground: oklch(0.36 0.1 258);
        --border: oklch(0.925 0.006 255);
        --input: oklch(0.925 0.006 255);
        --ring: oklch(0.51 0.16 258);
        --success: oklch(0.62 0.14 162);
        --success-foreground: oklch(0.99 0.005 250);
        --success-soft: oklch(0.95 0.035 162);
        --alert: oklch(0.56 0.22 22);
        --alert-foreground: oklch(0.99 0.005 250);
        --alert-soft: oklch(0.96 0.03 22);
        --brand-soft: oklch(0.955 0.025 258);
      }

      .asis-root, .asis-root * { font-family: 'IBM Plex Sans Arabic', Tahoma, ui-sans-serif, system-ui, sans-serif; box-sizing: border-box; }
      .asis-root { background: var(--background); color: var(--foreground); min-height: 100vh; }

      .bg-background{background-color:var(--background);}
      .bg-card{background-color:var(--card);}
      .bg-muted{background-color:var(--muted);}
      .bg-primary{background-color:var(--primary);}
      .bg-foreground{background-color:var(--foreground);}
      .bg-success{background-color:var(--success);}
      .bg-success-soft{background-color:var(--success-soft);}
      .bg-alert{background-color:var(--alert);}
      .bg-alert-soft{background-color:var(--alert-soft);}
      .bg-brand-soft{background-color:var(--brand-soft);}
      .bg-border{background-color:var(--border);}

      .text-foreground{color:var(--foreground);}
      .text-muted-foreground{color:var(--muted-foreground);}
      .text-primary{color:var(--primary);}
      .text-primary-foreground{color:var(--primary-foreground);}
      .text-background{color:var(--background);}
      .text-success{color:var(--success);}
      .text-success-foreground{color:var(--success-foreground);}
      .text-alert{color:var(--alert);}
      .text-alert-foreground{color:var(--alert-foreground);}
      .text-accent-foreground{color:var(--accent-foreground);}

      .border-border{border-color:var(--border);}
      .border-input{border-color:var(--input);}
      .border-primary{border-color:var(--primary);}
      .divide-border > * + *{border-top-color:var(--border);}

      .bg-background-85{background-color:color-mix(in oklch, var(--background) 85%, transparent);}
      .bg-background-90{background-color:color-mix(in oklch, var(--background) 90%, transparent);}
      .bg-foreground-25{background-color:color-mix(in oklch, var(--foreground) 25%, transparent);}
      .bg-primary-35{background-color:color-mix(in oklch, var(--primary) 35%, transparent);}
      .bg-alert-soft-60{background-color:color-mix(in oklch, var(--alert-soft) 60%, transparent);}
      .bg-muted-50{background-color:color-mix(in oklch, var(--muted) 50%, transparent);}
      .border-alert-20{border-color:color-mix(in oklch, var(--alert) 20%, transparent);}
      .border-alert-25{border-color:color-mix(in oklch, var(--alert) 25%, transparent);}
      .border-alert-30{border-color:color-mix(in oklch, var(--alert) 30%, transparent);}
      .border-success-30{border-color:color-mix(in oklch, var(--success) 30%, transparent);}
      .border-success-35{border-color:color-mix(in oklch, var(--success) 35%, transparent);}

      .shadow-card{box-shadow: 0 1px 2px color-mix(in oklch, var(--foreground) 4%, transparent), 0 10px 24px -14px color-mix(in oklch, var(--foreground) 12%, transparent);}
      .shadow-brand{box-shadow: 0 10px 22px -8px color-mix(in oklch, var(--primary) 45%, transparent);}
      .text-2xs{font-size:11px;line-height:15px;}
      .focus-ring{outline:none;transition:box-shadow .15s ease, border-color .15s ease;}
      .focus-ring:focus{border-color:var(--ring);box-shadow:0 0 0 4px color-mix(in oklch, var(--ring) 12%, transparent);}
      .admin-grid{display:grid;gap:1.25rem;}
      @media (min-width:1024px){.admin-grid{grid-template-columns:260px 1fr;}}
      .dotted-bg{background-image:radial-gradient(var(--border) 1px, transparent 1px);background-size:22px 22px;-webkit-mask-image:radial-gradient(ellipse 70% 55% at 50% 35%, black 20%, transparent 75%);mask-image:radial-gradient(ellipse 70% 55% at 50% 35%, black 20%, transparent 75%);}
      @keyframes toast-in{from{opacity:0;transform:translate(-50%,-10px);}to{opacity:1;transform:translate(-50%,0);}}
      .toast-anim{animation:toast-in .25s ease-out;}
      input::placeholder{color:var(--muted-foreground);}
      select{font-family:inherit;}
    `}</style>
  );
}

/* ======================================================================= */
/*  عناصر مشتركة صغيرة                                                     */
/* ======================================================================= */

function Toggle({ checked, onClick, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-success" : "bg-border"} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-card shadow-sm transition-all duration-300 ${checked ? "end-0.5" : "start-0.5"}`}
      />
    </button>
  );
}

function CircularProgress({ percent }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(percent), 120);
    return () => clearTimeout(t);
  }, [percent]);

  const r = 62;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative grid size-44 place-items-center">
      <svg viewBox="0 0 160 160" className="size-44" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--muted)" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * animated) / 100}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-semibold tabular-nums tracking-tight text-foreground">{Math.round(animated)}%</span>
        <span className="mt-0.5 text-xs text-muted-foreground">إنجاز الجرد</span>
      </div>
    </div>
  );
}

function ToastBanner({ toast }) {
  if (!toast) return null;
  const isSubmit = toast.type === "submit";
  return (
    <div
      className="toast-anim fixed top-4 z-[60] flex items-center gap-3 rounded-2xl border border-success-30 bg-card px-4 py-3 shadow-card"
      style={{ left: "50%", transform: "translateX(-50%)" }}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-success-soft text-success">
        <PartyPopper className="size-4" />
      </span>
      <div className="text-sm">
        {isSubmit ? (
          <>
            <p className="font-semibold text-foreground">تم إرسال الجرد بنجاح</p>
            <p className="text-xs text-muted-foreground">
              +{formatNumber(toast.points)} قطعة أُضيفت لسباق فرع عمّان 🎉
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-foreground">تم إنشاء أمر الشراء</p>
            <p className="text-xs text-muted-foreground">أمر شراء مقترح لـ {formatNumber(toast.count)} أصناف منخفضة المخزون.</p>
          </>
        )}
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  شاشة تسجيل الدخول — مصادقة + تحقق جغرافي محاكى (FR1, FR2, FR11)         */
/* ======================================================================= */

function LoginScreen({ onLogin, geoRequired }) {
  const [username, setUsername] = useState("aya.shanteer");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("employee");
  const [geo, setGeo] = useState("idle"); // idle | checking | verified | failed
  const [progress, setProgress] = useState(0);
  const [geoDetail, setGeoDetail] = useState(null);
  const [simulateOutOfRange, setSimulateOutOfRange] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // ينفّذ فحص GPS المحاكى ويعيد true إذا نجح التحقق، أو false إذا فشل — بدون
  // الاعتماد على useEffect أو مراجع مؤقّتة، لتفادي أي تعارض بين التحديثات.
  async function runGpsCheck() {
    setError(null);
    setGeo("checking");
    setProgress(15);
    await wait(200);
    setProgress(90);
    await wait(1100);
    setProgress(100);

    if (simulateOutOfRange) {
      setGeo("failed");
      setGeoDetail(`أنت خارج النطاق المسموح (${BRANCH.radiusMeters} متر) — تبعد نحو ٤١٠ متر عن ${BRANCH.name}.`);
      return false;
    }
    setGeo("verified");
    setGeoDetail(`تم التأكيد: أنت ضمن نطاق ${BRANCH.radiusMeters} متر من ${BRANCH.name}.`);
    return true;
  }

  const canSubmit = username.trim() !== "" && password !== "";

  async function handleValidateClick() {
    if (geo === "checking" || submitting) return;
    await runGpsCheck();
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!username.trim() || !password) {
      setError("الرجاء إدخال اسم المستخدم وكلمة المرور.");
      return;
    }
    setError(null);

    if (geoRequired && geo !== "verified") {
      setSubmitting(true);
      const ok = await runGpsCheck();
      setSubmitting(false);
      if (!ok) return;
    }

    onLogin(role);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div aria-hidden="true" className="dotted-bg pointer-events-none absolute inset-0" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-brand">
            <span className="text-lg font-bold tracking-tight">AS</span>
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">نظام العامر الذكي للجرد</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">منصّة جرد الهواتف والإلكترونيات — الإصدار التجريبي</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-xl bg-muted p-1.5">
            {[
              { key: "employee", label: "موظف جرد" },
              { key: "admin", label: "إدارة" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setRole(tab.key)}
                aria-pressed={role === tab.key}
                className={`rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                  role === tab.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-foreground">اسم المستخدم</label>
              <div className="relative">
                <User aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  dir="ltr"
                  className="focus-ring h-12 w-full rounded-xl border border-input bg-background pl-4 pr-11 text-left text-sm text-foreground"
                  placeholder="employee.id"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">كلمة المرور</label>
              <div className="relative">
                <Lock aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  dir="ltr"
                  className="focus-ring h-12 w-full rounded-xl border border-input bg-background pl-11 pr-11 text-left text-sm text-foreground"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  <span className="sr-only">{showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}</span>
                </button>
              </div>
            </div>
          </div>

          {!geoRequired ? (
            <div className="mt-5 rounded-2xl border border-border bg-muted-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-card text-muted-foreground shadow-sm">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">التحقق من الموقع الجغرافي</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">تم تعطيل هذا الشرط مؤقتاً من إعدادات النظام.</p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`mt-5 rounded-2xl border p-4 transition-colors duration-300 ${
                geo === "verified" ? "border-success-30 bg-success-soft" : geo === "failed" ? "border-alert-25 bg-alert-soft" : "border-border bg-muted-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    geo === "verified" ? "bg-success text-success-foreground" : geo === "failed" ? "bg-alert text-alert-foreground" : "bg-card text-muted-foreground shadow-sm"
                  }`}
                >
                  {geo === "verified" ? <Check className="size-4" /> : geo === "checking" ? <Loader2 className="size-4 animate-spin" /> : geo === "failed" ? <TriangleAlert className="size-4" /> : <MapPin className="size-4" />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">التحقق من الموقع الجغرافي (GPS)</p>
                  <p className={`mt-0.5 text-xs leading-relaxed ${geo === "failed" ? "text-alert" : "text-muted-foreground"}`}>
                    {geoDetail ?? (geo === "checking" ? "جارٍ قراءة إحداثيات الجهاز ومطابقتها مع نطاق الفرع…" : `مطلوب لتأكيد تواجدك ضمن ${BRANCH.radiusMeters} متر من الفرع.`)}
                  </p>

                  {geo !== "idle" && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className={`h-full rounded-full transition-all duration-200 ease-out ${geo === "verified" ? "bg-success" : geo === "failed" ? "bg-alert" : "bg-primary"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  {(geo === "idle" || geo === "failed") && (
                    <button
                      type="button"
                      onClick={handleValidateClick}
                      className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-3.5 text-xs font-medium text-background transition hover:opacity-90"
                    >
                      {geo === "failed" ? <Navigation className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                      {geo === "failed" ? "إعادة المحاولة" : "تحقّق الآن"}
                    </button>
                  )}
                </div>
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-2 border-t border-border pt-3 text-2xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={simulateOutOfRange}
                  onChange={(e) => setSimulateOutOfRange(e.target.checked)}
                  className="size-3.5"
                />
                محاكاة: الجهاز خارج نطاق الفرع (لأغراض العرض التوضيحي)
              </label>
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-alert-25 bg-alert-soft px-3.5 py-2.5 text-xs font-medium text-alert">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition enabled:hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جارٍ التحقق من الموقع…
              </>
            ) : (
              <>
                تسجيل الدخول
                <ArrowLeft className="size-4" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">الدخول مقيّد بالموقع والصلاحية — جميع العمليات مُدقّقة ومسجّلة.</p>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  شاشة جرد الموظف — إدخال هجين + تقدّم ديناميكي (FR5) + إرسال (FR9)      */
/* ======================================================================= */

function EmployeeScreen({ items, setItems, branchRace, showRace, lockAfterSubmit, onSubmit }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const completed = useMemo(() => items.filter((i) => (i.kind === "accessory" ? i.verified : i.counted === i.expected)).length, [items]);
  const percent = Math.round((completed / items.length) * 100);
  const locked = submitted && lockAfterSubmit;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const done = item.kind === "accessory" ? item.verified : item.counted === item.expected;
      if (filter === "pending" && done) return false;
      if (filter === "device" && item.kind !== "device") return false;
      if (filter === "accessory" && item.kind !== "accessory") return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q) || item.model.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    });
  }, [items, query, filter]);

  function step(id, delta) {
    if (locked) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, counted: Math.max(0, Math.min(item.expected + 20, item.counted + delta)) } : item)));
  }

  function setCounted(id, value) {
    if (locked) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, counted: Number.isNaN(value) ? 0 : Math.max(0, value) } : item)));
  }

  function toggleVerified(id) {
    if (locked) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, verified: !item.verified, counted: !item.verified ? item.expected : item.counted } : item)));
  }

  function matchAll(id) {
    if (locked) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, counted: item.expected } : item)));
  }

  function resetCount() {
    setItems((prev) => prev.map((i) => ({ ...i, counted: 0, verified: false })));
    setSubmitted(false);
  }

  function handleSubmitInventory() {
    if (percent !== 100 || submitting || submitted) return;
    setSubmitting(true);
    setTimeout(() => {
      const points = items.reduce((sum, i) => sum + (i.kind === "device" ? i.counted : i.verified ? i.expected : 0), 0);
      setSubmitting(false);
      setSubmitted(true);
      onSubmit(points);
    }, 900);
  }

  const ammanBranch = branchRace.find((b) => b.id === "amman");
  const irbidBranch = branchRace.find((b) => b.id === "irbid");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-8 pt-5 sm:px-6">
      {/* شريط التقدّم */}
      <section className="sticky top-16 z-20 -mx-4 mb-5 border-b border-border bg-background-85 px-4 pb-4 pt-1 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">جرد اليوم — فرع عمّان</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {formatNumber(completed)}
                <span className="text-base font-normal text-muted-foreground"> / {formatNumber(items.length)} صنف</span>
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-2xl font-semibold tabular-nums ${percent === 100 ? "text-success" : "text-primary"}`}>{percent}%</span>
              <span className="text-xs text-muted-foreground">مكتمل</span>
            </div>
          </div>

          <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="نسبة إنجاز الجرد"
              className={`h-full rounded-full transition-all duration-500 ease-out ${percent === 100 ? "bg-success" : "bg-primary"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </section>

      {locked && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-success-30 bg-success-soft p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success text-success-foreground">
            <BadgeCheck className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">تم إرسال الجرد للإدارة</p>
            <p className="text-xs text-muted-foreground">القائمة مقفلة الآن حسب إعداد "قفل الجرد بعد الإرسال". اضغط تصفير الجرد لبدء جولة جديدة.</p>
          </div>
        </div>
      )}

      {/* بحث وفلاتر */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالاسم أو الموديل أو رمز SKU…"
            className="focus-ring h-11 w-full rounded-xl border border-input bg-card px-4 pe-11 text-sm text-foreground"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { key: "all", label: "الكل" },
            { key: "pending", label: "غير مكتمل" },
            { key: "device", label: "أجهزة" },
            { key: "accessory", label: "ملحقات" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                filter === f.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* الأصناف */}
      <ul className="space-y-3">
        {visible.map((item) => {
          const done = item.kind === "accessory" ? item.verified : item.counted === item.expected;
          const diff = item.counted - item.expected;
          const touched = item.counted > 0 || item.verified;

          return (
            <li key={item.id} className={`rounded-2xl border bg-card p-4 shadow-sm transition-colors ${done ? "border-success-35" : "border-border"} ${locked ? "opacity-70" : ""}`}>
              <div className="flex items-start gap-3">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${done ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>
                  {done ? <BadgeCheck className="size-5" /> : item.kind === "device" ? <Smartphone className="size-5" /> : <Package className="size-5" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">{item.name}</h3>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground" dir="ltr">{item.model}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-2xs font-medium text-muted-foreground" dir="ltr">{item.sku}</span>
                  </div>

                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {item.location} • المسجّل: <span className="font-medium text-foreground">{formatNumber(item.expected)}</span>
                  </p>

                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1">
                      <button
                        onClick={() => step(item.id, -1)}
                        disabled={locked}
                        aria-label={`إنقاص كمية ${item.name}`}
                        className="flex size-9 items-center justify-center rounded-lg text-foreground transition hover:bg-muted active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="size-4" />
                      </button>
                      <input
                        value={item.counted}
                        onChange={(e) => setCounted(item.id, Number.parseInt(e.target.value, 10))}
                        disabled={locked}
                        inputMode="numeric"
                        aria-label={`الكمية المعدودة لـ ${item.name}`}
                        className="w-14 bg-transparent text-center text-base font-semibold tabular-nums text-foreground outline-none"
                      />
                      <button
                        onClick={() => step(item.id, 1)}
                        disabled={locked}
                        aria-label={`زيادة كمية ${item.name}`}
                        className="flex size-9 items-center justify-center rounded-lg text-foreground transition hover:bg-muted active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>

                    {item.kind === "device" ? (
                      <div className="flex items-center gap-2">
                        {touched && diff !== 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-alert-soft px-2.5 py-1 text-2xs font-semibold text-alert">
                            <TriangleAlert className="size-3" />
                            فرق {diff > 0 ? "+" : "−"}{formatNumber(Math.abs(diff))}
                          </span>
                        )}
                        {done && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-2xs font-semibold text-success">
                            <Check className="size-3" /> مطابق
                          </span>
                        )}
                        <button
                          onClick={() => matchAll(item.id)}
                          disabled={locked}
                          className="rounded-lg border border-border px-2.5 py-1.5 text-2xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          مطابقة
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer select-none items-center gap-2.5">
                        <span className="text-xs font-medium text-muted-foreground">تأكيد التوفّر</span>
                        <Toggle checked={item.verified} disabled={locked} onClick={() => toggleVerified(item.id)} label={`تأكيد توفّر ${item.name}`} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">لا توجد أصناف مطابقة لبحثك.</p>
      )}

      {showRace && (
        <div className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="size-3.5 text-primary" />
            <p className="text-xs font-semibold text-foreground">سباق الفروع — تحفيزي</p>
          </div>
          {[ammanBranch, irbidBranch].filter(Boolean).map((b) => (
            <div key={b.id} className="mb-2 last:mb-0">
              <div className="mb-1 flex items-center justify-between text-2xs text-muted-foreground">
                <span>{b.name}</span>
                <span className="tabular-nums text-foreground">{formatNumber(b.counted)} / {formatNumber(b.total)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((b.counted / b.total) * 100)}%`, transition: "width .8s ease-out" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <button
          onClick={resetCount}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <RotateCcw className="size-4" />
          تصفير الجرد
        </button>
        <button
          onClick={handleSubmitInventory}
          disabled={percent !== 100 || submitting || submitted}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition enabled:hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> جارٍ الإرسال…
            </>
          ) : submitted ? (
            <>
              <Check className="size-4" /> تم الإرسال
            </>
          ) : (
            <>
              <Check className="size-4" />
              {percent === 100 ? "إرسال الجرد للإدارة" : `تبقّى ${formatNumber(items.length - completed)} صنف`}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  لوحة تحكم الإدارة — سباق الفروع + تنبؤات الذكاء الاصطناعي (FR9, FR10)  */
/* ======================================================================= */

function AdminDashboard({ items, branchRace, alerts, aiAlertsEnabled, onManage, onGeneratePO }) {
  const [raceReady, setRaceReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRaceReady(true), 150);
    return () => clearTimeout(t);
  }, []);

  const completed = items.filter((i) => (i.kind === "accessory" ? i.verified : i.counted === i.expected)).length;
  const percent = Math.round((completed / items.length) * 100);

  const variances = useMemo(
    () =>
      items
        .filter((i) => i.counted > 0 && i.counted !== i.expected)
        .map((i) => ({ ...i, diff: i.counted - i.expected }))
        .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
        .slice(0, 4),
    [items],
  );

  const stockValue = items.reduce((sum, i) => sum + i.expected * i.price, 0);
  const sortedRace = [...branchRace].sort((a, b) => b.counted - a.counted);
  const leaderId = sortedRace[0]?.id;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6 sm:px-6">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">لوحة تحكم الإدارة</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">نظرة عامة على الجرد</h1>
        </div>
        <button onClick={onManage} className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90">
          إدارة النظام
          <ArrowLeft className="size-4" />
        </button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <section className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm md:col-span-2 md:row-span-2">
          <CircularProgress percent={percent} />
          <div className="w-full space-y-2 border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">أصناف مكتملة</span>
              <span className="font-semibold text-foreground">{formatNumber(completed)} / {formatNumber(items.length)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">فروق مرصودة</span>
              <span className="font-semibold text-alert">{formatNumber(variances.length)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">قيمة المخزون</span>
              <span className="font-semibold text-foreground" dir="ltr">{formatNumber(stockValue)} JOD</span>
            </div>
          </div>
        </section>

        {[
          { label: "الأجهزة المجرودة", value: formatNumber(items.filter((i) => i.kind === "device").reduce((s, i) => s + i.counted, 0)), icon: Boxes, hint: "قطعة" },
          { label: "موظفون نشطون", value: "٤", icon: Users, hint: "على الأرض الآن" },
          { label: "متوسط زمن الصنف", value: "٤٨ث", icon: Clock, hint: "أسرع بـ 12% من الأمس" },
          { label: "دقة الجرد", value: "٩٦٪", icon: Activity, hint: "آخر 7 أيام" },
        ].map((kpi) => (
          <article key={kpi.label} className="rounded-3xl border border-border bg-card p-5 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
              <kpi.icon className="size-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{kpi.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
          </article>
        ))}

        {/* سباق الفروع */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm md:col-span-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-primary" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-foreground">سباق الفروع</h2>
            </div>
            <span className="text-xs text-muted-foreground">تحديث مباشر</span>
          </div>

          <div className="mt-5 space-y-5">
            {branchRace.map((b, idx) => {
              const p = Math.round((b.counted / b.total) * 100);
              const lead = b.id === leaderId;
              return (
                <div key={b.id}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
                      <span className="text-sm font-medium text-foreground">{b.name}</span>
                      {lead && <span className="rounded-full bg-success-soft px-2 py-0.5 text-2xs font-semibold text-success">المتصدّر</span>}
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {formatNumber(b.counted)}
                      <span className="text-muted-foreground"> / {formatNumber(b.total)}</span>
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${lead ? "bg-primary" : "bg-primary-35"}`}
                      style={{ width: raceReady ? `${p}%` : "0%", transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${idx * 160}ms` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-5 rounded-xl bg-muted px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground">
            {sortedRace[0]?.name} يتقدّم بفارق {formatNumber(Math.max(0, (sortedRace[0]?.counted ?? 0) - (sortedRace[1]?.counted ?? 0)))} قطعة — كل عملية "إرسال جرد" من موظف تُضيف نقاطاً مباشرة هنا.
          </p>
        </section>

        {/* تنبؤات الذكاء الاصطناعي */}
        <section className="rounded-3xl border border-alert-30 bg-card p-6 shadow-sm md:col-span-2 md:row-span-2">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-alert-soft text-alert">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">تنبؤات الذكاء الاصطناعي</h2>
              <p className="text-2xs text-muted-foreground">TensorFlow.js — انحدار خطي لآخر 14 يوماً</p>
            </div>
          </div>

          {!aiAlertsEnabled ? (
            <p className="mt-5 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">التنبؤات معطّلة من إعدادات النظام حالياً.</p>
          ) : (
            <>
              <ul className="mt-5 space-y-3">
                {alerts.map((a) => (
                  <li key={a.id} className="rounded-2xl border border-alert-20 bg-alert-soft-60 p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{a.item}</p>
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-alert px-2 py-0.5 text-2xs font-bold text-alert-foreground">
                        <TrendingDown className="size-3" />
                        {a.daysLeft} أيام
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.note}</p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-card">
                        <div className="h-full rounded-full bg-alert" style={{ width: raceReady ? `${a.confidence}%` : "0%", transition: "width 1s ease-out" }} />
                      </div>
                      <span className="text-2xs font-semibold tabular-nums text-alert">{a.confidence}%</span>
                    </div>
                  </li>
                ))}
              </ul>

              <button onClick={onGeneratePO} className="mt-4 h-10 w-full rounded-xl border border-alert-30 text-xs font-semibold text-alert transition hover:bg-alert-soft">
                إنشاء أمر شراء مقترح
              </button>
            </>
          )}
        </section>

        {/* جدول الفروق */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm md:col-span-4">
          <h2 className="text-sm font-semibold text-foreground">أكبر الفروق في الجرد الحالي</h2>
          {variances.length === 0 ? (
            <p className="mt-5 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">لا توجد فروق مسجّلة — ابدأ الجرد من لوحة الموظف لرؤية النتائج هنا.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {variances.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{v.name}</p>
                    <p className="truncate text-xs text-muted-foreground" dir="ltr">{v.sku}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm tabular-nums">
                    <span className="text-muted-foreground">{formatNumber(v.expected)} → {formatNumber(v.counted)}</span>
                    <span className={`w-14 rounded-lg px-2 py-1 text-center text-xs font-bold ${v.diff > 0 ? "bg-success-soft text-success" : "bg-alert-soft text-alert"}`}>
                      {v.diff > 0 ? "+" : "−"}{formatNumber(Math.abs(v.diff))}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  لوحة إدارة النظام — مستخدمون / أصناف / إعدادات                         */
/* ======================================================================= */

function AdminPanel({ items, setItems, users, setUsers, settings, toggleSetting }) {
  const [tab, setTab] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", role: "موظف جرد", branch: "عمّان" });
  const [newItem, setNewItem] = useState({ name: "", model: "", sku: "", kind: "device", expected: "", price: "" });

  const nav = [
    { key: "users", label: "المستخدمون", icon: Users, hint: "الصلاحيات والفروع" },
    { key: "inventory", label: "الأصناف", icon: Boxes, hint: "كتالوج المخزون" },
    { key: "settings", label: "إعدادات النظام", icon: Settings2, hint: "الجرد والموقع" },
  ];

  function toggleUser(id) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === "نشط" ? "موقوف" : "نشط" } : u)));
  }
  function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }
  function adjustExpected(id, delta) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, expected: Math.max(0, i.expected + delta) } : i)));
  }
  function addUser(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!newUser.name.trim()) return;
    setUsers((prev) => [...prev, { id: `u-${Date.now()}`, name: newUser.name.trim(), role: newUser.role, branch: newUser.branch, status: "نشط", lastSeen: "الآن" }]);
    setNewUser({ name: "", role: "موظف جرد", branch: "عمّان" });
    setShowAddUser(false);
  }
  function addItem(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!newItem.name.trim() || !newItem.sku.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: `itm-${Date.now()}`,
        name: newItem.name.trim(),
        model: newItem.model.trim() || newItem.name.trim(),
        sku: newItem.sku.trim().toUpperCase(),
        kind: newItem.kind,
        expected: Number(newItem.expected) || 0,
        counted: 0,
        verified: false,
        price: Number(newItem.price) || 0,
        location: "غير محدد",
      },
    ]);
    setNewItem({ name: "", model: "", sku: "", kind: "device", expected: "", price: "" });
    setShowAddItem(false);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-6 sm:px-6">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition hover:bg-muted lg:hidden" aria-label="فتح قائمة الإدارة">
            <Menu className="size-4" />
          </button>
          <div>
            <p className="text-xs font-medium text-muted-foreground">إدارة النظام</p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{nav.find((n) => n.key === tab)?.label}</h1>
          </div>
        </div>
        {tab !== "settings" && (
          <button
            onClick={() => (tab === "users" ? setShowAddUser((v) => !v) : setShowAddItem((v) => !v))}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-92"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">{tab === "users" ? "مستخدم جديد" : "صنف جديد"}</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        )}
      </header>

      <div className="admin-grid">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 rounded-3xl border border-border bg-card p-3 shadow-sm">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setTab(n.key)}
                aria-current={tab === n.key ? "page" : undefined}
                className={`mb-1 flex w-full items-start gap-3 rounded-2xl p-3 text-start transition ${tab === n.key ? "bg-brand-soft text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
              >
                <n.icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{n.label}</span>
                  <span className="mt-0.5 block text-2xs opacity-70">{n.hint}</span>
                </span>
              </button>
            ))}

            <div className="mt-2 rounded-2xl bg-muted p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <ShieldCheck className="size-3.5 text-success" />
                حالة النظام
              </div>
              <p className="mt-1.5 text-2xs leading-relaxed text-muted-foreground">جميع الخدمات تعمل — آخر نسخة احتياطية قبل 20 دقيقة.</p>
            </div>
          </nav>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground-25" onClick={() => setSidebarOpen(false)} />
            <nav className="absolute inset-y-0 end-0 w-72 border-s border-border bg-card p-4 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">أقسام الإدارة</span>
                <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted" aria-label="إغلاق القائمة">
                  <X className="size-4" />
                </button>
              </div>
              {nav.map((n) => (
                <button
                  key={n.key}
                  onClick={() => { setTab(n.key); setSidebarOpen(false); }}
                  className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-start transition ${tab === n.key ? "bg-brand-soft text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  <n.icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="text-sm font-medium">{n.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        <div className="min-w-0">
          {tab === "users" && (
            <div className="space-y-4">
              {showAddUser && (
                <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-4">
                  <input required placeholder="اسم المستخدم" value={newUser.name} onChange={(e) => setNewUser((s) => ({ ...s, name: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && addUser(e)} className="focus-ring h-10 rounded-lg border border-input bg-background px-3 text-sm sm:col-span-2" />
                  <select value={newUser.role} onChange={(e) => setNewUser((s) => ({ ...s, role: e.target.value }))} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
                    <option>موظف جرد</option>
                    <option>مدير فرع</option>
                    <option>أمين مستودع</option>
                    <option>مديرة النظام</option>
                  </select>
                  <select value={newUser.branch} onChange={(e) => setNewUser((s) => ({ ...s, branch: e.target.value }))} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
                    <option>عمّان</option>
                    <option>إربد</option>
                  </select>
                  <div className="flex gap-2 sm:col-span-4">
                    <button type="button" onClick={addUser} className="h-9 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground">إضافة المستخدم</button>
                    <button type="button" onClick={() => setShowAddUser(false)} className="h-9 rounded-lg border border-border px-4 text-xs font-medium text-muted-foreground">إلغاء</button>
                  </div>
                </div>
              )}

              <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <table className="hidden w-full text-start sm:table">
                  <thead>
                    <tr className="border-b border-border bg-muted-50 text-xs text-muted-foreground">
                      <th className="p-4 text-start font-medium">الاسم</th>
                      <th className="p-4 text-start font-medium">الصلاحية</th>
                      <th className="p-4 text-start font-medium">الفرع</th>
                      <th className="p-4 text-start font-medium">آخر ظهور</th>
                      <th className="p-4 text-start font-medium">الحالة</th>
                      <th className="p-4 text-start font-medium"><span className="sr-only">إجراءات</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((u) => (
                      <tr key={u.id} className="text-sm transition hover:bg-muted-50">
                        <td className="p-4 font-medium text-foreground">{u.name}</td>
                        <td className="p-4 text-muted-foreground">{u.role}</td>
                        <td className="p-4 text-muted-foreground">{u.branch}</td>
                        <td className="p-4 text-muted-foreground">{u.lastSeen}</td>
                        <td className="p-4"><Toggle checked={u.status === "نشط"} onClick={() => toggleUser(u.id)} label={`تغيير حالة ${u.name}`} /></td>
                        <td className="p-4">
                          <button onClick={() => removeUser(u.id)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-alert-soft hover:text-alert" aria-label={`حذف ${u.name}`}>
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <ul className="divide-y divide-border sm:hidden">
                  {users.map((u) => (
                    <li key={u.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{u.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{u.role} • {u.branch}</p>
                          <p className="mt-0.5 text-2xs text-muted-foreground">آخر ظهور: {u.lastSeen}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Toggle checked={u.status === "نشط"} onClick={() => toggleUser(u.id)} label={`تغيير حالة ${u.name}`} />
                          <button onClick={() => removeUser(u.id)} className="rounded-lg p-2 text-muted-foreground transition hover:bg-alert-soft hover:text-alert" aria-label={`حذف ${u.name}`}>
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "inventory" && (
            <div className="space-y-4">
              {showAddItem && (
                <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:grid-cols-6">
                  <input required placeholder="اسم الصنف" value={newItem.name} onChange={(e) => setNewItem((s) => ({ ...s, name: e.target.value }))} className="focus-ring h-10 rounded-lg border border-input bg-background px-3 text-sm sm:col-span-2" />
                  <input placeholder="الموديل" value={newItem.model} onChange={(e) => setNewItem((s) => ({ ...s, model: e.target.value }))} dir="ltr" className="focus-ring h-10 rounded-lg border border-input bg-background px-3 text-sm sm:col-span-2" />
                  <input required placeholder="SKU" value={newItem.sku} onChange={(e) => setNewItem((s) => ({ ...s, sku: e.target.value }))} dir="ltr" className="focus-ring h-10 rounded-lg border border-input bg-background px-3 text-sm" />
                  <select value={newItem.kind} onChange={(e) => setNewItem((s) => ({ ...s, kind: e.target.value }))} className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
                    <option value="device">جهاز</option>
                    <option value="accessory">ملحق</option>
                  </select>
                  <input type="number" min="0" placeholder="الكمية" value={newItem.expected} onChange={(e) => setNewItem((s) => ({ ...s, expected: e.target.value }))} className="focus-ring h-10 rounded-lg border border-input bg-background px-3 text-sm" />
                  <input type="number" min="0" placeholder="السعر (JOD)" value={newItem.price} onChange={(e) => setNewItem((s) => ({ ...s, price: e.target.value }))} className="focus-ring h-10 rounded-lg border border-input bg-background px-3 text-sm" />
                  <div className="flex gap-2 sm:col-span-6">
                    <button type="button" onClick={addItem} className="h-9 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground">إضافة الصنف</button>
                    <button type="button" onClick={() => setShowAddItem(false)} className="h-9 rounded-lg border border-border px-4 text-xs font-medium text-muted-foreground">إلغاء</button>
                  </div>
                </div>
              )}

              <ul className="grid gap-3 sm:grid-cols-2">
                {items.map((i) => (
                  <li key={i.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        {i.kind === "device" ? <Smartphone className="size-4" /> : <Package className="size-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{i.name}</p>
                        <p className="truncate text-xs text-muted-foreground" dir="ltr">{i.sku} • {i.price} JOD</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-xs text-muted-foreground">المخزون المسجّل</span>
                          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
                            <button onClick={() => adjustExpected(i.id, -1)} className="flex size-7 items-center justify-center rounded-md text-foreground transition hover:bg-muted" aria-label={`إنقاص مخزون ${i.name}`}>−</button>
                            <span className="w-10 text-center text-sm font-semibold tabular-nums text-foreground">{formatNumber(i.expected)}</span>
                            <button onClick={() => adjustExpected(i.id, 1)} className="flex size-7 items-center justify-center rounded-md text-foreground transition hover:bg-muted" aria-label={`زيادة مخزون ${i.name}`}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-3">
              <SettingRow title="إلزام التحقق الجغرافي" desc={`منع تسجيل الدخول خارج نطاق ${BRANCH.radiusMeters} متراً من الفرع.`} checked={settings.geoRequired} onToggle={() => toggleSetting("geoRequired")} />
              <SettingRow title="قفل الجرد بعد الإرسال" desc="لا يمكن للموظف تعديل الأرقام بعد رفعها للإدارة." checked={settings.lockAfterSubmit} onToggle={() => toggleSetting("lockAfterSubmit")} />
              <SettingRow title="تنبيهات الذكاء الاصطناعي" desc="إشعار فوري عند توقّع نقص مخزون خلال 7 أيام عبر TensorFlow.js." checked={settings.aiAlerts} onToggle={() => toggleSetting("aiAlerts")} />
              <SettingRow title="سباق الفروع للموظفين" desc="إظهار ترتيب الفروع للموظفين أثناء الجرد لتحفيز الإنجاز." checked={settings.showRaceToEmployees} onToggle={() => toggleSetting("showRaceToEmployees")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingRow({ title, desc, checked, onToggle }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      </div>
      <Toggle checked={checked} onClick={onToggle} label={title} />
    </div>
  );
}

/* ======================================================================= */
/*  التطبيق الرئيسي — تنقّل + صلاحيات (RBAC) + حالة مشتركة                 */
/* ======================================================================= */

export default function App() {
  const [screen, setScreen] = useState("login");
  const [role, setRole] = useState("employee");
  const [items, setItems] = useState(initialInventory);
  const [users, setUsers] = useState(initialUsers);
  const [branchRace, setBranchRace] = useState([
    { id: "amman", name: "فرع عمّان", counted: 178, total: 220 },
    { id: "irbid", name: "فرع إربد", counted: 141, total: 220 },
  ]);
  const [settings, setSettings] = useState({ geoRequired: true, lockAfterSubmit: true, aiAlerts: true, showRaceToEmployees: false });
  const [toast, setToast] = useState(null);

  const toggleSetting = useCallback((key) => setSettings((s) => ({ ...s, [key]: !s[key] })), []);

  const handleLogin = useCallback((r) => {
    setRole(r);
    setScreen(r === "admin" ? "admin" : "employee");
  }, []);

  const handleLogout = useCallback(() => setScreen("login"), []);

  const handleSubmitInventory = useCallback((points) => {
    setBranchRace((prev) => prev.map((b) => (b.id === "amman" ? { ...b, counted: Math.min(b.total, b.counted + points) } : b)));
    setToast({ type: "submit", points });
  }, []);

  const handleGeneratePO = useCallback(() => {
    setToast({ type: "po", count: initialAlerts.length });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(t);
  }, [toast]);

  const tabs =
    role === "admin"
      ? [
          { key: "employee", label: "جرد الموظف", icon: ClipboardList },
          { key: "admin", label: "لوحة الإدارة", icon: LayoutGrid },
          { key: "panel", label: "إدارة النظام", icon: Settings2 },
        ]
      : [{ key: "employee", label: "جرد الموظف", icon: ClipboardList }];

  if (screen === "login") {
    return (
      <div dir="rtl" lang="ar" className="asis-root">
        <GlobalStyles />
        <LoginScreen onLogin={handleLogin} geoRequired={settings.geoRequired} />
        {toast && <ToastBanner toast={toast} />}
      </div>
    );
  }

  const activeScreen = role === "employee" ? "employee" : screen;

  return (
    <div dir="rtl" lang="ar" className="asis-root">
      <GlobalStyles />
      <header className="sticky top-0 z-30 border-b border-border bg-background-85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-2xs font-bold text-primary-foreground">AS</span>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-tight text-foreground">نظام العامر الذكي</p>
              <p className="text-2xs leading-tight text-muted-foreground">ASIS — {role === "admin" ? "لوحة الإدارة" : "إدارة مخزون الإلكترونيات"}</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 rounded-xl bg-muted p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setScreen(t.key)}
                aria-label={t.label}
                aria-current={activeScreen === t.key ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${activeScreen === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <t.icon className="size-3.5" aria-hidden="true" />
                <span className="hidden md:inline">{t.label}</span>
              </button>
            ))}
          </nav>

          <button onClick={handleLogout} className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:text-alert" aria-label="تسجيل الخروج">
            <LogOut className="size-4 -scale-x-100" />
          </button>
        </div>
      </header>

      <main className="pb-16">
        {activeScreen === "employee" && (
          <EmployeeScreen items={items} setItems={setItems} branchRace={branchRace} showRace={settings.showRaceToEmployees} lockAfterSubmit={settings.lockAfterSubmit} onSubmit={handleSubmitInventory} />
        )}
        {activeScreen === "admin" && role === "admin" && (
          <AdminDashboard items={items} branchRace={branchRace} alerts={initialAlerts} aiAlertsEnabled={settings.aiAlerts} onManage={() => setScreen("panel")} onGeneratePO={handleGeneratePO} />
        )}
        {activeScreen === "panel" && role === "admin" && (
          <AdminPanel items={items} setItems={setItems} users={users} setUsers={setUsers} settings={settings} toggleSetting={toggleSetting} />
        )}
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background-90 backdrop-blur-xl">
        <p className="mx-auto max-w-6xl px-4 py-3.5 text-center text-2xs font-medium text-muted-foreground sm:px-6 sm:text-xs">
          مديرة قسم التكنولوجيا والمعلومات: آية الشنتير
        </p>
      </footer>

      {toast && <ToastBanner toast={toast} />}
    </div>
  );
}
