"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Send, CheckCircle2, X } from "lucide-react";
import Loader from "./Loader"
// ─── Types ─────────────────────────────────────────────────────────────────────

interface Campus {
  city: string;
  address: string;
}

interface Combo {
  id: string;
  name: string;
  code: string;
  icon: string;
  tags: string[];
  description: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  dob: string;
  campus: string;
  combo: string;
  minor: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const CAMPUSES: Campus[] = [
  { city: "Hà Nội", address: "Khu CNC Hòa Lạc" },
  { city: "TP.HCM", address: "Đường D1, Quận 9" },
  { city: "Đà Nẵng", address: "FPT City" },
  { city: "Cần Thơ", address: "Khu đô thị Hưng Phú" },
  { city: "Quy Nhơn", address: "Khu công nghệ cao" },
];

const COMBOS: Combo[] = [
  {
    id: "SE_AI",
    name: "Kỹ thuật phần mềm + AI",
    code: "SE + AI/ML",
    icon: "💻",
    tags: ["Hot", "Lập trình", "Data"],
    description:
      "Học sâu về phát triển phần mềm kết hợp trí tuệ nhân tạo. Sau tốt nghiệp có thể làm AI Engineer, ML Engineer, Backend Developer.",
  },
  {
    id: "BA_DS",
    name: "Kinh doanh + Khoa học dữ liệu",
    code: "BA + DS",
    icon: "📊",
    tags: ["Phân tích", "Business"],
    description:
      "Kết hợp tư duy kinh doanh với kỹ năng phân tích dữ liệu. Phù hợp vị trí Business Analyst, Data Analyst, Product Manager.",
  },
  {
    id: "GD_UX",
    name: "Thiết kế đồ họa + UX/UI",
    code: "GD + UX",
    icon: "🎨",
    tags: ["Sáng tạo", "Design", "Hot"],
    description:
      "Nền tảng design vững chắc kết hợp tư duy UX. Phù hợp cho Product Designer, UI/UX Designer tại các công ty tech.",
  },
];

const MINORS: Record<string, string[]> = {
  SE_AI: ["Blockchain", "Cloud Computing", "Embedded Systems", "Game Development"],
  BA_DS: ["FinTech", "Supply Chain", "Healthcare Analytics", "E-commerce"],
  GD_UX: ["Motion Design", "3D & AR/VR", "Brand Identity", "Service Design"],
};

// ─── Step Indicator ────────────────────────────────────────────────────────────

const STEP_LABELS = ["Cá nhân", "Campus", "Ngành combo", "Xác nhận"];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mt-3">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isDone = step < current;
        const isActive = step === current;
        return (
          <React.Fragment key={step}>
            <div
              className={`h-2 rounded-full transition-all duration-300 ${isDone
                ? "bg-orange-500 w-6"
                : isActive
                  ? "bg-orange-500 w-8"
                  : "bg-gray-200 w-6"
                }`}
            />
          </React.Fragment>
        );
      })}
      <span className="text-xs text-gray-400 ml-1">
        Bước {current}/{total}
      </span>
    </div>
  );
}

// ─── Layout wrapper ────────────────────────────────────────────────────────────

function FormCard({
  stepLabel,
  title,
  description,
  footer,
  children,
  stepKey,
}: {
  stepLabel: string;
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
  stepKey: string | number;
}) {
  const variants = {
    hidden: { opacity: 0, x: 40 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="px-6 pt-6 pb-0">
        <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">
          {stepLabel}
        </p>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      <div className="px-6 py-5 min-h-[320px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepKey}
            variants={variants}
            initial="hidden"
            animate="enter"
            exit="exit"
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        {footer}
      </div>
    </div>
  );
}

// ─── Shared UI ─────────────────────────────────────────────────────────────────

function Btn({
  children,
  onClick,
  primary,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 h-10 px-5 rounded-xl text-sm font-medium transition-all
        ${primary
          ? "bg-orange-500 hover:bg-orange-600 text-white"
          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
        }
        disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "h-10 w-full rounded-xl border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-400";

// ─── Step 1: Personal Info ─────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
  onNext,
}: {
  data: FormState;
  onChange: (patch: Partial<FormState>) => void;
  onNext: () => void;
}) {
  return (
    <FormCard
      stepLabel="Bước 1"
      title="Thông tin cá nhân"
      description="Điền đầy đủ để chúng tôi liên hệ khi có kết quả"
      stepKey="step1"
      footer={
        <>
          <span className="text-xs text-gray-400">Thông tin được bảo mật</span>
          <Btn primary onClick={onNext} disabled={!data.name || !data.email}>
            Tiếp theo <ArrowRight size={14} />
          </Btn>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Họ và tên" required>
          <input
            className={inputCls}
            placeholder="Nguyễn Văn A"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email" required>
            <input
              className={inputCls}
              type="email"
              placeholder="you@fpt.edu.vn"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
            />
          </Field>
          <Field label="Số điện thoại">
            <input
              className={inputCls}
              placeholder="0901234567"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Ngày sinh">
          <input
            className={inputCls}
            type="date"
            value={data.dob}
            onChange={(e) => onChange({ dob: e.target.value })}
          />
        </Field>
      </div>
    </FormCard>
  );
}

// ─── Step 2: Campus ────────────────────────────────────────────────────────────

function Step2({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: FormState;
  onChange: (patch: Partial<FormState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <FormCard
      stepLabel="Bước 2"
      title="Chọn campus"
      description="Bạn muốn học tại campus nào?"
      stepKey="step2"
      footer={
        <>
          <Btn onClick={onBack}>
            <ArrowLeft size={14} /> Quay lại
          </Btn>
          <Btn primary onClick={onNext} disabled={!data.campus}>
            Tiếp theo <ArrowRight size={14} />
          </Btn>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-2.5">
        {CAMPUSES.map((c) => (
          <button
            key={c.city}
            onClick={() => onChange({ campus: c.city })}
            className={`text-left p-3 rounded-xl border-2 transition-all ${data.campus === c.city
              ? "border-orange-500 bg-orange-50"
              : "border-gray-200 hover:border-orange-200"
              }`}
          >
            <p className="text-sm font-semibold text-gray-900">{c.city}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-snug">{c.address}</p>
          </button>
        ))}
      </div>
    </FormCard>
  );
}

// ─── Step 3: Combo ─────────────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: FormState;
  onChange: (patch: Partial<FormState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <FormCard
      stepLabel="Bước 3"
      title="Chọn ngành combo"
      description="Chọn 1 combo ngành phù hợp với định hướng của bạn"
      stepKey="step3"
      footer={
        <>
          <Btn onClick={onBack}>
            <ArrowLeft size={14} /> Quay lại
          </Btn>
          <Btn primary onClick={onNext} disabled={!data.combo}>
            Chọn môn phụ <ArrowRight size={14} />
          </Btn>
        </>
      }
    >
      <div className="flex flex-col gap-2">
        {COMBOS.map((c) => {
          const selected = data.combo === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onChange({ combo: c.id, minor: "" })}
              className={`text-left rounded-xl border-2 transition-all overflow-hidden ${selected ? "border-orange-500" : "border-gray-200 hover:border-orange-200"
                }`}
            >
              <div className="flex items-start gap-3 p-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-lg flex-shrink-0">
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{c.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.code}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${selected ? "bg-orange-500 border-orange-500" : "border-gray-300"
                    }`}
                >
                  {selected && <span className="text-white text-xs">✓</span>}
                </div>
              </div>
              {selected && (
                <div className="px-3 pb-3 pt-0">
                  <p className="text-xs text-gray-600 bg-orange-50 rounded-lg p-2.5 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </FormCard>
  );
}

// ─── Step 3.5: Minor ──────────────────────────────────────────────────────────

function Step35({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: FormState;
  onChange: (patch: Partial<FormState>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const combo = COMBOS.find((c) => c.id === data.combo)!;
  const options = MINORS[data.combo] ?? [];

  return (
    <FormCard
      stepLabel="Bước 3 · Môn phụ"
      title="Chọn môn phụ"
      description={`Chuyên sâu dành riêng cho combo ${combo?.name}`}
      stepKey="step35"
      footer={
        <>
          <Btn onClick={onBack}>
            <ArrowLeft size={14} /> Đổi ngành
          </Btn>
          <Btn primary onClick={onNext}>
            Xem lại <ArrowRight size={14} />
          </Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2.5">
        {options.map((m) => (
          <button
            key={m}
            onClick={() => onChange({ minor: m })}
            className={`text-left p-3.5 rounded-xl border-2 transition-all ${data.minor === m
              ? "border-orange-500 bg-orange-50"
              : "border-gray-200 hover:border-orange-200"
              }`}
          >
            <p className="text-sm font-semibold text-gray-900">{m}</p>
            <p className="text-xs text-gray-400 mt-0.5">Chuyên sâu {m.toLowerCase()}</p>
          </button>
        ))}
      </div>
    </FormCard>
  );
}

// ─── Step 4: Review ────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function Step4({
  data,
  onSubmit,
  onBack,
}: {
  data: FormState;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const combo = COMBOS.find((c) => c.id === data.combo)!;
  return (
    <FormCard
      stepLabel="Bước 4"
      title="Xác nhận đăng ký"
      description="Kiểm tra lại trước khi gửi"
      stepKey="step4"
      footer={
        <>
          <Btn onClick={onBack}>
            <ArrowLeft size={14} /> Quay lại
          </Btn>
          <Btn primary onClick={onSubmit}>
            <Send size={14} /> Gửi đăng ký
          </Btn>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="bg-gray-50 rounded-xl p-4">
          <ReviewRow label="Họ và tên" value={data.name} />
          <ReviewRow label="Email" value={data.email} />
          {data.phone && <ReviewRow label="Điện thoại" value={data.phone} />}
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <ReviewRow label="Campus" value={data.campus} />
          <ReviewRow
            label="Ngành combo"
            value={
              <span className="inline-flex items-center gap-1.5 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-lg">
                {combo?.icon} {combo?.name}
              </span>
            }
          />
        </div>
      </div>
    </FormCard>
  );
}

// ─── Success ───────────────────────────────────────────────────────────────────

function SuccessScreen({ name, onRedirect }: { name: string; onRedirect: () => void }) {

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center min-h-[350px] flex flex-col items-center justify-center">
      {/* Bỏ hết điều kiện loading, chỉ render giao diện chúc mừng */}
      <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 size={32} className="text-orange-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Đăng ký thành công!</h2>
      <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
        Cảm ơn bạn <strong className="text-gray-800">{name}</strong>! Hệ thống đang xử lý hồ sơ dữ liệu liên kết của bạn.
      </p>
      <button
        onClick={onRedirect} // ← Gọi thẳng, không delay ở đây nữa
        className="mt-6 inline-flex items-center gap-1.5 h-10 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all"
      >
        Tiến vào Hub ngay <ArrowRight size={14} />
      </button>
    </div>
  );
}
// ─── Root Component ───────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

interface FPTComboFormProps {
  onClose?: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function FPTComboForm({ onClose, onLoginSuccess }: FPTComboFormProps) {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    campus: "",
    combo: "",
    minor: "",
  });

  const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }));
  const displayStep = step === 3.5 ? 3 : step >= 4 ? 4 : step;

  // Luồng tự động chuyển sau 4 giây ở màn hình thành công
  useEffect(() => {
    if (step === 5) {
      const timerToLoader = setTimeout(() => {
        onLoginSuccess(form.email);
      }, 4000);
      return () => clearTimeout(timerToLoader);
    }
  }, [step, form.email, onLoginSuccess]);

  const handleForceRedirect = () => {
    onLoginSuccess(form.email);
  };

  // NẾU LÀ BƯỚC 5: Chỉ render màn hình chúc mừng, KHÔNG CÓ đoạn mã render dashboard nào bên dưới nữa
  if (step === 5) {
    return (
      <div className="w-full max-w-xl mx-auto animate-fade-in">
        <SuccessScreen name={form.name} onRedirect={handleForceRedirect} />
      </div>
    );
  }

  // CÁC BƯỚC NHẬP LIỆU (1 -> 4)
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold tracking-wide">FPT</span>
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-gray-900 leading-tight">Đăng ký ngành combo</p>
          <p className="text-xs text-gray-400 mt-0.5">FPT University · Chương trình song ngành</p>
          <StepIndicator current={displayStep} total={TOTAL_STEPS} />
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Steps Handler */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <Step1 key="s1" data={form} onChange={patch} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <Step2
            key="s2"
            data={form}
            onChange={patch}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <Step3
            key="s3"
            data={form}
            onChange={patch}
            onNext={() => setStep(3.5)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 3.5 && (
          <Step35
            key="s35"
            data={form}
            onChange={patch}
            onNext={() => setStep(4)}
            onBack={() => setStep(3)}
          />
        )}
        {step === 4 && (
          <Step4
            key="s4"
            data={form}
            onSubmit={() => setStep(5)}
            onBack={() => setStep(3.5)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}