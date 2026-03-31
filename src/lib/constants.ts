import type { GearSlot, WoWClass } from './types';

import classData from './data/classes.json';

export const GEAR_SLOTS: GearSlot[] = [
	{ id: 'head', name: 'Head', icon: '👑', gridArea: 'head' },
	{ id: 'neck', name: 'Neck', icon: '📿', gridArea: 'neck' },
	{ id: 'shoulders', name: 'Shoulders', icon: '🛡️', gridArea: 'shoulders' },
	{ id: 'back', name: 'Back', icon: '🧣', gridArea: 'back' },
	{ id: 'chest', name: 'Chest', icon: '👕', gridArea: 'chest' },
	{ id: 'wrist', name: 'Wrist', icon: '⌚', gridArea: 'wrist' },
	{ id: 'hands', name: 'Hands', icon: '🧤', gridArea: 'hands' },
	{ id: 'waist', name: 'Waist', icon: '🔗', gridArea: 'waist' },
	{ id: 'legs', name: 'Legs', icon: '👖', gridArea: 'legs' },
	{ id: 'feet', name: 'Feet', icon: '👢', gridArea: 'feet' },
	{ id: 'ring', name: 'Ring', icon: '💍', gridArea: 'ring' },
	{ id: 'trinket', name: 'Trinket', icon: '✨', gridArea: 'trinket' },
	{ id: 'main-hand', name: '1H Weapon', icon: '⚔️', gridArea: 'weapon' },
	{ id: 'two-hand', name: '2H Weapon', icon: '🔨', gridArea: 'weapon' },
	{ id: 'shield', name: 'Shield', icon: '🛡️', gridArea: 'shield' },
	{ id: 'off-hand', name: 'Off-hand', icon: '🔮', gridArea: 'offhand' },
	{ id: 'ranged', name: 'Ranged', icon: '🏹', gridArea: 'ranged' }
];

export const WOW_CLASSES: WoWClass[] = classData as WoWClass[];
