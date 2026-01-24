import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { SettingsProvider } from "../contexts/SettingsContext";

export const Route = createRootRoute({
    component: () => (
        <SettingsProvider>
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
                <header className="bg-white dark:bg-gray-800 shadow-md">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-start h-16">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-8">
                                    <Link
                                        to="/"
                                        className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        activeProps={{
                                            className:
                                                "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300",
                                        }}
                                    >
                                        Quiz
                                    </Link>
                                    <Link
                                        to="/charts"
                                        className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        activeProps={{
                                            className:
                                                "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300",
                                        }}
                                    >
                                        Charts
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                        activeProps={{
                                            className:
                                                "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300",
                                        }}
                                    >
                                        Settings
                                    </Link>
                                </div>
                                <a
                                    href="https://fantaph.codes"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    My Website
                                </a>
                            </div>
                        </div>
                    </nav>
                </header>
                <main>
                    <Outlet />
                </main>
                <Analytics />
                <SpeedInsights />
            </div>
        </SettingsProvider>
    ),
});
