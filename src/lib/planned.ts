/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
export const PLANNED_GUIDES = [
  'fire-number-calculator', 'coast-fire-calculator', 'barista-fire', 'lean-fire-vs-fat-fire', '4-percent-rule', 'sequence-of-returns-risk',
  'how-much-do-i-need-to-retire', 'when-can-i-retire-calculator', 'early-retirement-calculator', 'retire-at-55', 'retire-at-50',
  'how-much-to-save-for-retirement', 'retirement-savings-by-age', 'how-long-will-my-money-last', 'financial-independence-retire-early', 'retirement-contribution-limits',
  'rule-of-55', 'rule-of-55-public-safety', '72t-calculator', '72t-interest-rate', '72t-modification', '401k-withdrawal-penalty', '401k-early-withdrawal-calculator',
  'ira-early-withdrawal-penalty', 'early-withdrawal-penalty-exceptions', 'when-can-you-draw-401k', 'how-to-withdraw-money-from-401k', 'roth-conversion-ladder',
  'roth-ira-withdrawal-rules', '457b-early-withdrawal', 'early-retirement-bridge',
  'health-insurance-before-medicare', 'aca-subsidy-cliff', 'cobra-vs-marketplace',
  'tax-on-401k-withdrawal', 'zero-percent-capital-gains', 'state-tax-on-retirement-withdrawals',
];
export const PLANNED_STATES = ['california', 'pennsylvania', 'illinois', 'mississippi', 'iowa', 'colorado', 'new-york', 'georgia', 'new-jersey', 'south-carolina', 'washington'];
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, ...PLANNED_STATES.map((s) => `state:${s}`)]);
