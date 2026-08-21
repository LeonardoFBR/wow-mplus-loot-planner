<script lang="ts">
	import { GEAR_SLOTS } from '$lib/constants';

	interface Props {
		selectedSlots: string[];
		ontoggle: (slotId: string) => void;
		onclearall?: () => void;
	}

	let { selectedSlots, ontoggle, onclearall }: Props = $props();

	const armorSlots = GEAR_SLOTS.filter(s =>
		['head', 'neck', 'shoulders', 'back', 'chest', 'wrist', 'hands', 'waist', 'legs', 'feet'].includes(s.id)
	);
	const accessorySlots = GEAR_SLOTS.filter(s =>
		['ring', 'trinket'].includes(s.id)
	);
	const weaponSlots = GEAR_SLOTS.filter(s =>
		['main-hand', 'two-hand', 'shield', 'off-hand', 'ranged'].includes(s.id)
	);

	const slotIcons: Record<string, string> = {
		head: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>',
		neck: '<path d="M12 2C8.5 2 5.5 4.5 5.5 8v2c0 1.5-.8 2.8-2 3.5V16h17v-2.5c-1.2-.7-2-2-2-3.5V8c0-3.5-3-6-6.5-6zm-3 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V8z"/>',
		shoulders: '<path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z"/>',
		back: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>',
		chest: '<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 15h2v2h-2v-2zm1-10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>',
		wrist: '<path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>',
		hands: '<path d="M18.44 17.34l-3.12-1.56c-.36-.18-.78-.18-1.14 0l-3.12 1.56c-.84.42-1.86-.12-1.86-1.02V7.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v1.17l2.17-1.09c.5-.25 1.1-.04 1.35.46.25.5.04 1.1-.46 1.35L13.5 10.25v1.09l3.17-1.59c.5-.25 1.1-.04 1.35.46.25.5.04 1.1-.46 1.35L15.5 12.5v.84l2.94-1.47c.5-.25 1.1-.04 1.35.46.25.5.04 1.1-.46 1.35L17.5 14.5v1.82c0 .9-1.02 1.44-1.86 1.02h2.8z"/>',
		waist: '<path d="M4 8h16v2H4V8zm0 6h16v2H4v-2zm2 4h12v2H6v-2zm-2-8h16v2H4v-2z"/>',
		legs: '<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83V6.31l6-2.25 6 2.25v4.78z"/>',
		feet: '<path d="M19 19H5V5h14v14zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>',
		ring: '<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3"/>',
		trinket: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
		'main-hand': '<path d="M6.92 5L5 7l3 3-3 3 1.92 2L12 10l-5.08-5zM17.08 5L12 10l5.08 5L19 13l-3-3 3-3-1.92-2z"/>',
		'two-hand': '<path d="M14.5 2.5l5 5-1.5 1.5-5-5L14.5 2.5zM3 21l5-5-1.5-1.5-5 5L3 21zM17.5 5.5l-12 12 1.5 1.5 12-12-1.5-1.5z"/>',
		shield: '<path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>',
		'off-hand': '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
		ranged: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>'
	};
</script>

<div class="gear-panel">
	<h2 class="section-title">
		<span class="title-line"></span>
		<span class="title-text">Gear Slots</span>
		<span class="title-line"></span>
	</h2>
	<p class="section-subtitle">Select slots you need upgrades for</p>

	<div class="gear-layout">
		<div class="gear-section">
			<div class="section-label">Armor</div>
			<div class="armor-grid">
				{#each armorSlots as slot}
					{@const selected = selectedSlots.includes(slot.id)}
					<button
						class="gear-slot"
						class:selected={selected}
						onclick={() => ontoggle(slot.id)}
						aria-label="{slot.name}"
						aria-pressed={selected}
					>
						<span class="slot-icon">
							<svg viewBox="0 0 24 24" fill="currentColor">{@html slotIcons[slot.id] ?? ''}</svg>
						</span>
						<span class="slot-name">{slot.name}</span>
						{#if selected}
							<span class="check-mark">✓</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<div class="gear-section">
			<div class="section-label">Accessories</div>
			<div class="accessory-grid">
				{#each accessorySlots as slot}
					{@const selected = selectedSlots.includes(slot.id)}
					<button
						class="gear-slot"
						class:selected={selected}
						onclick={() => ontoggle(slot.id)}
						aria-label="{slot.name}"
						aria-pressed={selected}
					>
						<span class="slot-icon">
							<svg viewBox="0 0 24 24" fill="currentColor">{@html slotIcons[slot.id] ?? ''}</svg>
						</span>
						<span class="slot-name">{slot.name}</span>
						{#if selected}
							<span class="check-mark">✓</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<div class="gear-section">
			<div class="section-label">Weapons</div>
			<div class="weapon-grid">
				{#each weaponSlots as slot}
					{@const selected = selectedSlots.includes(slot.id)}
					<button
						class="gear-slot"
						class:selected={selected}
						onclick={() => ontoggle(slot.id)}
						aria-label="{slot.name}"
						aria-pressed={selected}
					>
						<span class="slot-icon">
							<svg viewBox="0 0 24 24" fill="currentColor">{@html slotIcons[slot.id] ?? ''}</svg>
						</span>
						<span class="slot-name">{slot.name}</span>
						{#if selected}
							<span class="check-mark">✓</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>

	{#if selectedSlots.length > 0}
		<div class="slot-counter">
			<span class="counter-value">{selectedSlots.length}</span>
			<span class="counter-label">slot{selectedSlots.length !== 1 ? 's' : ''} selected</span>
			{#if onclearall}
				<button class="clear-btn" onclick={onclearall} aria-label="Clear all slots">
					✕ Clear
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.gear-panel {
		background: linear-gradient(160deg, var(--color-surface-700) 0%, var(--color-surface-800) 100%);
		border: 1px solid var(--color-surface-500);
		border-radius: 16px;
		padding: 16px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 4px;
	}

	.title-line {
		flex: 1;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--color-wow-gold-dark), transparent);
	}

	.title-text {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 700;
		color: var(--color-wow-gold);
		letter-spacing: 2px;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.section-subtitle {
		color: var(--color-surface-400);
		font-size: 11px;
		text-align: center;
		margin-bottom: 16px;
	}

	.gear-layout {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.gear-section {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.section-label {
		font-size: 10px;
		font-weight: 600;
		color: var(--color-surface-400);
		text-transform: uppercase;
		letter-spacing: 1.5px;
		padding-left: 2px;
	}

	.armor-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
	}

	.accessory-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 6px;
	}

	.weapon-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 6px;
	}

	.gear-slot {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		padding: 8px 2px 6px;
		background: var(--color-surface-600);
		border: 1px solid var(--color-surface-400);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		min-height: 60px;
		overflow: hidden;
	}

	.gear-slot::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.1), transparent 70%);
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.gear-slot:hover {
		border-color: var(--color-wow-gold-dark);
		background: var(--color-surface-500);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.gear-slot:hover::before {
		opacity: 1;
	}

	.gear-slot.selected {
		border-color: var(--color-wow-gold);
		background: linear-gradient(160deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.06) 100%);
		box-shadow: 0 0 16px rgba(245, 158, 11, 0.15), inset 0 1px 0 rgba(245, 158, 11, 0.1);
	}

	.slot-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		color: var(--color-surface-300);
		transition: color 0.2s ease;
	}

	.slot-icon svg {
		width: 100%;
		height: 100%;
	}

	.gear-slot.selected .slot-icon {
		color: var(--color-wow-gold);
		filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.4));
	}

	.slot-name {
		font-size: 8px;
		font-weight: 600;
		color: var(--color-surface-400);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		text-align: center;
		line-height: 1.1;
		transition: color 0.2s ease;
	}

	.gear-slot.selected .slot-name {
		color: var(--color-wow-gold-light);
	}

	.check-mark {
		position: absolute;
		top: 3px;
		right: 4px;
		font-size: 10px;
		color: var(--color-wow-gold);
		font-weight: 700;
		animation: check-pop 0.2s ease-out;
	}

	@keyframes check-pop {
		0% { transform: scale(0); opacity: 0; }
		60% { transform: scale(1.2); }
		100% { transform: scale(1); opacity: 1; }
	}

	.slot-counter {
		margin-top: 14px;
		padding: 8px 14px;
		background: var(--color-surface-600);
		border: 1px solid var(--color-surface-400);
		border-radius: 8px;
		display: flex;
		align-items: center;
		gap: 8px;
		justify-content: center;
	}

	.counter-value {
		font-family: var(--font-display);
		font-size: 18px;
		font-weight: 700;
		color: var(--color-wow-gold);
	}

	.counter-label {
		font-size: 11px;
		color: var(--color-surface-300);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.clear-btn {
		margin-left: auto;
		background: none;
		border: 1px solid var(--color-surface-400);
		color: var(--color-surface-300);
		font-size: 11px;
		padding: 4px 10px;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: var(--font-body);
	}

	.clear-btn:hover {
		border-color: #ef4444;
		color: #ef4444;
		background: rgba(239, 68, 68, 0.1);
	}

	@media (max-width: 400px) {
		.armor-grid,
		.weapon-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
