import { Card, CardContent } from "@/components/ui/card";
import SigninForm from "@/features/auth/SigninForm";

const SigninPage = () => {
    return (
        <div className="w-full max-w-md">

            {/* Welcome Text */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">
                    Đăng nhập
                </h1>
            </div>

            {/* Main Card */}
            <Card className="rounded-2xl border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <CardContent className="p-8">
                    <SigninForm />
                </CardContent>
            </Card>


        </div>
    );
};

export default SigninPage;