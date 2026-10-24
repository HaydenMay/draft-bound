import type { Grade, SourcePlayerDefinition, WrAttributeId } from '../domain/models';

export const WR_ATTRIBUTE_IDS: readonly WrAttributeId[] = ['speed', 'acceleration', 'hands', 'routeRunning', 'release', 'vertical', 'bodyControl', 'yardsAfterCatch', 'awareness'];
export const VALID_GRADES: readonly Grade[] = ['S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

/**
 * Original game interpretations, manually curated for this prototype. No competitor
 * ratings were used. Dimensions, builds, eras and grades are gameplay illustrations,
 * not verified measurements or factual scouting evaluations of these real receivers.
 *
 * Rubric relative to this source pool: S = signature, exceptional natural gift;
 * A+/A/A- = extraordinary/elite/high-end; B+/B/B- = strong/good/functional;
 * C+/C/C- = situational/limited/developmental; D+/D/D- = marked game limitation;
 * F = lowest supported potential. +/- steps refine the tier without changing odds.
 * Each receiver has one entry. Normal offers sample these entries uniformly;
 * natural gifts use a separate per-attribute pool of entries graded S.
 */
export const LEGACY_SOURCE_CATALOG_VERSION = 'wr-original-illustrations-v1.2-90';
export const SOURCE_CATALOG_NOTE = 'Real receiver names inspire fictional prospects. Physical profiles and original letter grades are gameplay illustrations, not verified scouting data.';

type GradeLine = readonly [Grade, Grade, Grade, Grade, Grade, Grade, Grade, Grade, Grade];
function player(id: string, name: string, era: string, heightCm: number, weightKg: number, build: string, line: GradeLine): SourcePlayerDefinition {
  return {
    id, name, era, heightCm, weightKg, build,
    grades: {
      speed: line[0], acceleration: line[1], hands: line[2], routeRunning: line[3], release: line[4],
      vertical: line[5], bodyControl: line[6], yardsAfterCatch: line[7], awareness: line[8],
    },
  };
}

/** Grade order: speed, acceleration, hands, routes, release, vertical, body control, YAC, awareness. */
export const LEGACY_SOURCE_PLAYERS: SourcePlayerDefinition[] = [
  player('jerry-rice', 'Jerry Rice', '1980s–2000s', 188, 91, 'Balanced technician', ['B+', 'A-', 'A+', 'S', 'A+', 'B+', 'A', 'A+', 'S']),
  player('randy-moss', 'Randy Moss', '1990s–2010s', 193, 95, 'Long-striding vertical target', ['S', 'A+', 'A', 'A-', 'A', 'S', 'A+', 'A-', 'A']),
  player('terrell-owens', 'Terrell Owens', '1990s–2010s', 191, 102, 'Powerful open-field runner', ['A', 'A-', 'B+', 'A', 'A', 'A', 'A', 'S', 'A-']),
  player('calvin-johnson', 'Calvin Johnson', '2000s–2010s', 196, 108, 'Towering explosive target', ['A+', 'A', 'A', 'A-', 'A', 'S', 'A+', 'A', 'A-']),
  player('larry-fitzgerald', 'Larry Fitzgerald', '2000s–2020s', 191, 99, 'Strong-handed possession target', ['B-', 'B+', 'S', 'A+', 'A', 'A-', 'S', 'B+', 'S']),
  player('marvin-harrison', 'Marvin Harrison', '1990s–2000s', 183, 84, 'Precise lean technician', ['A-', 'A', 'A+', 'S', 'A+', 'B', 'A', 'B+', 'A+']),
  player('cris-carter', 'Cris Carter', '1980s–2000s', 191, 95, 'Boundary catch specialist', ['C+', 'B', 'S', 'A', 'A', 'A-', 'S', 'C+', 'A+']),
  player('steve-largent', 'Steve Largent', '1970s–1980s', 180, 86, 'Compact instinctive receiver', ['C', 'B-', 'A+', 'A+', 'A-', 'C+', 'A', 'B-', 'S']),
  player('tim-brown', 'Tim Brown', '1980s–2000s', 183, 88, 'Fluid all-around playmaker', ['A-', 'A', 'A', 'A', 'A-', 'B+', 'A-', 'A', 'A']),
  player('isaac-bruce', 'Isaac Bruce', '1990s–2000s', 183, 85, 'Smooth route separator', ['A-', 'A', 'A', 'A+', 'A', 'B', 'A-', 'A-', 'A+']),
  player('torry-holt', 'Torry Holt', '1990s–2000s', 183, 91, 'Fast precise route runner', ['A', 'A', 'A', 'A+', 'A-', 'B+', 'A', 'A-', 'A']),
  player('andre-reed', 'Andre Reed', '1980s–2000s', 188, 91, 'Strong inside playmaker', ['B+', 'A-', 'A-', 'A', 'A-', 'B+', 'A-', 'A+', 'A']),
  player('art-monk', 'Art Monk', '1980s–1990s', 191, 95, 'Dependable chain mover', ['C+', 'B', 'A+', 'A', 'A-', 'B', 'A-', 'B-', 'A+']),
  player('michael-irvin', 'Michael Irvin', '1980s–1990s', 188, 94, 'Physical possession leader', ['B', 'B+', 'A', 'A', 'A+', 'B+', 'A+', 'A-', 'A+']),
  player('sterling-sharpe', 'Sterling Sharpe', '1980s–1990s', 183, 94, 'Explosive powerful technician', ['A-', 'A', 'A+', 'A+', 'A', 'A-', 'A', 'A+', 'A']),
  player('james-lofton', 'James Lofton', '1970s–1990s', 191, 87, 'Long-limbed deep threat', ['A+', 'A-', 'A-', 'B+', 'B+', 'A', 'A', 'B+', 'A-']),
  player('lance-alworth', 'Lance Alworth', '1960s–1970s', 183, 83, 'Gliding vertical athlete', ['A', 'A-', 'A', 'A-', 'B+', 'A+', 'A+', 'B+', 'A']),
  player('fred-biletnikoff', 'Fred Biletnikoff', '1960s–1970s', 185, 86, 'Crafty sure-handed separator', ['D+', 'C+', 'A+', 'A+', 'A-', 'C', 'A', 'C-', 'A+']),
  player('paul-warfield', 'Paul Warfield', '1960s–1970s', 183, 85, 'Elegant downfield separator', ['A', 'A-', 'A', 'A+', 'A-', 'A', 'A', 'A-', 'A']),
  player('don-maynard', 'Don Maynard', '1950s–1970s', 183, 82, 'Lean field stretcher', ['A-', 'B+', 'A-', 'A-', 'B+', 'B+', 'A', 'B', 'A']),
  player('raymond-berry', 'Raymond Berry', '1950s–1960s', 188, 85, 'Meticulous timing specialist', ['D', 'C-', 'A+', 'S', 'A', 'C-', 'A-', 'D+', 'S']),
  player('charlie-joiner', 'Charlie Joiner', '1960s–1980s', 180, 85, 'Patient intermediate technician', ['C', 'B-', 'A', 'A+', 'A-', 'C', 'B+', 'C+', 'A+']),
  player('lynn-swann', 'Lynn Swann', '1970s–1980s', 180, 82, 'Acrobatic airborne receiver', ['B+', 'A-', 'A', 'B+', 'B+', 'A+', 'S', 'B', 'A-']),
  player('john-stallworth', 'John Stallworth', '1970s–1980s', 188, 87, 'Balanced downfield target', ['B+', 'B+', 'A', 'A-', 'B+', 'A-', 'A', 'B+', 'A']),
  player('drew-pearson', 'Drew Pearson', '1970s–1980s', 183, 85, 'Clutch boundary technician', ['B-', 'B', 'A', 'A', 'B+', 'B', 'A+', 'B-', 'A+']),
  player('cliff-branch', 'Cliff Branch', '1970s–1980s', 180, 80, 'Lightweight runway sprinter', ['S', 'A+', 'B', 'B+', 'B', 'B+', 'B+', 'A-', 'B+']),
  player('harold-carmichael', 'Harold Carmichael', '1970s–1980s', 201, 102, 'Towering catch-radius target', ['C+', 'C', 'A', 'B', 'B+', 'A', 'A+', 'C', 'A-']),
  player('andre-rison', 'Andre Rison', '1980s–2000s', 183, 85, 'Quick-twitch perimeter playmaker', ['A-', 'A', 'B+', 'A-', 'A', 'A-', 'A-', 'A-', 'B+']),
  player('herman-moore', 'Herman Moore', '1990s–2000s', 193, 95, 'Long physical catch-point target', ['B', 'B-', 'A', 'B+', 'B+', 'A', 'A+', 'B-', 'A-']),
  player('rod-smith', 'Rod Smith', '1990s–2000s', 183, 91, 'Complete hardworking technician', ['B+', 'A-', 'A', 'A', 'A-', 'B+', 'A-', 'A-', 'A+']),
  player('jimmy-smith', 'Jimmy Smith', '1990s–2000s', 185, 96, 'Strong smooth outside receiver', ['A-', 'A-', 'A', 'A', 'A', 'B+', 'A', 'A-', 'A']),
  player('keenan-mccardell', 'Keenan McCardell', '1990s–2000s', 185, 87, 'Polished possession technician', ['C+', 'B', 'A', 'A+', 'A-', 'C+', 'A-', 'B-', 'A+']),
  player('hines-ward', 'Hines Ward', '1990s–2010s', 183, 93, 'Tough inside possession target', ['C', 'B-', 'A', 'A', 'A', 'C+', 'A-', 'A-', 'A+']),
  player('anquan-boldin', 'Anquan Boldin', '2000s–2010s', 185, 100, 'Powerful contested-catch runner', ['D+', 'C+', 'A+', 'A-', 'A', 'B', 'A+', 'A', 'A+']),
  player('chad-johnson', 'Chad Johnson', '2000s–2010s', 185, 87, 'Expressive release technician', ['A-', 'A', 'A-', 'A+', 'S', 'A-', 'A', 'B+', 'A-']),
  player('steve-smith-sr', 'Steve Smith Sr.', '2000s–2010s', 175, 88, 'Compact explosive competitor', ['A', 'A+', 'A-', 'A', 'A', 'A', 'A', 'S', 'A']),
  player('reggie-wayne', 'Reggie Wayne', '2000s–2010s', 183, 92, 'Dependable timing receiver', ['B', 'B+', 'A+', 'A+', 'A', 'B', 'A', 'B+', 'S']),
  player('andre-johnson', 'Andre Johnson', '2000s–2010s', 191, 104, 'Powerful complete outside target', ['A', 'A-', 'A+', 'A', 'A+', 'A', 'A+', 'A+', 'A']),
  player('wes-welker', 'Wes Welker', '2000s–2010s', 175, 84, 'Agile underneath separator', ['C+', 'A', 'A-', 'A+', 'A', 'D+', 'B+', 'A', 'A+']),
  player('brandon-marshall', 'Brandon Marshall', '2000s–2010s', 193, 105, 'Large physical possession target', ['B', 'B+', 'A', 'A-', 'A', 'A-', 'A+', 'A', 'A-']),
  player('marques-colston', 'Marques Colston', '2000s–2010s', 193, 102, 'Tall seam possession target', ['C', 'C+', 'A', 'A-', 'B+', 'B+', 'A', 'C+', 'A']),
  player('vincent-jackson', 'Vincent Jackson', '2000s–2010s', 196, 105, 'Long-striding deep target', ['B+', 'B-', 'A-', 'B+', 'B+', 'A', 'A', 'B-', 'A-']),
  player('desean-jackson', 'DeSean Jackson', '2000s–2020s', 178, 79, 'Slender explosive field stretcher', ['S', 'A+', 'B', 'A-', 'B+', 'B', 'A-', 'A', 'B+']),
  player('mike-wallace', 'Mike Wallace', '2000s–2010s', 183, 90, 'Straight-line deep specialist', ['A+', 'A', 'C+', 'C+', 'B-', 'B', 'B-', 'B+', 'C']),
  player('jordy-nelson', 'Jordy Nelson', '2000s–2010s', 191, 98, 'Long smooth boundary technician', ['B+', 'B+', 'A', 'A', 'A-', 'B+', 'A+', 'B+', 'A+']),
  player('dez-bryant', 'Dez Bryant', '2010s–2020s', 188, 100, 'Powerful aerial finisher', ['B+', 'A-', 'A-', 'B+', 'A-', 'A+', 'A+', 'A', 'B+']),
  player('demaryius-thomas', 'Demaryius Thomas', '2010s', 191, 103, 'Big explosive open-field runner', ['A', 'A-', 'B+', 'B+', 'B+', 'A', 'A-', 'A+', 'B+']),
  player('antonio-brown', 'Antonio Brown', '2010s–2020s', 178, 84, 'Electric precise separator', ['A-', 'S', 'A+', 'S', 'A+', 'B+', 'A+', 'A+', 'A+']),
  player('julio-jones', 'Julio Jones', '2010s–2020s', 191, 100, 'Explosive complete outside athlete', ['A+', 'A', 'A', 'A+', 'A', 'A+', 'A+', 'A', 'A']),
  player('aj-green', 'A.J. Green', '2010s–2020s', 193, 95, 'Fluid airborne boundary target', ['A-', 'A-', 'A', 'A', 'A-', 'A+', 'A+', 'B+', 'A']),
  player('ty-hilton', 'T.Y. Hilton', '2010s–2020s', 175, 83, 'Quick deep-space separator', ['A+', 'A', 'B+', 'A-', 'B+', 'B-', 'B+', 'A-', 'A-']),
  player('doug-baldwin', 'Doug Baldwin', '2010s', 178, 86, 'Savvy compact route specialist', ['B', 'A-', 'A', 'A+', 'A+', 'B', 'A-', 'B+', 'A+']),
  player('julian-edelman', 'Julian Edelman', '2000s–2020s', 178, 90, 'Agile instinctive slot runner', ['C+', 'A-', 'B+', 'A', 'A', 'C', 'B+', 'A', 'A+']),
  player('emmanuel-sanders', 'Emmanuel Sanders', '2010s–2020s', 180, 82, 'Quick balanced separator', ['A-', 'A', 'A-', 'A', 'A-', 'B+', 'A-', 'A-', 'A']),
  player('odell-beckham-jr', 'Odell Beckham Jr.', '2010s–2020s', 180, 90, 'Acrobatic explosive playmaker', ['A', 'A+', 'A-', 'A', 'A', 'A+', 'S', 'A+', 'B+']),
  player('deandre-hopkins', 'DeAndre Hopkins', '2010s–2020s', 185, 96, 'Elite catch-point technician', ['B-', 'B+', 'S', 'A', 'A+', 'A', 'S', 'B+', 'A+']),
  player('mike-evans', 'Mike Evans', '2010s–2020s', 196, 105, 'Towering boundary finisher', ['B+', 'B-', 'A', 'B+', 'A-', 'A+', 'A+', 'B-', 'A']),
  player('davante-adams', 'Davante Adams', '2010s–2020s', 185, 98, 'Complete release artist', ['B+', 'A', 'A+', 'S', 'S', 'A-', 'A+', 'A-', 'A+']),
  player('keenan-allen', 'Keenan Allen', '2010s–2020s', 188, 96, 'Patient route-running specialist', ['D+', 'B', 'A+', 'S', 'A+', 'C+', 'A', 'B', 'A+']),
  player('stefon-diggs', 'Stefon Diggs', '2010s–2020s', 183, 88, 'Sharp all-level separator', ['A-', 'A', 'A', 'A+', 'A+', 'B+', 'A+', 'A-', 'A']),
  player('tyreek-hill', 'Tyreek Hill', '2010s–2020s', 178, 86, 'Compact rare-speed playmaker', ['S', 'S', 'B+', 'A', 'A-', 'A-', 'A', 'S', 'A-']),
  player('michael-thomas', 'Michael Thomas', '2010s–2020s', 191, 96, 'Strong precise possession target', ['C+', 'B', 'A+', 'A+', 'A', 'B', 'A', 'B+', 'A+']),
  player('cooper-kupp', 'Cooper Kupp', '2010s–2020s', 188, 94, 'Instinctive versatile separator', ['B-', 'A-', 'A+', 'S', 'A', 'B', 'A', 'A+', 'S']),
  player('adam-thielen', 'Adam Thielen', '2010s–2020s', 188, 91, 'Polished sure-handed technician', ['B', 'B+', 'A+', 'A', 'A-', 'B+', 'A', 'B', 'A+']),
  player('amari-cooper', 'Amari Cooper', '2010s–2020s', 185, 96, 'Smooth quick-footed separator', ['A-', 'A', 'B+', 'A+', 'A+', 'B+', 'A-', 'A-', 'A']),
  player('tyler-lockett', 'Tyler Lockett', '2010s–2020s', 178, 83, 'Light-footed deep technician', ['A', 'A', 'A', 'A', 'A-', 'B', 'A+', 'B+', 'A+']),
  player('ceedee-lamb', 'CeeDee Lamb', '2020s', 188, 91, 'Fluid catch-and-run playmaker', ['A-', 'A', 'A', 'A+', 'A', 'A-', 'A+', 'A+', 'A']),
  player('justin-jefferson', 'Justin Jefferson', '2020s', 185, 92, 'Elastic complete route artist', ['A', 'A+', 'A+', 'S', 'A+', 'A', 'A+', 'A', 'A+']),
  player('jamarr-chase', "Ja'Marr Chase", '2020s', 183, 92, 'Powerful explosive playmaker', ['A+', 'A+', 'A', 'A', 'A', 'A', 'A', 'S', 'A-']),
  player('aj-brown', 'A.J. Brown', '2010s–2020s', 185, 102, 'Powerful open-field finisher', ['A', 'A', 'A', 'A', 'A', 'B+', 'A', 'A+', 'A-']),
  player('devonta-smith', 'DeVonta Smith', '2020s', 183, 77, 'Slender precise separator', ['A-', 'A', 'A', 'A+', 'A', 'A-', 'A+', 'B+', 'A']),
  player('dk-metcalf', 'DK Metcalf', '2010s–2020s', 193, 104, 'Powerful long-striding sprinter', ['A+', 'A-', 'B+', 'B', 'B+', 'A+', 'A-', 'A', 'B']),
  player('jaylen-waddle', 'Jaylen Waddle', '2020s', 178, 83, 'Sudden compact field stretcher', ['A+', 'A+', 'B+', 'A-', 'A-', 'B+', 'A-', 'A+', 'B+']),
  player('puka-nacua', 'Puka Nacua', '2020s', 188, 96, 'Physical instinctive route runner', ['B-', 'B+', 'A', 'A', 'A-', 'B+', 'A', 'A+', 'A']),
  player('brandon-aiyuk', 'Brandon Aiyuk', '2020s', 183, 91, 'Long-armed sudden separator', ['A-', 'A', 'A-', 'A+', 'A', 'A-', 'A', 'A-', 'A-']),
  // Broader specialist and possession profiles. These remain original game
  // interpretations, with the same uniform offer odds as every other entry.
  player('willie-gault', 'Willie Gault', '1980s–1990s', 185, 82, 'Straight-line track-speed specialist', ['A+', 'A', 'C', 'C+', 'C', 'B+', 'C+', 'B', 'C']),
  player('rob-moore', 'Rob Moore', '1990s–2000s', 191, 98, 'Large outside possession target', ['B+', 'B', 'B+', 'B', 'B+', 'A-', 'A-', 'B', 'B+']),
  player('ricky-proehl', 'Ricky Proehl', '1990s–2000s', 183, 86, 'Veteran timing and possession target', ['B-', 'B', 'B+', 'A-', 'B', 'C+', 'B', 'B-', 'A']),
  player('troy-brown', 'Troy Brown', '1990s–2000s', 178, 89, 'Versatile underneath technician', ['C+', 'B+', 'A-', 'A', 'B+', 'C', 'B', 'B', 'A+']),
  player('wayne-chrebet', 'Wayne Chrebet', '1990s–2000s', 178, 85, 'Compact possession and timing specialist', ['C', 'B', 'A-', 'A', 'B', 'C', 'B+', 'B', 'A']),
  player('santana-moss', 'Santana Moss', '2000s–2010s', 178, 86, 'Quick compact deep-space playmaker', ['A', 'A+', 'B+', 'A-', 'B', 'B-', 'B+', 'A', 'A-']),
  player('eric-moulds', 'Eric Moulds', '1990s–2000s', 188, 96, 'Physical outside catch-and-run target', ['A-', 'A-', 'A-', 'B+', 'B+', 'A', 'A', 'A', 'B+']),
  player('plaxico-burress', 'Plaxico Burress', '2000s–2010s', 196, 105, 'Tall catch-point boundary specialist', ['B', 'B-', 'A-', 'B+', 'B+', 'A+', 'A+', 'C+', 'B+']),
  player('santonio-holmes', 'Santonio Holmes', '2000s–2010s', 180, 86, 'Quick boundary separator', ['A', 'A', 'B+', 'A-', 'B+', 'B', 'A', 'B+', 'B+']),
  player('pierre-garcon', 'Pierre Garcon', '2000s–2010s', 183, 96, 'Strong direct-route possession target', ['B+', 'B+', 'B+', 'B+', 'B+', 'B', 'B+', 'A-', 'B+']),
  player('golden-tate', 'Golden Tate', '2010s–2020s', 178, 90, 'Elusive compact runner after the catch', ['B+', 'A', 'B+', 'A-', 'B+', 'C+', 'A', 'A+', 'A-']),
  player('jarvis-landry', 'Jarvis Landry', '2010s–2020s', 180, 92, 'Strong instinctive underneath target', ['C+', 'B', 'A', 'A', 'B+', 'C', 'A', 'A', 'A+']),
  player('cole-beasley', 'Cole Beasley', '2010s–2020s', 173, 79, 'Small precise underneath separator', ['D+', 'B', 'A-', 'A', 'B', 'C-', 'B', 'C+', 'A']),
  player('john-brown', 'John Brown', '2010s–2020s', 180, 81, 'Light quick field stretcher', ['A', 'A', 'B', 'B+', 'B', 'C+', 'B', 'B+', 'B+']),
  player('tyler-boyd', 'Tyler Boyd', '2010s–2020s', 188, 92, 'Balanced slot possession target', ['B-', 'B+', 'A-', 'A', 'B', 'B', 'B+', 'B', 'A-']),
];
