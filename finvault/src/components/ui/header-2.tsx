'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';

export function Header({ onSignIn, onGetStarted }) {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const links = [
		{ label: 'Features', href: '#features' },
		{ label: 'Portfolio', href: '#portfolio' },
		{ label: 'Insights', href: '#insights' },
	];

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => { document.body.style.overflow = ''; };
	}, [open]);

	return (
		<header
			className={cn(
				'sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-2xl md:border md:transition-all md:duration-500',
				{
					'backdrop-blur-xl border-white/[0.07] md:top-4 md:max-w-4xl md:shadow-lg md:shadow-black/20':
						scrolled && !open,
					'': open,
				},
			)}
			style={{
				background: scrolled && !open
					? 'rgba(6,6,8,0.85)'
					: open
						? 'rgba(6,6,8,0.95)'
						: 'transparent',
				transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			}}
		>
			<nav
				className={cn(
					'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:duration-500',
					{ 'md:px-3': scrolled },
				)}
			>
				{/* Logo */}
				<button 
					onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
					className="font-display font-800 text-lg tracking-tight select-none cursor-pointer hover:opacity-80 transition-opacity"
				>
					FIN<span className="text-gold-400">VAULT</span>
				</button>

				{/* Desktop nav */}
				<div className="hidden items-center gap-1 md:flex">
					{links.map((link, i) => (
						<a
							key={i}
							className="px-3 py-1.5 rounded-lg text-sm font-body font-400 text-cream/60 hover:text-cream hover:bg-white/[0.06] transition-all duration-200"
							href={link.href}
						>
							{link.label}
						</a>
					))}
					<div className="w-px h-5 bg-white/10 mx-2" />
					<Button
						variant="outline"
						className="text-cream/70 border-white/10 hover:bg-white/[0.06] hover:border-white/20 hover:text-cream font-body text-sm h-8 px-3"
						onClick={onSignIn}
					>
						Sign In
					</Button>
					<Button
						className="bg-gold-400 text-black hover:bg-gold-500 font-display font-600 text-sm h-8 px-4 ml-1"
						onClick={onGetStarted}
					>
						Get Started
					</Button>
				</div>

				{/* Mobile toggle */}
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden border-white/10 relative h-9 w-9"
				>
					<MenuToggleIcon open={open} className="size-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" duration={300} />
				</Button>
			</nav>

			{/* Mobile menu */}
			<div
				className={cn(
					'fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden md:hidden',
					open ? 'block' : 'hidden',
				)}
				style={{ background: 'rgba(6,6,8,0.98)', backdropFilter: 'blur(24px)' }}
			>
				<div className="flex h-full w-full flex-col justify-between gap-y-2 p-6">
					<div className="grid gap-y-1 mt-4">
						{links.map((link) => (
							<a
								key={link.label}
								className="flex items-center px-4 py-3 rounded-xl text-base font-body text-cream/70 hover:bg-white/[0.06] hover:text-cream transition-all"
								href={link.href}
								onClick={() => setOpen(false)}
							>
								{link.label}
							</a>
						))}
					</div>
					<div className="flex flex-col gap-3 pb-8">
						<Button variant="outline" className="w-full text-cream/70 border-white/10 hover:bg-white/[0.06] font-body h-12" onClick={() => { setOpen(false); onSignIn?.() }}>
							Sign In
						</Button>
						<Button className="w-full bg-gold-400 text-black hover:bg-gold-500 font-display font-600 h-12" onClick={() => { setOpen(false); onGetStarted?.() }}>
							Get Started
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
