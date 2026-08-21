<script lang="ts">
	import type { DungeonResult } from '$lib/types';
	import { getSlotName } from '$lib/constants';

	interface Props {
		results: DungeonResult[];
	}

	let { results }: Props = $props();

	function getProbabilityColor(prob: number): string {
		if (prob >= 0.7) return '#10b981';
		if (prob >= 0.5) return '#f59e0b';
		if (prob >= 0.3) return '#f97316';
		return '#ef4444';
	}

	function getProbabilityLabel(prob: number): string {
		if (prob >= 0.7) return 'Excellent';
		if (prob >= 0.5) return 'Good';
		if (prob >= 0.3) return 'Moderate';
		return 'Low';
	}
</script>

<div class="results-panel">
	<h2 class="font-display text-xl font-semibold text-wow-gold mb-2 tracking-wide">
		Dungeon Rankings
	</h2>		<p class="text-surface-300 text-sm mb-5">
			Best dungeons for your selected slots — ranked by probability
			{#if results.length > 0}
				<span class="dungeon-count">({results.length} dungeon{results.length !== 1 ? 's' : ''} match)</span>
			{/if}
		</p>

	{#if results.length === 0}
		<div class="empty-state">
			<div class="empty-icon">⚔️</div>
			<p class="text-surface-300 text-sm">
				Select your class, spec, and missing gear slots to see dungeon recommendations
			</p>
		</div>
	{:else}
		<div class="results-list">
			{#each results as result, i}
				{@const color = getProbabilityColor(result.probability)}
				{@const label = getProbabilityLabel(result.probability)}
				<div
					class="result-card"
					class:best={i === 0}
					style="--prob-color: {color}"
				>
					{#if i === 0}
						<div class="best-badge">BEST</div>
					{/if}

					<div class="card-header">
						<div class="dungeon-rank">#{i + 1}</div>
						<div class="dungeon-info">
							<h3 class="dungeon-name">{result.name}</h3>
							<p class="dungeon-meta">
								{result.desiredItems} of {result.totalItems} items match your slots
							</p>
						</div>
					</div>

					<div class="probability-section">
						<div class="prob-header">
							<span class="prob-value" style="color: {color}">
								{(result.probability * 100).toFixed(1)}%
							</span>
							<span class="prob-label" style="color: {color}">
								{label}
							</span>
						</div>
						<div class="prob-bar-track">
							<div
								class="prob-bar-fill"
								style="width: {result.probability * 100}%; background: {color}"
							></div>
						</div>
						<p class="prob-detail">
							Chance of getting a useful item if one drops
						</p>
					</div>

					{#if result.matchingSlots.length > 0}
						<div class="matching-slots">
							<span class="slots-label">Covers:</span>
							<div class="slots-list">
							{#each result.matchingSlots as slot}
								<span class="slot-tag">{getSlotName(slot)}</span>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.results-panel {
		background: linear-gradient(135deg, var(--color-surface-700) 0%, var(--color-surface-800) 100%);
		border: 1px solid var(--color-surface-500);
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 40px 20px;
		text-align: center;
	}

	.empty-icon {
		font-size: 40px;
		opacity: 0.5;
	}

	.results-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.result-card {
		background: var(--color-surface-600);
		border: 1px solid var(--color-surface-400);
		border-radius: 12px;
		padding: 16px;
		position: relative;
		transition: all 0.2s ease;
	}

	.result-card:hover {
		border-color: var(--prob-color);
		background: var(--color-surface-500);
	}

	.result-card.best {
		border-color: var(--color-wow-gold);
		background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%);
		box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
	}

	.best-badge {
		position: absolute;
		top: -8px;
		right: 16px;
		background: linear-gradient(135deg, var(--color-wow-gold) 0%, var(--color-wow-gold-dark) 100%);
		color: #000;
		font-size: 10px;
		font-weight: 700;
		padding: 3px 10px;
		border-radius: 4px;
		letter-spacing: 1px;
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 14px;
	}

	.dungeon-rank {
		background: var(--color-surface-400);
		color: var(--color-surface-300);
		font-size: 12px;
		font-weight: 700;
		padding: 4px 8px;
		border-radius: 6px;
		flex-shrink: 0;
	}

	.result-card.best .dungeon-rank {
		background: rgba(245, 158, 11, 0.2);
		color: var(--color-wow-gold);
	}

	.dungeon-info {
		flex: 1;
		min-width: 0;
	}

	.dungeon-name {
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
		color: #fff;
		margin-bottom: 2px;
	}

	.dungeon-meta {
		font-size: 12px;
		color: var(--color-surface-300);
	}

	.probability-section {
		margin-bottom: 12px;
	}

	.prob-header {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 6px;
	}

	.prob-value {
		font-size: 24px;
		font-weight: 700;
		font-family: var(--font-display);
	}

	.prob-label {
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.prob-bar-track {
		height: 6px;
		background: var(--color-surface-400);
		border-radius: 3px;
		overflow: hidden;
		margin-bottom: 6px;
	}

	.prob-bar-fill {
		height: 100%;
		border-radius: 3px;
		transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.prob-detail {
		font-size: 11px;
		color: var(--color-surface-300);
	}

	.matching-slots {
		border-top: 1px solid var(--color-surface-400);
		padding-top: 10px;
		margin-top: 2px;
	}

	.slots-label {
		font-size: 11px;
		color: var(--color-surface-300);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		display: block;
		margin-bottom: 6px;
	}

	.slots-list {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}

	.slot-tag {
		font-size: 11px;
		padding: 3px 8px;
		background: rgba(139, 92, 246, 0.15);
		border: 1px solid rgba(139, 92, 246, 0.3);
		border-radius: 4px;
		color: var(--color-wow-arcane-light);
	}

	.dungeon-count {
		color: var(--color-wow-gold);
		font-weight: 500;
	}
</style>
