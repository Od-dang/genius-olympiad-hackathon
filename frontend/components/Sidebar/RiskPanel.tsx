'use client';

import { useState } from 'react';
import { RiskAssessment, DisasterRisk, RISK_BORDER, RISK_TEXT, RISK_CARD_BG, RISK_GLOW, RISK_COLORS } from '@/types';
import DisasterBadge from '@/components/ui/DisasterBadge';

interface Props {
  assessment: RiskAssessment;
}

function RiskCard({ risk }: { risk: DisasterRisk }) {
  const [expanded, setExpanded] = useState(
    risk.riskLevel === 'CRITICAL' || risk.riskLevel === 'HIGH',
  );
  const [tipsTab, setTipsTab] = useState<'before' | 'during' | 'after'>('before');

  const isActive = risk.riskLevel !== 'NONE';

  return (
    <div
      className={`rounded-xl border-2 ${RISK_BORDER[risk.riskLevel]} ${RISK_CARD_BG[risk.riskLevel]} ${RISK_GLOW[risk.riskLevel]} overflow-hidden transition-all`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
      >
        <span className="text-2xl">{risk.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white">{risk.label}</span>
            <DisasterBadge level={risk.riskLevel} size="sm" />
          </div>
          {risk.matchedConditions.length > 0 && (
            <div className="text-xs text-blue-400 mt-0.5">
              {risk.matchedConditions.length} risk factor{risk.matchedConditions.length !== 1 ? 's' : ''} detected
            </div>
          )}
        </div>

        {/* Score bar */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-extrabold ${RISK_TEXT[risk.riskLevel]}`}>
            {risk.riskScore}%
          </span>
          <div className="w-14 h-2 bg-blue-950 rounded-full overflow-hidden border border-blue-800">
            <div
              className="h-full rounded-full"
              style={{
                width: `${risk.riskScore}%`,
                backgroundColor: RISK_COLORS[risk.riskLevel],
              }}
            />
          </div>
        </div>
        <span className="text-blue-600 text-xs ml-1">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-blue-900/60 px-4 py-3 space-y-3">
          <p className="text-xs text-blue-400">{risk.description}</p>

          {/* Matched conditions */}
          {risk.matchedConditions.length > 0 && (
            <div>
              <div className="text-xs text-blue-600 uppercase tracking-wider mb-1.5 font-semibold">
                Active risk factors
              </div>
              <ul className="space-y-1">
                {risk.matchedConditions.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: RISK_COLORS[risk.riskLevel] }}
                    />
                    <span className={RISK_TEXT[risk.riskLevel]}>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {isActive && (
            <div>
              <div className="text-xs text-blue-600 uppercase tracking-wider mb-1.5 font-semibold">
                What to do
              </div>
              <div className="flex gap-1 mb-2">
                {(['before', 'during', 'after'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipsTab(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      tipsTab === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-900/60 text-blue-400 hover:bg-blue-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <ul className="space-y-1.5">
                {risk.tips[tipsTab].slice(0, 4).map((tip, i) => (
                  <li key={i} className="text-xs text-blue-200 flex gap-2">
                    <span className="text-blue-500 shrink-0">›</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const OVERALL_CONFIG = {
  NONE:     { icon: '✅', label: 'All Clear',   color: 'text-green-400',  border: 'border-green-700',  bg: 'bg-green-950/40'  },
  LOW:      { icon: '🟢', label: 'Low Risk',    color: 'text-green-400',  border: 'border-green-600',  bg: 'bg-green-950/50'  },
  MODERATE: { icon: '🟡', label: 'Moderate Risk', color: 'text-yellow-400', border: 'border-yellow-600', bg: 'bg-yellow-950/50' },
  HIGH:     { icon: '🔴', label: 'High Risk',   color: 'text-orange-400', border: 'border-orange-500', bg: 'bg-orange-950/50' },
  CRITICAL: { icon: '🚨', label: 'Critical Risk', color: 'text-red-400',  border: 'border-red-500',    bg: 'bg-red-950/50'    },
};

export default function RiskPanel({ assessment }: Props) {
  const cfg = OVERALL_CONFIG[assessment.highestRisk];
  const activeRisks = assessment.risks.filter((r) => r.riskLevel !== 'NONE');
  const noRisks     = assessment.risks.filter((r) => r.riskLevel === 'NONE');

  return (
    <div className="p-4 space-y-4">

      {/* Overall status banner */}
      <div className={`rounded-xl p-4 border-2 ${cfg.border} ${cfg.bg} flex items-center gap-4`}>
        <span className="text-4xl">{cfg.icon}</span>
        <div>
          <div className="text-xs text-blue-400 uppercase tracking-widest font-semibold mb-0.5">
            Overall Risk Level
          </div>
          <div className={`text-2xl font-extrabold ${cfg.color}`}>{cfg.label}</div>
          <div className="text-xs text-blue-500 mt-0.5">
            {activeRisks.length} active risk{activeRisks.length !== 1 ? 's' : ''} detected
          </div>
        </div>
      </div>

      {/* Active risk cards */}
      {activeRisks.length > 0 && (
        <div className="space-y-2.5">
          <div className="text-xs text-blue-500 uppercase tracking-widest font-semibold">
            Active Risks
          </div>
          {activeRisks.map((risk) => (
            <RiskCard key={risk.type} risk={risk} />
          ))}
        </div>
      )}

      {/* No-risk disasters */}
      {noRisks.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-blue-700 uppercase tracking-widest font-semibold">
            No Current Risk
          </div>
          {noRisks.map((risk) => (
            <RiskCard key={risk.type} risk={risk} />
          ))}
        </div>
      )}
    </div>
  );
}
