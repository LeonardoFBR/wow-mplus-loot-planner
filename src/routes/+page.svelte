<script lang="ts">
	import SlotSelector from '$lib/components/SlotSelector.svelte';
	import Filters from '$lib/components/Filters.svelte';
	import ResultsList from '$lib/components/ResultsList.svelte';
	import { calculateDungeonResults, isItemEligible } from '$lib/utils';
	import lootData from '$lib/data/loot.json';
	import { browser } from '$app/environment';
	import { WOW_CLASSES } from '$lib/constants';

	function loadState() {
		if (!browser) return { selectedClass: '', selectedSpec: '', selectedSlots: [] };
		try {
			const saved = localStorage.getItem('wow-planner-state');
			if (saved) {
				const state = JSON.parse(saved);
				return {
					selectedClass: state.selectedClass ?? '',
					selectedSpec: state.selectedSpec ?? '',
					selectedSlots: state.selectedSlots ?? []
				};
			}
		} catch {}
		return { selectedClass: '', selectedSpec: '', selectedSlots: [] };
	}

	const initialState = loadState();
	let selectedClass = $state(initialState.selectedClass);
	let selectedSpec = $state(initialState.selectedSpec);
	let selectedSlots = $state<string[]>(initialState.selectedSlots);

	let saveTimeout: ReturnType<typeof setTimeout>;
	let hasInteracted = $state(false);

	function handleClassChange(classId: string) {
		hasInteracted = true;
		selectedClass = classId;
		selectedSpec = '';
	}

	function handleSpecChange(specId: string) {
		hasInteracted = true;
		selectedSpec = specId;
	}

	function handleSlotToggle(slotId: string) {
		hasInteracted = true;
		if (selectedSlots.includes(slotId)) {
			selectedSlots = selectedSlots.filter((s) => s !== slotId);
		} else {
			selectedSlots = [...selectedSlots, slotId];
		}
	}

	$effect(() => {
		const state = { selectedClass, selectedSpec, selectedSlots };
		if (!hasInteracted || !browser) return;
		clearTimeout(saveTimeout);
		saveTimeout = setTimeout(() => {
			localStorage.setItem('wow-planner-state', JSON.stringify(state));
		}, 300);
	});

	let results = $derived(
		calculateDungeonResults(lootData.dungeons, selectedSlots, selectedClass, selectedSpec)
	);

	$effect(() => {
		const cls = selectedClass ? WOW_CLASSES.find(c => c.id === selectedClass) : undefined;
		const spec = cls && selectedSpec ? cls.specs.find(s => s.id === selectedSpec) : undefined;
		console.log('=== DEBUG: Items elegibles por clase/spec ===');
		console.log(`Clase: ${cls?.name || 'Ninguna'} | Spec: ${spec?.name || 'Ninguna'}`);
		for (const dungeon of lootData.dungeons) {
			const eligible = dungeon.loot.filter(item => isItemEligible(item, cls, spec));
			console.log(`📦 ${dungeon.name} (${eligible.length} items):`);
			for (const item of eligible) {
				console.log(`   - ${item.name}`);
			}
		}
		console.log('===========================');
	});

	let isReady = $derived(selectedSlots.length > 0);
</script>

<div class="app-container">
  <header class="app-header">
    <div class="header-content">
      <div class="header-title">
        <span class="header-icon">⚔️</span>
        <div>
          <h1 class="font-display text-2xl md:text-3xl font-bold text-white tracking-wide">M+ Loot Planner</h1>
          <p class="text-surface-300 text-sm mt-1">Find the best Mythic+ dungeon for your missing gear slots</p>
        </div>
      </div>
      <div class="header-badge">
        <span class="badge-dot" class:active={isReady}></span>
        <span class="text-xs text-surface-300">
          {#if isReady}
            Live calculation
          {:else}
            Configure to start
          {/if}
        </span>
      </div>
    </div>
  </header>

  <main class="main-content">
    <aside class="sidebar">
      <Filters {selectedClass} {selectedSpec} onclasschange={handleClassChange} onspecchange={handleSpecChange} />
      <SlotSelector {selectedSlots} ontoggle={handleSlotToggle} />
    </aside>

    <div class="results-area">
      <ResultsList {results} />

      {#if results.length > 0}
        <div class="tips-card">
          <h3 class="font-display text-sm font-semibold text-wow-arcane-light mb-2">How it works</h3>
          <ul class="tips-list">
            <li>Dungeons only drop items compatible with your <strong>class/spec</strong></li>
            <li>Probability = chance of a compatible drop being one you need</li>
            <li>Formula: <code>desired / total_eligible</code></li>
          </ul>
        </div>
      {/if}
    </div>
  </main>

  <footer class="app-footer">
    <p>WoW M+ Loot Planner — Data is sample/example. Not affiliated with Blizzard Entertainment.</p>
  </footer>
</div>

<style>
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: radial-gradient(ellipse at 20% 0%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 100%, rgba(245, 158, 11, 0.05) 0%, transparent 50%), var(--color-surface-900);
  }

  .app-header {
    border-bottom: 1px solid var(--color-surface-700);
    background: rgba(12, 10, 20, 0.8);
    position: sticky;
    top: 0;
    z-index: 50;
  }

  @media (min-width: 768px) {
    .app-header {
      backdrop-filter: blur(12px);
    }
  }

  .header-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .header-icon {
    font-size: 28px;
  }

  .header-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--color-surface-800);
    border: 1px solid var(--color-surface-600);
    border-radius: 20px;
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-surface-400);
    transition: all 0.3s ease;
  }

  .badge-dot.active {
    background: var(--color-wow-fel);
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }

  .main-content {
    flex: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 32px 24px 32px 304px;
    width: 100%;
    box-sizing: border-box;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: fixed;
    top: 120px;
    left: calc((100vw - 1280px) / 2 + 24px);
    width: 260px;
    max-height: calc(100vh - 140px);
    overflow-y: auto;
    z-index: 10;
  }

  .results-area {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
    margin-top: -5px;
  }

  .tips-card {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 12px;
    padding: 16px;
  }

  .tips-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .tips-list li {
    font-size: 13px;
    color: var(--color-surface-300);
    padding-left: 16px;
    position: relative;
  }

  .tips-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--color-wow-arcane);
  }

  .tips-list li strong {
    color: #e2dff0;
  }

  .tips-list li code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    background: var(--color-surface-600);
    padding: 2px 6px;
    border-radius: 4px;
    color: var(--color-wow-gold-light);
  }

  .app-footer {
    border-top: 1px solid var(--color-surface-700);
    padding: 16px 24px;
    text-align: center;
  }

  .app-footer p {
    font-size: 12px;
    color: var(--color-surface-300);
  }

  @media (max-width: 900px) {
    .main-content {
      padding: 24px 16px;
    }

    .sidebar {
      position: static;
      width: 100%;
      margin-bottom: 20px;
    }
  }

  @media (max-width: 600px) {
    .main-content {
      padding: 16px 12px;
    }

    .sidebar {
      gap: 12px;
    }
  }
</style>
