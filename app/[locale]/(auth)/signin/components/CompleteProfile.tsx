// app/[locale]/(auth)/signin/components/CompleteProfile.tsx
'use client';

import { useState, useCallback, memo } from 'react';
import { User } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorAlert from '@/components/ui/ErrorAlert';

interface CompleteProfileProps {
    locale: string;
    loading: boolean;
    error: string | null;
    onSubmit: (data: {
        firstName: string;
        lastName: string;
        password: string;
        address: string;
        birthdate: string;
    }) => void;
    t: any;
}

const CompleteProfile = memo(function CompleteProfile({
    locale,
    loading,
    error,
    onSubmit,
    t,
}: CompleteProfileProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        address: '',
        birthdate: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setValidationError(null);
    }, []);

    const togglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();

            if (formData.password !== formData.confirmPassword) {
                setValidationError(t.Passwordsdonotmatch);
                return;
            }

            if (formData.password.length < 8) {
                setValidationError(t.Passwordmustbeatleast8characters);
                return;
            }

            const { confirmPassword, ...submitData } = formData;
            onSubmit(submitData);
        },
        [formData, onSubmit, t]
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                    <User size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t.CompleteYourProfile}
                </h3>
                <p className="text-gray-600 text-sm">
                    {t.Fillinthedetailsbelowtocompleteregistration}
                </p>
            </div>

            <ErrorAlert message={error || validationError} />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    label={t.FirstName}
                    required
                    disabled={loading}
                />

                <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    label={t.LastName}
                    required
                    disabled={loading}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        label={t.Password}
                        showPasswordToggle
                        showPassword={showPassword}
                        onTogglePassword={togglePassword}
                        required
                        disabled={loading}
                        minLength={8}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {t.Passwordmustbeatleast8characters}
                    </p>
                </div>

                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    label={t.ConfirmPassword}
                    required
                    disabled={loading}
                />
            </div>

            <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                label={t.Address}
                required
                disabled={loading}
            />

            <Input
                id="birthdate"
                name="birthdate"
                type="date"
                value={formData.birthdate}
                onChange={handleChange}
                label={t.BirthDate}
                max={new Date().toISOString().split('T')[0]}
                required
                disabled={loading}
            />

            <Button
                type="submit"
                disabled={loading}
                loading={loading}
                loadingText={t.Saving}
                fullWidth
            >
                {t.CompleteRegistration}
            </Button>
        </form>
    );
});

export default CompleteProfile;