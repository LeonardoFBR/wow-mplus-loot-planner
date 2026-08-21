import type { GearSlot, WoWClass } from './types';

import classData from './data/classes.json';

export const SLOT_NAME_MAP: Record<string, string> = {
	'head': 'Head',
	'neck': 'Neck',
	'shoulders': 'Shoulders',
	'back': 'Back',
	'chest': 'Chest',
	'wrist': 'Wrist',
	'hands': 'Hands',
	'waist': 'Waist',
	'legs': 'Legs',
	'feet': 'Feet',
	'ring': 'Ring',
	'trinket': 'Trinket',
	'main-hand': '1H Weapon',
	'two-hand': '2H Weapon',
	'shield': 'Shield',
	'off-hand': 'Off-hand',
	'ranged': 'Ranged'
};

export function getSlotName(slotId: string): string {
	return SLOT_NAME_MAP[slotId] ?? slotId;
}

export const GEAR_SLOTS: GearSlot[] = [
	{ id: 'head', name: 'Head', icon: '👑' },
	{ id: 'neck', name: 'Neck', icon: '📿' },
	{ id: 'shoulders', name: 'Shoulders', icon: '🛡️' },
	{ id: 'back', name: 'Back', icon: '🧣' },
	{ id: 'chest', name: 'Chest', icon: '👕' },
	{ id: 'wrist', name: 'Wrist', icon: '⌚' },
	{ id: 'hands', name: 'Hands', icon: '🧤' },
	{ id: 'waist', name: 'Waist', icon: '🔗' },
	{ id: 'legs', name: 'Legs', icon: '👖' },
	{ id: 'feet', name: 'Feet', icon: '👢' },
	{ id: 'ring', name: 'Ring', icon: '💍' },
	{ id: 'trinket', name: 'Trinket', icon: '✨' },
	{ id: 'main-hand', name: '1H Weapon', icon: '⚔️' },
	{ id: 'two-hand', name: '2H Weapon', icon: '🔨' },
	{ id: 'shield', name: 'Shield', icon: '🛡️' },
	{ id: 'off-hand', name: 'Off-hand', icon: '🔮' },
	{ id: 'ranged', name: 'Ranged', icon: '🏹' }
];

export const WOW_CLASSES: WoWClass[] = classData as WoWClass[];
