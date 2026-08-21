import type { Dungeon, DungeonResult, WoWClass, LootItem, Spec } from './types';
import { WOW_CLASSES } from './constants';

export function calculateDungeonResults(
	dungeons: Dungeon[],
	selectedSlots: string[],
	selectedClassId?: string,
	selectedSpecId?: string
): DungeonResult[] {
	if (selectedSlots.length === 0) return [];

	const selectedClass = selectedClassId ? WOW_CLASSES.find(c => c.id === selectedClassId) : undefined;
	const selectedSpec = selectedClass && selectedSpecId ? selectedClass.specs.find(s => s.id === selectedSpecId) : undefined;

	const results: DungeonResult[] = [];

	for (const dungeon of dungeons) {
		const classEligibleLoot = dungeon.loot.filter((item) => isItemEligible(item, selectedClass, selectedSpec));
		const eligibleLoot = classEligibleLoot.filter((item) => selectedSlots.includes(item.slot));

		const totalItems = classEligibleLoot.length;
		const desiredItems = eligibleLoot.length;

		if (totalItems === 0 || desiredItems === 0) continue;

		const matchingSlots = [...new Set(eligibleLoot.map((i) => i.slot))];
		const pSuccess = desiredItems / totalItems;

		results.push({
			name: dungeon.name,
			probability: pSuccess,
			desiredItems,
			totalItems,
			matchingSlots
		});
	}

	return results.sort((a, b) => b.probability - a.probability);
}

function getItemStats(item: LootItem): string[] {
	if (item.stats && Array.isArray(item.stats)) {
		return item.stats.map(s => s.toLowerCase());
	}
	return [];
}

function getClassWeaponTypes(cls: WoWClass, spec?: Spec): string[] {
	if (spec?.weaponTypes) {
		return spec.weaponTypes;
	}
	const allTypes = new Set<string>();
	for (const s of cls.specs) {
		if (s.weaponTypes) {
			for (const t of s.weaponTypes) {
				allTypes.add(t);
			}
		}
	}
	return Array.from(allTypes);
}

const PRIMARY_STATS = ['strength', 'agility', 'intellect'];

function hasPrimaryStat(stats: string[]): boolean {
	return stats.some(s => PRIMARY_STATS.includes(s));
}

export function isItemEligible(item: LootItem, cls?: WoWClass, spec?: Spec): boolean {
	if (!cls) return true;

	// Check role eligibility if specified on item (e.g. Tank/Healer trinkets)
	if (item.roles && item.roles.length > 0) {
		if (spec?.role) {
			if (!item.roles.includes(spec.role)) return false;
		} else {
			if (!cls.specs.some(s => s.role && item.roles!.includes(s.role))) return false;
		}
	}

	// Armor type check
	if (item.armorType && item.armorType !== 'accessory' && item.armorType !== 'weapon') {
		return item.armorType === cls.armorType;
	}

	// Weapon check
	if (item.armorType === 'weapon') {
		if (!item.type) return false;

		const weaponTypes = getClassWeaponTypes(cls, spec);
		const normalizedItemType = item.type.toLowerCase().replace(/s$/, '').replace(/ weapon$/, '');
		const matchesType = weaponTypes.some(wt => {
			const normalizedWt = wt.toLowerCase().replace(/s$/, '').replace(/ weapon$/, '');
			return normalizedWt === normalizedItemType || wt === item.type;
		});

		if (!matchesType) return false;

		const itemStats = getItemStats(item);
		if (spec?.stat) {
			if (itemStats.length > 0 && hasPrimaryStat(itemStats)) {
				return itemStats.includes(spec.stat.toLowerCase());
			}
		} else if (cls) {
			const clsStats = new Set(cls.specs.map(s => s.stat.toLowerCase()));
			if (itemStats.length > 0 && hasPrimaryStat(itemStats)) {
				return itemStats.some(stat => clsStats.has(stat));
			}
		}

		return true;
	}

	// Accessory check (e.g. Trinkets with specific primary stats)
	if (item.armorType === 'accessory') {
		const itemStats = getItemStats(item);
		if (itemStats.length > 0 && hasPrimaryStat(itemStats)) {
			if (spec?.stat) {
				return itemStats.includes(spec.stat.toLowerCase());
			} else if (cls) {
				const clsStats = new Set(cls.specs.map(s => s.stat.toLowerCase()));
				return itemStats.some(stat => clsStats.has(stat));
			}
		}
	}

	return true;
}
