export interface LootItem {
	name: string;
	slot: string;
	armorType?: string;
	type?: string;
	stats?: string[];
	roles?: string[];
}

export interface Dungeon {
	name: string;
	loot: LootItem[];
}

export interface DungeonResult {
	name: string;
	probability: number;
	desiredItems: number;
	totalItems: number;
	matchingSlots: string[];
}

export interface GearSlot {
	id: string;
	name: string;
	icon: string;
	gridArea: string;
}

export type Spec = {
	id: string;
	name: string;
	role?: string;
	stat: string;
	weaponTypes: string[];
};

export interface WoWClass {
	id: string;
	name: string;
	color: string;
	armorType: string;
	specs: Spec[];
}
