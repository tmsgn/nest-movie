"use client";

export default function Loading() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <h1 className="mt-4 text-yellow-400 text-lg font-semibold">
                    Loading Episode...
                </h1>
            </div>
        </div>
    );
}