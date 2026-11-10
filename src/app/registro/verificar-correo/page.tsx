"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from "react";
import { apiFetch } from "@/utils/apiFetch";

type ResendStatus = "idle" | "sending" | "sent" | "limit" | "error";
type FeedbackKind = "success" | "danger" | "warning";
interface VerifyEmailLocationState {
    email?: string;
}
class ResendLimitError extends Error { }
function useCountdown() {
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        if (remaining <= 0) return;
        const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
        return () => window.clearTimeout(id);
    }, [remaining]);

    return { remaining, start: setRemaining };
}

async function resendConfirmationEmail(email: string): Promise<void> {
     const res = await apiFetch(
        `/auth/resendVerificationToken?email=${encodeURIComponent(email)}`,
        { method: "POST" }
    );

    if (res.status === 429) throw new ResendLimitError();
    if (!res.ok) throw new Error(`Resend failed with status ${res.status}`);
}
function maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    return `${local.slice(0, Math.min(2, local.length))}***@${domain}`;
}
const MESSAGES = {
    MSJ14: "Correo reenviado. Revisa tu bandeja de entrada y spam",
    MSJ15: "No pudimos enviar el correo. Intenta nuevamente",
    MSJ17: "Alcanzaste el límite de reenvíos. Intenta más tarde o contacta a soporte",
} as const;
const ICON_PROPS = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: "shrink-0",
} as const;
const STORAGE_KEY = "pendingVerificationEmail";
const COOLDOWN_SECONDS = 60;
const FOCUS_RING = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-300";
const BUTTON_BASE = `inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-black/15 bg-transparent px-3 text-sm text-stone-900 dark:border-white/20 dark:text-stone-100 ${FOCUS_RING}`;
const FEEDBACK_STYLES: Record<FeedbackKind, string> = {
    success: "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100",
    danger: "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100",
    warning: "bg-amber-50 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
};

function ClockIcon() {
    return (
        <svg {...ICON_PROPS}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </svg>
    );
}
function RefreshIcon() {
    return (
        <svg {...ICON_PROPS}>
            <path d="M20 11a8.1 8.1 0 0 0-15.5-2m-.5-4v4h4" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
        </svg>
    );
}

function VerificarCorreoContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<ResendStatus>("idle");
    const { remaining, start } = useCountdown();
    const [email, setEmail] = useState<string>("");
    const buttonDisabled = status === "sending" || status === "sent" || status === "limit";

    useEffect(() => {
        const fromQuery = searchParams.get("email");
        if (fromQuery) {
            setEmail(fromQuery);
            sessionStorage.setItem(STORAGE_KEY, fromQuery);
            return;
        }

        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (!stored) {
            router.replace("/registro");
            return;
        }
        setEmail(stored);
    }, [router, searchParams]);

    useEffect(() => {
        if (status === "sent" && remaining === 0) setStatus("idle");
    }, [status, remaining]);

    const buttonLabel = {
        idle: "Reenviar correo",
        sending: "Enviando…",
        sent: `Reenviar en ${remaining} s`,
        limit: "Reenviar correo",
        error: "Reintentar",
    }[status];

    const feedback: { kind: FeedbackKind; id: string; text: string } | null =
        status === "sent"
            ? { kind: "success", id: "MSJ14", text: MESSAGES.MSJ14 }
            : status === "error"
                ? { kind: "danger", id: "MSJ15", text: MESSAGES.MSJ15 }
                : status === "limit"
                    ? { kind: "warning", id: "MSJ17", text: MESSAGES.MSJ17 }
                    : null;

    const handleResend = async () => {
        if (status === "sending" || status === "sent" || status === "limit") return;

        setStatus("sending");
        try {
            await resendConfirmationEmail(email);
            setStatus("sent");
            start(COOLDOWN_SECONDS);
        } catch (err) {
            setStatus(err instanceof ResendLimitError ? "limit" : "error");
        }
    };

    return (
        <div className="flex justify-center pt-10 pb-10 ">
            <div className="flex  justify-center w-120  h-140 bg-stone-50 rounded-2xl shadow-lg shadow-mio2">
                <div className="flex flex-col items-center justify-center w-100 h-120">
                    <div
                        aria-hidden="true"
                        className="mx-auto mb-3.5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    >
                        <svg
                            width="37"
                            height="38"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="m3 7 9 6 9-6" />
                        </svg>
                    </div>
                    <h1 className="mb-1.5 text-xl font-medium">
                        Revisa tu correo
                    </h1>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                        Enviamos un enlace de activación a
                    </p>
                    <p className="mb-4 mt-0.5 text-sm font-medium">{maskEmail(email)}</p>
                    <p className="mb-2 text-[13px] text-stone-600 dark:text-stone-400">
                        ¿No lo recibiste? Revisa también spam.
                    </p>

                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={buttonDisabled}
                        aria-busy={status === "sending"}
                        className={`${BUTTON_BASE} cursor-pointer enabled:hover:bg-black/5 dark:enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        {status === "sending" ? (
                            <span
                                aria-hidden="true"
                                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:[animation-duration:2.4s]"
                            />
                        ) : status === "sent" ? (
                            <ClockIcon />
                        ) : (
                            <RefreshIcon />
                        )}
                        {buttonLabel}
                    </button>

                    <div role="status" aria-live="polite">
                        {feedback && (
                            <p
                                className={`mt-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] leading-snug ${FEEDBACK_STYLES[feedback.kind]}`}
                            >
                                {feedback.text}
                            </p>
                        )}
                    </div>

                    <hr className="h-0.5 w-100 bg-black/10 border-none my-6 dark:bg-white/15" />

                    <p className="mb-1 text-[13px] text-stone-600 dark:text-stone-400">
                        ¿Te equivocaste de correo?
                    </p>
                    <Link href="/registro" className={`text-sm text-blue-700 hover:underline dark:text-blue-300 ${FOCUS_RING}`}>
                        Corregir correo
                    </Link>

                    <Link href="/login" className={`${BUTTON_BASE} mt-3.5 hover:bg-black/5 dark:hover:bg-white/10`}  >
                        Ir a iniciar sesión
                    </Link>
                </div>

            </div>
        </div>

    )
}

export default function VerificarCorreo() {
    return (
        <Suspense fallback={null}>
            <VerificarCorreoContent />
        </Suspense>
    );
}
