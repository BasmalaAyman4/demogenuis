// app/[locale]/(auth)/signin/page.tsx
import { Suspense } from 'react';
import SignInForm from './SignInForm';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { i18n, type Locale } from '@/lib/i18n/config';

interface PageParams {
    params: Promise<{
        locale: Locale;
    }>;
}

export default async function SignInPage({ params }: PageParams) {
    const { locale } = await params;
const dictionary = await getDictionary(locale);
    return (
        <>

  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 ">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {dictionary.auth.welcomeBack}
                        </h1>
                        <p className="text-gray-600">
                            {dictionary.auth.Signintocontinue}
                        </p>
                    </div>

                    <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-lg" />}>
                        <SignInForm locale={locale} t={dictionary.auth}/>
                    </Suspense>
                </div>
            </div>
        </div>
        </>
      
    );
}

export async function generateMetadata({ params }: PageParams) {
    const { locale } = await params;

    return {
        title: locale === 'ar' ? 'تسجيل الدخول' : 'Sign In',
        description:
            locale === 'ar'
                ? 'سجل الدخول إلى حسابك'
                : 'Sign in to your account',
    };
}