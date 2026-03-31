<script lang="ts">
	import { WOW_CLASSES } from '$lib/constants';
	import type { WoWClass } from '$lib/types';

	interface Props {
		selectedClass: string;
		selectedSpec: string;
		onclasschange: (classId: string) => void;
		onspecchange: (specId: string) => void;
	}

	let { selectedClass, selectedSpec, onclasschange, onspecchange }: Props = $props();

	let currentClass: WoWClass | undefined = $derived(
		WOW_CLASSES.find((c) => c.id === selectedClass)
	);
</script>

<div class="filters-panel">
	<h2 class="font-display text-xl font-semibold text-wow-gold mb-5 tracking-wide">
		Class & Spec
	</h2>

	<div class="space-y-5">
		<div>
			<label for="class-select" class="block text-sm font-medium text-surface-300 mb-2">
				Character Class
			</label>
			<div class="select-wrapper">
				<select
					id="class-select"
					value={selectedClass}
					onchange={(e) => onclasschange((e.target as HTMLSelectElement).value)}
					class="wow-select"
				>
					<option value="">Select a class...</option>
					{#each WOW_CLASSES as cls}
						<option value={cls.id} style="color: {cls.color}">{cls.name}</option>
					{/each}
				</select>
			</div>
		</div>

		{#if currentClass}
			<div>
				<label for="spec-select" class="block text-sm font-medium text-surface-300 mb-2">
					Specialization
				</label>
				<div class="select-wrapper">
					<select
						id="spec-select"
						value={selectedSpec}
						onchange={(e) => onspecchange((e.target as HTMLSelectElement).value)}
						class="wow-select"
					>
						<option value="">Select a spec...</option>
						{#each currentClass.specs as spec}
							<option value={spec.id}>{spec.name}</option>
						{/each}
					</select>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.filters-panel {
		background: linear-gradient(135deg, var(--color-surface-700) 0%, var(--color-surface-800) 100%);
		border: 1px solid var(--color-surface-500);
		border-radius: 16px;
		padding: 24px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.select-wrapper {
		position: relative;
	}

	.wow-select {
		width: 100%;
		padding: 10px 14px;
		background: var(--color-surface-600);
		border: 2px solid var(--color-surface-400);
		border-radius: 10px;
		color: #e2dff0;
		font-size: 14px;
		font-family: var(--font-body);
		cursor: pointer;
		appearance: none;
		transition: all 0.2s ease;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a78bfa' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 12px center;
		padding-right: 36px;
	}

	.wow-select:hover {
		border-color: var(--color-wow-arcane);
		background-color: var(--color-surface-500);
	}

	.wow-select:focus {
		outline: none;
		border-color: var(--color-wow-arcane-light);
		box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
	}

	.wow-select option {
		background: var(--color-surface-700);
		color: #e2dff0;
		padding: 8px;
	}

	.spec-grid {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.spec-button {
		flex: 1;
		min-width: 80px;
		padding: 10px 16px;
		background: var(--color-surface-600);
		border: 2px solid var(--color-surface-400);
		border-radius: 10px;
		color: #e2dff0;
		font-size: 13px;
		font-weight: 500;
		font-family: var(--font-body);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: center;
	}

	.spec-button:hover {
		border-color: var(--class-color, var(--color-wow-arcane));
		background: var(--color-surface-500);
		color: var(--class-color, var(--color-wow-arcane-light));
		box-shadow: 0 0 12px color-mix(in srgb, var(--class-color, var(--color-wow-arcane)) 30%, transparent);
	}
</style>
