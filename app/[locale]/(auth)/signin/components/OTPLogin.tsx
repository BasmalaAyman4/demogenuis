// app/[locale]/(auth)/signin/components/OTPLogin.tsx
"use client";

import { useState, useCallback, memo } from "react";
import { Undo2, Smartphone } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";

interface OTPLoginProps {
  locale: string;
  loading: boolean;
  error: string | null;
  onSubmit: (mobile: string) => void;
  onBack: () => void;
  t: any;
}

const OTPLogin = memo(function OTPLogin({
  locale,
  loading,
  error,
  onSubmit,
  onBack,
  t,
}: OTPLoginProps) {
  const [mobile, setMobile] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(mobile);
    },
    [mobile, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Button
        type="button"
        onClick={onBack}
        variant="ghost"
        icon={<Undo2 size={18} />}
      >
        {t.Back}
      </Button>

      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <Smartphone size={28} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t.LoginwithOTP}
        </h3>
        <p className="text-gray-600 text-sm">
          {t.Wewillsendouaverificationcodetoyourmobile}
        </p>
      </div>

      <ErrorAlert message={error} />

      <Input
        id="mobile"
        type="tel"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder={locale === "ar" ? "01012345678" : "01012345678"}
        label={t.MobileNumber}
        required
        disabled={loading}
      />

      <Button
        type="submit"
        disabled={loading}
        loading={loading}
        loadingText={t.Sending}
        fullWidth
      >
        {t.SendOTP}
      </Button>
    </form>
  );
});

export default OTPLogin;