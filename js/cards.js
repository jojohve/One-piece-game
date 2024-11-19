// Funzione per generare un ID unico
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
export const availableCards = [
    { id: generateUniqueId(), name: 'Luffy', hp: 100, haki: 'Conquistatore', specialMove: { name: 'Gomu Gomu no Pistol', damage: 50 }, preferredIsland: 'Wano', fruitType: 'Paramisha' },
    { id: generateUniqueId(), name: 'Zoro', hp: 120, haki: 'Armatura', specialMove: { name: 'Santoryu', damage: 60 }, preferredIsland: 'Wano', fruitType: 'Normale' },
    { id: generateUniqueId(), name: 'Nami', hp: 80, haki: 'Osservazione', specialMove: { name: 'Clima-Tact', damage: 40 }, preferredIsland: 'Arlong Park', fruitType: 'Normale' },
    { id: generateUniqueId(), name: 'Sanji', hp: 90, haki: 'Armatura', specialMove: { name: 'Diable Jambe', damage: 45 }, preferredIsland: 'Baratie', fruitType: 'Normale' },
    { id: generateUniqueId(), name: 'Usopp', hp: 70, haki: 'Osservazione', specialMove: { name: 'Kabuto', damage: 35 }, preferredIsland: 'Enies Lobby', fruitType: 'Normale' },
    { id: generateUniqueId(), name: 'Chopper', hp: 85, haki: 'Conquistatore', specialMove: { name: 'Rumble Ball', damage: 55 }, preferredIsland: 'Regno dei Ciliegi', fruitType: 'Zoan' },
    { id: generateUniqueId(), name: 'Robin', hp: 95, haki: 'Conquistatore', specialMove: { name: 'Cien Fleur', damage: 50 }, preferredIsland: 'Ohara', fruitType: 'Paramisha' },
    { id: generateUniqueId(), name: 'Franky', hp: 110, haki: 'Armatura', specialMove: { name: 'Franky Punch', damage: 65 }, preferredIsland: 'Water Seven', fruitType: 'Normale' },
    { id: generateUniqueId(), name: 'Brook', hp: 80, haki: 'Osservazione', specialMove: { name: 'Soul Solid', damage: 40 }, preferredIsland: 'Thriller Bark', fruitType: 'Paramisha' },
    { id: generateUniqueId(), name: 'Jinbe', hp: 130, haki: 'Armatura', specialMove: { name: 'Fish-Man Karate', damage: 70 }, preferredIsland: 'Isola degli Uomini-Pesce', fruitType: 'Normale' },
    { id: generateUniqueId(), name: 'Ace', hp: 95, haki: 'Conquistatore', specialMove: { name: 'Hiken', damage: 55 }, preferredIsland: 'Marineford', fruitType: 'Rogia' },
    { id: generateUniqueId(), name: 'Shanks', hp: 120, haki: 'Conquistatore', specialMove: { name: 'Conqueror’s Slash', damage: 60 }, preferredIsland: 'Marineford', fruitType: 'Normale' },
    { id: generateUniqueId(), name: 'Big Mom', hp: 150, haki: 'Armatura', specialMove: { name: 'Prometheus Fire', damage: 70 }, preferredIsland: 'Whole Cake Island', fruitType: 'Paramisha' },
    { id: generateUniqueId(), name: 'Kaido', hp: 200, haki: 'Armatura', specialMove: { name: 'Boro Breath', damage: 100 }, preferredIsland: 'Wano', fruitType: 'Zoan' },
    { id: generateUniqueId(), name: 'Barbabianca', hp: 160, haki: 'Armatura', specialMove: { name: 'Quake Smash', damage: 80 }, preferredIsland: 'Marineford', fruitType: 'Paramisha' },
    { id: generateUniqueId(), name: 'Sabo', hp: 105, haki: 'Osservazione', specialMove: { name: 'Dragon Claw', damage: 50 }, preferredIsland: 'Dressrosa', fruitType: 'Rogia' },
    { id: generateUniqueId(), name: 'Trafalgar Law', hp: 110, haki: 'Armatura', specialMove: { name: 'Shambles', damage: 60 }, preferredIsland: 'Dressrosa', fruitType: 'Paramisha' },
    { id: generateUniqueId(), name: 'Boa Hancock', hp: 85, haki: 'Conquistatore', specialMove: { name: 'Love Arrow', damage: 50 }, preferredIsland: 'Amazon Lily', fruitType: 'Paramisha' },
    { id: generateUniqueId(), name: 'Mihawk', hp: 130, haki: 'Osservazione', specialMove: { name: 'Black Blade', damage: 75 }, preferredIsland: 'Baratie', fruitType: 'Normale' },
    { id: generateUniqueId(), name: 'Doflamingo', hp: 115, haki: 'Armatura', specialMove: { name: 'Parasite Strings', damage: 65 }, preferredIsland: 'Dressrosa', fruitType: 'Paramisha' },
    { id: generateUniqueId(), name: 'Eneru', hp: 90, haki: 'Osservazione', specialMove: { name: 'Raigo', damage: 70 }, preferredIsland: 'Skypea', fruitType: 'Rogia' },
    { id: generateUniqueId(), name: 'Crocodile', hp: 100, haki: 'Conquistatore', specialMove: { name: 'Desert Spada', damage: 60 }, preferredIsland: 'Alabasta', fruitType: 'Rogia' },
    { id: generateUniqueId(), name: 'Marco', hp: 140, haki: 'Armatura', specialMove: { name: 'Phoenix Brand', damage: 75 }, preferredIsland: 'Marineford', fruitType: 'Zoan' },
    { id: generateUniqueId(), name: 'Katakuri', hp: 130, haki: 'Osservazione', specialMove: { name: 'Mochi Thrust', damage: 70 }, preferredIsland: 'Whole Cake Island', fruitType: 'Paramisha' },
    { id: generateUniqueId(), name: 'Barbanera', hp: 180, haki: 'Conquistatore', specialMove: { name: 'Darkness Swirl', damage: 85 }, preferredIsland: 'Marineford', fruitType: 'Rogia' },
    { id: generateUniqueId(), name: 'Smoker', hp: 100, haki: 'Armatura', specialMove: { name: 'White Out', damage: 50 }, preferredIsland: 'Logue Town', fruitType: 'Rogia' },
    { id: generateUniqueId(), name: 'Kizaru', hp: 120, haki: 'Osservazione', specialMove: { name: 'Light Speed Kick', damage: 65 }, preferredIsland: 'Arcipelago Sabaody', fruitType: 'Rogia' },
    { id: generateUniqueId(), name: 'Aokiji', hp: 140, haki: 'Armatura', specialMove: { name: 'Ice Age', damage: 80 }, preferredIsland: 'Ohara', fruitType: 'Rogia' },
    { id: generateUniqueId(), name: 'Fujitora', hp: 130, haki: 'Conquistatore', specialMove: { name: 'Gravity Blade', damage: 70 }, preferredIsland: 'Dressrosa', fruitType: 'Normale' }
];