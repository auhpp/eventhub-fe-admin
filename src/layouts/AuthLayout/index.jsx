import React from "react";
import Header from "../AuthHeader";
import { Toaster } from "sonner";

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
            <Header />

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
                    {children}
                </div>
                <Toaster position="top-center" richColors
                    toastOptions={{
                        classNames: {
                            error: "bg-red-100 text-white",

                        },
                    }}
                />
            </main>
        </div>
    );
};

export default AuthLayout;