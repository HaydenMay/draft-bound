import type { DraftBoardSlot, DraftTeamIdentity } from '../domain/models';

export const TEAM_CATALOG_VERSION = 'original-league-v1';
function team(teamId: string, city: string, nickname: string, primaryColor: string, secondaryColor: string): DraftTeamIdentity {
  return { teamId, city, displayName: `${city} ${nickname}`, primaryColor, secondaryColor, catalogVersion: TEAM_CATALOG_VERSION };
}

/** Original, neutral professional identities; no official team names, marks or logos. */
export const DRAFT_TEAMS: DraftTeamIdentity[] = [
  team('anchorage-northlights', 'Anchorage', 'Northlights', '#145E68', '#A7E5D6'),
  team('austin-copperwings', 'Austin', 'Copperwings', '#8D472E', '#E8BE7A'),
  team('boise-summit', 'Boise', 'Summit', '#324B78', '#DCE7F1'),
  team('charleston-tidekeepers', 'Charleston', 'Tidekeepers', '#296F81', '#E3D3AC'),
  team('columbus-forge', 'Columbus', 'Forge', '#5D374B', '#E5A568'),
  team('des-moines-harvest', 'Des Moines', 'Harvest', '#385D44', '#E6CC78'),
  team('durham-ironwoods', 'Durham', 'Ironwoods', '#385755', '#BFD6AD'),
  team('el-paso-sunrunners', 'El Paso', 'Sunrunners', '#984F34', '#F3D27E'),
  team('fresno-orchard', 'Fresno', 'Orchard', '#40584D', '#E3B28E'),
  team('grand-rapids-current', 'Grand Rapids', 'Current', '#2D5278', '#9FD6DF'),
  team('hartford-clockworks', 'Hartford', 'Clockworks', '#4B5265', '#DDBE7E'),
  team('honolulu-wayfinders', 'Honolulu', 'Wayfinders', '#206D71', '#EEB99F'),
  team('huntsville-orbits', 'Huntsville', 'Orbits', '#3E4075', '#C4C9E1'),
  team('louisville-couriers', 'Louisville', 'Couriers', '#6E3C4F', '#E3D4AD'),
  team('memphis-riverglass', 'Memphis', 'Riverglass', '#315A72', '#9DD9D0'),
  team('milwaukee-foundry', 'Milwaukee', 'Foundry', '#55545E', '#D5A065'),
  team('norfolk-beacons', 'Norfolk', 'Beacons', '#355379', '#EDD48C'),
  team('oklahoma-city-crosswinds', 'Oklahoma City', 'Crosswinds', '#48788A', '#E8C994'),
  team('omaha-trailmakers', 'Omaha', 'Trailmakers', '#79543E', '#D6C9A1'),
  team('orlando-daybreak', 'Orlando', 'Daybreak', '#875278', '#F0BD8B'),
  team('portland-rainkeepers', 'Portland', 'Rainkeepers', '#315F5C', '#AEC9CB'),
  team('providence-lanterns', 'Providence', 'Lanterns', '#493E71', '#EBCB80'),
  team('raleigh-oakguard', 'Raleigh', 'Oakguard', '#4B6540', '#D8B984'),
  team('reno-silverline', 'Reno', 'Silverline', '#4A5872', '#D7DFE7'),
  team('richmond-keystones', 'Richmond', 'Keystones', '#73524D', '#E4D1B1'),
  team('sacramento-goldcrest', 'Sacramento', 'Goldcrest', '#6C5A35', '#F1D084'),
  team('salt-lake-city-skyline', 'Salt Lake City', 'Skyline', '#4A547D', '#B9D8E3'),
  team('san-antonio-mesa', 'San Antonio', 'Mesa', '#8D594C', '#E6CDA6'),
  team('san-diego-tideglass', 'San Diego', 'Tideglass', '#286D7C', '#A9DACE'),
  team('spokane-pinelights', 'Spokane', 'Pinelights', '#3C6252', '#D2DFA7'),
  team('tucson-redrock', 'Tucson', 'Redrock', '#9C4C3D', '#EAC58C'),
  team('wichita-cloudbreak', 'Wichita', 'Cloudbreak', '#4F6C85', '#D8E4E9'),
];

export const DRAFT_ROUND_SIZES = [32, 32, 40, 40, 40, 40, 32] as const;

/**
 * Fictional board: the published catalog order repeats for each regular round.
 * Rounds 3–6 append eight explicitly assigned bonus slots. This preserves the
 * 256-pick, seven-round design without pretending that every round has 32 picks.
 * The order and assignments are versioned content, with no random draws.
 */
const BONUS_TEAM_INDICES: readonly (readonly number[])[] = [
  [], [],
  [0, 4, 8, 12, 16, 20, 24, 28],
  [1, 5, 9, 13, 17, 21, 25, 29],
  [2, 6, 10, 14, 18, 22, 26, 30],
  [3, 7, 11, 15, 19, 23, 27, 31],
  [],
];
let overallPick = 0;
export const DRAFT_BOARD: DraftBoardSlot[] = DRAFT_ROUND_SIZES.flatMap((_size, roundIndex) => {
  const order = [...DRAFT_TEAMS.map(t => t.teamId), ...BONUS_TEAM_INDICES[roundIndex].map(index => DRAFT_TEAMS[index].teamId)];
  return order.map((teamId, pickIndex) => ({ overallPick: ++overallPick, round: roundIndex + 1, pickInRound: pickIndex + 1, teamId }));
});
