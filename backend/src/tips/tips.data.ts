export interface DisasterTips {
  before: string[];
  during: string[];
  after: string[];
  emergency_contacts: string[];
}

export const TIPS_DATA: Record<string, DisasterTips> = {
  TORNADO: {
    before: [
      'Identify a safe room: interior room on lowest floor, away from windows (bathroom, closet, hallway)',
      'Prepare a 72-hour emergency kit: water (1 gal/person/day), non-perishable food, medications, flashlight, batteries',
      'Know the difference: Tornado Watch = conditions favorable; Tornado Warning = tornado spotted or radar indicated',
      'Install a NOAA weather radio to receive alerts even at night',
      'Practice your emergency plan with all household members, including where to meet if separated',
      'If in a mobile home, know the nearest sturdy building — mobile homes offer little protection',
    ],
    during: [
      'Go to your safe room or lowest floor interior room immediately upon a warning',
      'Cover your head and neck with your arms; use a mattress, heavy coats, or blankets if available',
      'Get under a sturdy table if possible and hold on',
      'Stay away from windows, doors, and outside walls',
      'If caught outdoors, lie flat in a ditch or depression; cover your head — never shelter under a bridge',
      'If driving, do NOT try to outrun a tornado — abandon car and shelter in a sturdy building or lie flat in a low area',
    ],
    after: [
      'Watch for downed power lines — treat all as live and stay 50+ feet away',
      'Do not enter damaged buildings until authorities declare them safe',
      'Smell gas? Leave immediately, leave door open, call 911 from outside',
      'Wear sturdy shoes and gloves when cleaning debris to avoid injury',
      'Document all damage with photos before cleanup for insurance claims',
      'Check on neighbors, especially elderly and those with disabilities',
    ],
    emergency_contacts: ['911 (emergency)', 'FEMA: 1-800-621-3362', 'American Red Cross: 1-800-733-2767', 'NOAA Weather Radio: 162.400–162.550 MHz'],
  },

  HURRICANE: {
    before: [
      'Board up windows with plywood (5/8" minimum) or install hurricane shutters',
      'Fill bathtub and large containers with water (tap water may be unavailable after storm)',
      'Stock at least 7-day supplies: water, food, medications, cash, important documents',
      'Evacuate immediately if under mandatory evacuation order — do not wait',
      'Charge all devices; purchase a portable battery bank',
      'Clear gutters and roof drains; secure or bring in outdoor furniture and objects',
      'Know your evacuation route and have a destination (hotel or shelter) identified',
      'Fill your vehicle with gas — stations close or run out before landfall',
    ],
    during: [
      'Stay indoors, away from windows and glass doors — use interior rooms',
      'If the eye passes over (calm period), stay inside — dangerous winds return shortly',
      'Do not go outside to inspect damage during the storm',
      'Monitor NOAA Weather Radio or local TV/radio for updates',
      'If flooding threatens, move to upper floors; never go into attic without roof access tool',
      'Avoid using candles — use flashlights to reduce fire risk',
    ],
    after: [
      'Avoid flooded roads — 6 inches of water can knock you down; 12 inches can carry a car',
      'Do not drink tap water until authorities confirm it is safe',
      'Beware of contaminated floodwater — contains sewage, chemicals, and debris',
      'Report downed power lines to utility company — never touch them',
      'Use generators outdoors only — 20+ feet from windows; CO poisoning is a leading cause of post-hurricane deaths',
      'Document all damage with photos and video before cleanup',
    ],
    emergency_contacts: ['911 (emergency)', 'FEMA: 1-800-621-3362', 'NHC Hurricane Hotline: nhc.noaa.gov', 'Red Cross: 1-800-733-2767'],
  },

  FLOOD: {
    before: [
      'Know your flood zone — check FEMA flood maps at msc.fema.gov',
      'Move valuables, appliances, and important documents to higher floors',
      'Keep emergency kit ready including waterproof bag for documents',
      'Know your evacuation routes to higher ground',
      'Consider flood insurance — standard homeowner policies do NOT cover flooding',
      'Keep gutters and drains clear; grade land away from foundation',
      'Install check valves in plumbing to prevent sewage backup',
    ],
    during: [
      'Move to higher ground immediately — do not wait for instructions if water is rising',
      'Never walk through moving water — 6 inches can knock you down; use a stick to check depth',
      'Never drive into flooded roadways — "Turn Around, Don\'t Drown" — 2 feet of water floats most vehicles',
      'If your vehicle stalls in water, abandon it immediately and move to higher ground',
      'Avoid storm drains, ditches, and streams — water rises rapidly',
      'If trapped in building, signal for rescue from upper floor — do not swim out',
    ],
    after: [
      'Do not return home until authorities say it is safe',
      'Avoid floodwater — it may be contaminated with sewage, chemicals, and debris',
      'Photograph all damage before cleanup; contact insurance company promptly',
      'Discard food, medications, and cosmetics that contacted floodwater',
      'Pump out flooded basements gradually — sudden removal can cause structural collapse',
      'Look for signs of foundation damage, mold, and electrical hazards before re-entering',
    ],
    emergency_contacts: ['911 (emergency)', 'FEMA: 1-800-621-3362', 'NOAA Flood Warnings: weather.gov', 'Red Cross: 1-800-733-2767'],
  },

  WILDFIRE: {
    before: [
      'Create 30-foot defensible space: clear dead vegetation, leaves, and flammable materials around home',
      'Use fire-resistant building materials for roofing, siding, and decking',
      'Remove dead leaves and pine needles from gutters and roof',
      'Prepare a "go bag" with 3-day supplies, medications, important documents, and irreplaceable items',
      'Know at least two evacuation routes from your neighborhood',
      'Close all windows and vents to prevent embers from entering',
      'Keep vehicles fueled and facing outward for rapid evacuation',
    ],
    during: [
      'Evacuate early — wildfires move fast; do not wait for mandatory order',
      'If sheltering in place: close all windows/doors, turn off AC, fill sinks/tubs with water',
      'Move propane tanks and flammable furniture away from structure if time allows',
      'Wear cotton or wool clothing (not synthetic) and cover all skin',
      'If trapped in vehicle: park away from trees, turn off engine, close vents, get down on floor, cover with blanket',
      'If on foot and escape is impossible: lie face down in a ditch, cover body with dirt',
    ],
    after: [
      'Watch for hot spots — fires can reignite days after apparent extinguishment',
      'Wear N95 mask — wildfire smoke contains harmful particles',
      'Do not return until fire officials declare area safe',
      'Check roof and attic for embers that may cause fires hours after the main fire passes',
      'Be aware of mudslide risk after wildfire — burned slopes are highly susceptible to landslides',
      'Document all damage and contact insurance company',
    ],
    emergency_contacts: ['911 (emergency)', 'FEMA: 1-800-621-3362', 'National Interagency Fire Center: nifc.gov', 'Air Quality: airnow.gov'],
  },

  DROUGHT: {
    before: [
      'Conserve water now — install low-flow fixtures, fix leaks (a dripping faucet wastes 20 gal/day)',
      'Landscape with drought-tolerant native plants (xeriscaping)',
      'Install rain barrels to capture rainwater for outdoor use',
      'Know your local water authority\'s conservation stage and restrictions',
      'Reduce lawn watering — lawns can survive 4–6 weeks without water',
      'Mulch garden beds to retain soil moisture',
    ],
    during: [
      'Follow all water restrictions and conservation mandates from local authorities',
      'Reduce outdoor water use by 20–30%: water plants at dawn, use drip irrigation',
      'Run dishwasher and washing machine only with full loads',
      'Take shorter showers (aim for 5 minutes)',
      'Report water waste: broken hydrants, excessive irrigation runoff',
      'Farmers: monitor soil moisture; consider drought-resistant crop varieties',
    ],
    after: [
      'Continue conservation habits even after drought ends — aquifers recover slowly',
      'Restore native plants and ground cover to prevent erosion and retain future moisture',
      'Assess well water quality if on a private well',
      'Review wildfire risk — drought-stressed vegetation is extremely flammable',
      'Monitor food prices — regional droughts often impact supply chains',
    ],
    emergency_contacts: ['Local Water Authority', 'USDA Farm Service Agency (farmers): fsa.usda.gov', 'US Drought Monitor: droughtmonitor.unl.edu'],
  },

  LANDSLIDE: {
    before: [
      'Know if you live in a landslide-prone area — check USGS hazard maps',
      'Watch for warning signs: new cracks in walls, tilting trees/poles, bulging ground, changes in water flow',
      'Do not build on steep slopes, canyon edges, or areas with visible erosion',
      'Plant ground cover and trees to stabilize slopes',
      'Ensure proper drainage channels are maintained and not blocked',
      'Prepare emergency kit with 72-hour supplies',
    ],
    during: [
      'Evacuate immediately when ordered — do not wait to see if the slide is coming',
      'Listen for unusual sounds: cracking trees, boulders knocking, rumbling',
      'If evacuation is impossible: move to upper floor; avoid river valleys and low-lying areas',
      'If debris flow is imminent: run to the nearest high ground out of the path — do not go downhill',
      'Curl into tight ball and protect your head if you cannot escape',
      'Stay away from the slide area — secondary slides are common',
    ],
    after: [
      'Stay away from the slide area — additional slides and flooding often follow',
      'Check for damaged utilities: water, gas, electric',
      'Report broken utility lines to appropriate utility companies',
      'Watch for flooding — landslides often dam streams causing backup flooding',
      'Document damage with photos for insurance',
      'Have a professional inspect foundations and retaining walls before re-occupying',
    ],
    emergency_contacts: ['911 (emergency)', 'USGS Landslide Information: usgs.gov/hazards/landslides', 'FEMA: 1-800-621-3362'],
  },

  BLIZZARD: {
    before: [
      'Stock 72-hour emergency supplies: food, water, medications, flashlights, batteries, blankets',
      'Winterize your home: insulate pipes, check heating system, seal drafts',
      'Keep a winter car kit: blanket, shovel, sand/kitty litter, jumper cables, flashlight, snacks',
      'Fill vehicle with gas before the storm',
      'Charge all devices; purchase battery-powered or hand-crank radio',
      'Know how to shut off water pipes in case of freezing',
    ],
    during: [
      'Stay indoors — exposure causes hypothermia and frostbite within minutes in severe cold',
      'If you must go out: dress in warm layers (wool/synthetic, not cotton), cover all skin',
      'Avoid overexertion when shoveling snow — heart attacks spike during blizzards',
      'Never use generators, grills, or camp stoves indoors — CO poisoning kills',
      'Keep faucets dripping slightly to prevent pipe freeze',
      'If driving in whiteout: pull off to the side, turn on hazard lights, stay in vehicle',
    ],
    after: [
      'Check on neighbors, especially elderly individuals living alone',
      'Watch for carbon monoxide hazards from generators, snow-blocked exhaust pipes',
      'Clear snow from roof if accumulation is heavy — roofs can collapse',
      'Be cautious of ice on roads and sidewalks — most injuries occur after the storm',
      'Thaw frozen pipes slowly with warm towels — never use open flame',
      'Watch for hypothermia and frostbite symptoms in yourself and others',
    ],
    emergency_contacts: ['911 (emergency)', 'National Weather Service: weather.gov', 'Local Department of Public Works (road conditions)', 'Utility Emergency Lines'],
  },
};
