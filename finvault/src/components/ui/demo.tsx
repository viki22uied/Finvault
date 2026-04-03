import React from 'react';
import { Header } from "@/components/ui/header-2";

export default function Demo() {
	return (
		<div className="w-full relative z-50">
			<Header />

			<main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12 relative z-10 text-white">
				<h1 className="text-3xl font-bold mb-4">Demo Page</h1>
				<p className="mb-4">This demonstrates the Shadcn UI sticky header component with scrolling.</p>
				<div  className="space-y-4 mb-10">
					<div className="bg-white/10 h-6 w-4/6 rounded-md" />
					<div className="bg-white/10 h-6 w-1/2 rounded-md" />
				</div>
                <div className="h-64 rounded-xl overflow-hidden mb-10 border border-white/10 relative">
                     {/* Image placeholder with unsplash image as requested */}
                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Data visualization" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                       <h2 className="text-xl font-bold">Unsplash Stock Example</h2>
                    </div>
                </div>

				{Array.from({ length: 7 }).map((_, i) => (
					<div key={i} className="space-y-3 mb-10">
						<div className="bg-white/5 h-4 w-full rounded-md" />
						<div className="bg-white/5 h-4 w-full rounded-md" />
						<div className="bg-white/5 h-4 w-full rounded-md" />
						<div className="bg-white/5 h-4 w-1/2 rounded-md" />
					</div>
				))}
			</main>
		</div>
	);
}
