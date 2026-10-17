// app/[locale]/(auth)/signin/components/PasswordLogin.tsx
"use client";

import { useState, useCallback, memo } from "react";
import { Undo2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorAlert from "@/components/ui/ErrorAlert";

interface PasswordLoginProps {
  locale: string;
  loading: boolean;
  error: string | null;
  onSubmit: (mobile: string, password: string) => void;
  onBack: () => void;
  t: any;
}

const PasswordLogin = memo(function PasswordLogin({
  locale,
  loading,
  error,
  onSubmit,
  onBack,
  t,
}: PasswordLoginProps) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(mobile, password);
    },
    [mobile, password, onSubmit]
  );

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

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

      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t.Enterpassword}
        label={t.Password}
        showPasswordToggle
        showPassword={showPassword}
        onTogglePassword={togglePassword}
        required
        disabled={loading}
      />

      <Button
        type="submit"
        disabled={loading}
        loading={loading}
        loadingText={t.Signingin}
        fullWidth
      >
        {t.SignIn}
      </Button>
    </form>
  );
});

export default PasswordLogin;