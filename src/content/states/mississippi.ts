import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('mississippi');
const rate = st.rate.flat ?? 0; // 4 % above the first $10,000 of taxable income in 2026
const band = 10000; // 0 % band, 2026 (states.json rate note)
const fed = K.P.early.penalty;
// Worked case: $22,000 from an IRA at 49, penalized by the IRS.
const amt = 22000;
const ceiling = K.stateTax('mississippi', amt, 49, 0, true);
const msTaxable = 30000;
const msTax = (msTaxable - band) * rate;

export default defineState({
  slug: 'mississippi',
  title: 'Mississippi Early Distribution Tax 2026: 4 % Over $10,000',
  description: `Mississippi early distribution tax 2026: a 401(k) or IRA payout hit by the federal 10 % is not retirement income there and is taxed at ${K.pct(rate, 0)} above $10,000.`,
  intro: 'Mississippi exempts retirement income once you meet the plan’s retirement requirements, but a payout that the IRS treats as an early distribution on Form 5329 loses that exemption.',
  resume: `Mississippi exempts retirement income, pensions and annuities from state tax once the recipient has met the plan's retirement requirements, with no age floor and no dollar cap stated in the sources we read. The exemption has a hard edge for early retirees. The Department of Revenue writes that "early distributions are not considered retirement income", and that pensions and annuities "taxable as early or excess distributions under the Federal Internal Revenue Code (see Federal Form 5329) do not qualify." Deferred compensation received before the plan's retirement age or service requirement is taxable too. In 2026 Mississippi taxes the first $10,000 of taxable income at 0 % and the excess at ${K.pct(rate, 0)}, down from 4.4 % in 2025. If an early IRA withdrawal makes up ${K.usd(msTaxable)} of Mississippi taxable income, the state tax is ${K.usd(msTax)}. Whether a payout covered by a federal exception, such as the rule of 55, is then fully exempt is not spelled out in what we read, so this page does not claim it.`,
  body: (h) => `
<h2>Form 5329 is the dividing line</h2>
<p>In Mississippi the question is not your age but how the money is classified. Retirement income is exempt when "the recipient has met the retirement plan requirements." A payout that federal law treats as an early or excess distribution, the kind reported on Form 5329, does not qualify. A 49-year-old who empties part of an IRA to cover a gap year, and pays the IRS ${K.pct(fed, 0)} on it, has left the exempt category. Drawn after 59½ with no penalty on Form 5329, the same IRA is generally back on the exempt side.</p>
<p>The state applies the same idea to deferred compensation: distributions received before the plan's retirement age or service requirements are met are taxable.</p>
${h.mini('state', { t: 'Mississippi on a penalized IRA payout at 49', p: ['amt', 'age'], d: { sx: 'mississippi', age: 49, amt: 22000 } })}
<p>The calculator applies ${K.pct(rate, 0)} to the whole withdrawal, which gives ${K.usd(ceiling.total)} on ${K.usd(amt)}. That is a ceiling. Mississippi's 2026 schedule leaves the first $10,000 of taxable income at 0 %, so when the withdrawal is most of your Mississippi taxable income the real bill is lower.</p>
<h2>The 2026 rate, with the $10,000 band</h2>
<p>The Department of Revenue's rate table for 2026 reads: excess of $10,000 of taxable income is taxed at ${K.pct(rate, 0)}. The rate was 4.4 % for 2025 and is scheduled at 3.75 % for 2027. Taxable income here is the Mississippi figure after its own exemptions and deductions, not your federal number. With ${K.usd(msTaxable)} of Mississippi taxable income from a penalized IRA payout, ${K.usd(band)} is taxed at nothing and ${K.usd(msTaxable - band)} at ${K.pct(rate, 0)}: ${K.usd(msTax)}.</p>
<h2>What we could not confirm: the rule of 55 case</h2>
<p>A worker who leaves an employer in the year of the 55th birthday and draws that 401(k) owes no federal ${K.pct(fed, 0)} under the ${h.a('rule-of-55', 'rule of 55')}, and files no penalty on Form 5329. The Mississippi instructions tie the loss of the exemption to that federal status, which suggests the payout could stay exempt. They also require the plan's retirement requirements to be met, and a plan may define retirement in its own terms rather than by a separation at 55. The texts we read do not settle this case. Before relying on it, ask the Department of Revenue or check your plan's definition of retirement. The same caution applies to a ${h.a('72t-calculator', '72(t) series')} started in the forties.</p>
<h2>Sequencing the bridge in Mississippi</h2>
<p>Because a penalized payout is taxed twice, at the federal ${K.pct(fed, 0)} and at the state rate, the early years favor money that is neither: Roth contributions, taxable savings and cash. The low 0 % band can absorb a small IRA withdrawal at little state cost, which is one reason to spread early withdrawals evenly rather than take one large sum. The ${h.a('state-tax-on-retirement-withdrawals', 'state comparison page')} shows where Mississippi sits next to its neighbors.</p>
`,
  faqs: [
    { q: 'Does Mississippi tax a 401(k) withdrawal at 50 that triggers the federal 10 %?', a: `Yes. Mississippi does not treat early distributions as retirement income, and pensions or annuities taxable as early distributions under the Internal Revenue Code, reported on Form 5329, do not qualify for its exemption. The payout joins Mississippi taxable income, taxed at ${K.pct(rate, 0)} above the first $10,000 in 2026.` },
    { q: 'Is a rule of 55 payout exempt from Mississippi income tax?', a: 'The sources we read do not answer this case directly. The exemption requires the plan’s retirement requirements to be met, and it is lost for distributions taxed as early under Form 5329. A rule of 55 payout avoids the federal penalty, but whether Mississippi then treats it as retirement income depends on facts we could not confirm. Ask the Department of Revenue.' },
    { q: 'What are Mississippi’s income tax rates on retirement money for 2026?', a: `For 2026 Mississippi taxes the first $10,000 of taxable income at 0 % and the excess at ${K.pct(rate, 0)}. The rate was 4.4 % in 2025 and is set at 3.75 % for 2027. Exempt retirement income never reaches these brackets; only taxable payouts, such as penalized early distributions, do.` },
    { q: 'Is there a dollar cap on Mississippi’s retirement income exemption?', a: 'None appears in the Department of Revenue pages we read. Retirement income from federal, state and private retirement systems is exempt once the plan’s retirement requirements are met, without a stated ceiling or minimum age. The limit is the classification of the payout, not its size.' },
  ],
  related: ['state-tax-on-retirement-withdrawals', '401k-withdrawal-penalty', 'rule-of-55', '72t-calculator', 'roth-ira-withdrawal-rules'],
});
