/**
 * Engine tests. Official cases first: the three worked examples of the IRS SEPP FAQ (updated July 23,
 * 2026), the lock-period examples of the same FAQ, Rev. Proc. 2025-32 bracket edges, Rev. Proc. 2025-25
 * and 2026-26 applicable percentages, Publication 575 for the rule of 55.
 */
import { describe, it, expect } from 'vitest';
import P from '../src/data/params-2026.json';
import { payment, annuityFactor, annuityCertain, lifeExpectancy, maxRate, lockEnd, CAP_MONTHS, schedule } from '../src/lib/engine/sepp';
import { bracketTax, federalTax, extraTax } from '../src/lib/engine/tax';
import { ruleOf55, earlyWithdrawal, grossForNet, date59half, exceptionCovers } from '../src/lib/engine/early';
import { premiumCredit, applicablePct, povertyLine } from '../src/lib/engine/aca';
import { rothWithdrawal, ladder, conversionFreeYear } from '../src/lib/engine/roth';
import { fireNumber, yearsTo, coast, coastAge, barista, lasts, crashFirstVsLast, yearsFromSavingsRate } from '../src/lib/engine/fire';
import { plan, bridge, fireNumbers, type PlanIn } from '../src/lib/engine/plan';

describe('72(t): IRS SEPP FAQ examples (Bob, age 50, $400,000, 4 %)', () => {
  it('RMD method: $400,000 / 36.2 = $11,050', () => {
    expect(lifeExpectancy(50)).toBe(36.2);
    expect(Math.round(payment('rmd', 400000, 50, 0.04))).toBe(P.sepp.irsExample.rmd);
  });
  it('second year RMD: $408,304 / 35.3 = $11,567', () => expect(Math.round(payment('rmd', 408304, 51, 0.04))).toBe(11567));
  it('fixed amortization: factor 18.9559, $21,102', () => {
    expect(annuityCertain(36.2, 0.04)).toBeCloseTo(P.sepp.irsExample.amortFactor, 4);
    expect(Math.round(payment('amortization', 400000, 50, 0.04))).toBe(P.sepp.irsExample.amortization);
  });
  it('fixed annuitization: factor 18.1568, $22,030', () => {
    expect(annuityFactor(50, 0.04)).toBeCloseTo(P.sepp.irsExample.annuityFactor, 4);
    expect(Math.round(payment('annuitization', 400000, 50, 0.04))).toBe(P.sepp.irsExample.annuitization);
  });
  it('switch to RMD (Sam, age 55): $810,250 / 31.6 = $25,641', () => expect(Math.round(payment('rmd', 810250, 55, 0))).toBe(25641));
  it('RMD schedule recomputes every year', () => {
    const s = schedule('rmd', 400000, 50, 0.04, 3, 0.05);
    expect(Math.round(s[0].payment)).toBe(11050);
    expect(s[1].payment).toBeCloseTo(s[1].start / 35.3, 6);
  });
});

describe('72(t): interest cap and lock period', () => {
  it('October 2026: greater of 5 % and 120 % mid-term of Aug (5.23 %) or Sep (5.40 %)', () => {
    const r = maxRate('2026-10');
    expect(r.rate).toBeCloseTo(0.054, 6);
    expect(r.from).toBe('2026-09');
  });
  it('November 2026 uses October (Rev. Rul. 2026-19, 5.54 %)', () => expect(maxRate('2026-11').rate).toBeCloseTo(0.0554, 6));
  it('May 2026: both prior months under 5 %, the floor applies', () => {
    const r = maxRate('2026-05');
    expect(r.rate).toBe(0.05);
    expect(r.from).toBe('floor');
  });
  it('cap months need both prior rulings', () => {
    expect(CAP_MONTHS[0]).toBe('2026-03');
    expect(CAP_MONTHS[CAP_MONTHS.length - 1]).toBe('2026-11');
  });
  it('FAQ Q&A 13: born 1968-08-15, first payment 2024-12-01 -> 2029-12-01', () => expect(lockEnd('2024-12-01', '1968-08-15')).toEqual({ date: '2029-12-01', by: 'five-years' }));
  it('FAQ Q&A 13: first payment 2020-12-01 -> age 59½ on 2028-02-15', () => expect(lockEnd('2020-12-01', '1968-08-15')).toEqual({ date: '2028-02-15', by: 'age' }));
  it('59½ date', () => expect(date59half('1968-08-15')).toBe('2028-02-15'));
});

describe('Federal tax 2026 (Rev. Proc. 2025-32)', () => {
  it('bracket edges match the published base amounts', () => {
    expect(bracketTax(50400, 'single')).toBe(5800);
    expect(bracketTax(105700, 'single')).toBeCloseTo(17966, 6);
    expect(bracketTax(201775, 'single')).toBeCloseTo(41024, 6);
    expect(bracketTax(100800, 'joint')).toBe(11600);
    expect(bracketTax(211400, 'joint')).toBeCloseTo(35932, 6);
    expect(bracketTax(768700, 'joint')).toBeCloseTo(206583.5, 6);
    expect(bracketTax(67450, 'head')).toBeCloseTo(7740, 6);
  });
  it('standard deduction first, then the brackets', () => expect(federalTax({ ordinary: 60000, status: 'single' }).total).toBeCloseTo(5020, 6));
  it('long-term gains: 0 % up to $49,450 of taxable income (single)', () => {
    expect(federalTax({ ordinary: 16100, ltcg: 49450, status: 'single' }).total).toBe(0);
    expect(federalTax({ ordinary: 16100, ltcg: 59450, status: 'single' }).total).toBeCloseTo(1500, 6);
  });
  it('gains stack on ordinary income', () => {
    const t = federalTax({ ordinary: 16100 + 40000, ltcg: 20000, status: 'single' });
    expect(t.gainsTax).toBeCloseTo((40000 + 20000 - 49450) * 0.15, 6);
  });
  it('extra tax of a withdrawal', () => expect(extraTax(0, 16100, 'single')).toBe(0));
});

describe('Rule of 55 and the 10 % (Publication 575, IRS exceptions table)', () => {
  it('left in the year of the 55th birthday', () => expect(ruleOf55({ birthYear: 1971, separationYear: 2026 }).eligible).toBe(true));
  it('left the year before', () => expect(ruleOf55({ birthYear: 1972, separationYear: 2026 }).eligible).toBe(false));
  it('public safety: age 50', () => expect(ruleOf55({ birthYear: 1976, separationYear: 2026, publicSafety: true }).eligible).toBe(true));
  it('public safety: 25 years of service before 50', () => expect(ruleOf55({ birthYear: 1980, separationYear: 2026, publicSafety: true, serviceYears: 25 }).eligible).toBe(true));
  it('rule of 55 does not reach an IRA', () => expect(exceptionCovers('separation55', 'ira', 10000)).toBe(0));
  it('education exception: IRA only', () => {
    expect(exceptionCovers('education', 'plan', 10000)).toBe(0);
    expect(exceptionCovers('education', 'ira', 10000)).toBe(10000);
  });
  it('emergency exception capped at $1,000', () => expect(exceptionCovers('emergency', 'ira', 5000)).toBe(1000));
  it('$10,000 from a 401(k) at 50: $1,000 penalty, 20 % withheld', () => {
    const r = earlyWithdrawal({ amount: 10000, age: 50, account: 'plan', status: 'single' });
    expect(r.penalty).toBe(1000);
    expect(r.withheld).toBe(2000);
    expect(r.federal).toBe(0);
  });
  it('governmental 457(b): no penalty', () => expect(earlyWithdrawal({ amount: 30000, age: 45, account: 'gov457', status: 'single' }).penalty).toBe(0));
  it('gross for net balances', () => {
    const g = grossForNet(20000, { age: 50, account: 'ira', status: 'single', otherIncome: 40000, stateRate: 0.05 });
    expect(g.net).toBeCloseTo(20000, 1);
  });
});

describe('Premium tax credit (Rev. Proc. 2025-25, 2026-26)', () => {
  it('poverty lines from HealthCare.gov', () => {
    expect(povertyLine('2026', 1)).toBe(15650);
    expect(povertyLine('2026', 4)).toBe(32150);
    expect(povertyLine('2027', 4)).toBe(33000);
  });
  it('2026 percentages at the band edges', () => {
    expect(applicablePct('2026', 1.2)).toBe(0.021);
    expect(applicablePct('2026', 2.0)).toBeCloseTo(0.066, 9);
    expect(applicablePct('2026', 2.75)).toBeCloseTo((0.0844 + 0.0996) / 2, 9);
    expect(applicablePct('2026', 4.0)).toBe(0.0996);
    expect(applicablePct('2026', 4.0001)).toBeNull();
  });
  it('2027 percentages', () => expect(applicablePct('2027', 3.5)).toBe(0.1022));
  it('cliff above 400 %', () => {
    const a = premiumCredit({ year: '2026', size: 1, magi: 62600, benchmarkMonthly: 900 });
    const b = premiumCredit({ year: '2026', size: 1, magi: 62601, benchmarkMonthly: 900 });
    expect(a.credit).toBeCloseTo(900 * 12 - 62600 * 0.0996, 6);
    expect(b.credit).toBe(0);
    expect(b.overCap).toBe(true);
  });
});

describe('Roth ordering rules (Publication 590-B)', () => {
  it('contributions, then conversions FIFO, then earnings', () => {
    const r = rothWithdrawal({ contributions: 20000, conversions: [{ year: 2024, amount: 10000 }], earnings: 5000, amount: 32000, year: 2026, age: 45, firstRothYear: 2015 });
    expect(r.pieces.map((p) => p.amount)).toEqual([20000, 10000, 2000]);
    expect(r.penalty).toBeCloseTo(1200, 6);
    expect(r.taxable).toBe(2000);
  });
  it('a 2026 conversion is free from January 1, 2031', () => expect(conversionFreeYear(2026)).toBe(2031));
  it('ladder gap years', () => {
    const l = ladder({ startYear: 2026, amount: 40000, years: 5, otherIncome: 0, status: 'single', spend: 40000, startAge: 45 });
    expect(l[0].available).toBe(0);
    expect(l[5].available).toBe(40000);
    expect(l[0].tax).toBeCloseTo(federalTax({ ordinary: 40000, status: 'single' }).total, 6);
  });
});

describe('FIRE arithmetic', () => {
  it('25 times spending at 4 %', () => expect(fireNumber(40000, 0.04)).toBe(1000000));
  it('years to a target', () => expect(yearsTo(100, 0, 100, 0)).toBe(1));
  it('coast and coast age', () => {
    expect(coast(1000000, 35, 65, 0.05)).toBeCloseTo(1000000 / Math.pow(1.05, 30), 6);
    expect(coastAge(1000000, 300000, 0, 35, 65, 0.05)).toBe(35);
  });
  it('barista', () => expect(barista(50000, 20000, 0.04)).toBe(750000));
  it('lasts', () => {
    expect(lasts(1000000, 40000, 0.05)).toBeNull();
    expect(lasts(100000, 50000, 0)).toBe(2);
  });
  it('crash first ends lower than crash last', () => {
    const c = crashFirstVsLast(1000000, 45000, 0.05, -0.2, 2, 30);
    expect(c.endFirst).toBeLessThan(c.endLast);
  });
  it('savings rate 50 %, 5 %, 4 %: about 17 years', () => {
    const y = yearsFromSavingsRate(0.5, 0.05, 0.04)!;
    expect(y).toBeGreaterThan(16);
    expect(y).toBeLessThan(18);
  });
});

const base: PlanIn = { age: 38, spend: 60000, taxable: 150000, plan: 300000, ira: 50000, roth: 60000, rothBasis: 40000, gov457: 0, savePlan: 24500, saveRoth: 7500, saveTaxable: 15000, r: 0.05, swr: 0.04, status: 'single', stateRate: 0, health: 7200, strategy: 'none', convert: 0, gainShare: 0.4, publicSafety: false };

describe('FIRE plan with access rules', () => {
  it('the rules age is never earlier than the classic age', () => {
    const r = plan(base);
    expect(r.classicAge).not.toBeNull();
    expect(r.rulesAge).not.toBeNull();
    expect(r.rulesAge!).toBeGreaterThanOrEqual(r.classicAge!);
  });
  it('the full number adds tax and the health bridge', () => {
    const n = fireNumbers(base, 45);
    expect(n.classic).toBe(1500000);
    expect(n.tax).toBeGreaterThan(0);
    expect(n.health).toBeGreaterThan(0);
  });
  it('a bridge that needs the IRA before 59½ pays the 10 %', () => {
    const p: PlanIn = { ...base, taxable: 0, roth: 0, rothBasis: 0, plan: 0, ira: 2000000, saveTaxable: 0, saveRoth: 0, savePlan: 0 };
    const b = bridge(p, 45);
    expect(b.penalty).toBeGreaterThan(0);
    expect(b.firstPenaltyAge).toBe(45);
  });
  it('a 72(t) series removes that penalty when it covers the spending', () => {
    const p: PlanIn = { ...base, taxable: 0, roth: 0, rothBasis: 0, plan: 0, ira: 2000000, saveTaxable: 0, saveRoth: 0, savePlan: 0, strategy: 'sepp' };
    const b = bridge(p, 45);
    expect(b.seppPayment).toBeGreaterThan(60000);
    expect(b.penalty).toBe(0);
  });
  it('an IRA under a 72(t) series pays nothing else before the lock ends', () => {
    const p: PlanIn = { ...base, taxable: 0, roth: 0, rothBasis: 0, plan: 0, ira: 600000, saveTaxable: 0, saveRoth: 0, savePlan: 0, strategy: 'sepp' };
    const b = bridge(p, 45);
    expect(b.rows[0].src.I ?? 0).toBe(0);
    expect(b.ok).toBe(false);
  });
  it('rule of 55: leaving at 55 opens the last 401(k)', () => {
    const p: PlanIn = { ...base, taxable: 0, roth: 0, rothBasis: 0, ira: 0, plan: 2000000, saveTaxable: 0, saveRoth: 0 };
    expect(bridge(p, 55).penalty).toBe(0);
    expect(bridge(p, 54).penalty).toBeGreaterThan(0);
  });
});
