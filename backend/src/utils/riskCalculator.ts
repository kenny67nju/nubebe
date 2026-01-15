// Risk calculation utilities
import { UnifiedEvent } from '@prisma/client';
import { RiskMetrics } from '../types/index.js';

const LARGE_TRANSACTION_THRESHOLD = 500000; // CNY
const LARGE_TX_SCORE = 10;
const CROSS_BORDER_SCORE = 15;
const SUSPICIOUS_CRYPTO_SCORE = 50;
const BROKEN_FLOW_SCORE = 30;

export const calculateRiskMetrics = (events: UnifiedEvent[]): RiskMetrics => {
  const largeTransactionCount = events.filter(
    e => Math.abs(e.functionalAmount) > LARGE_TRANSACTION_THRESHOLD
  ).length;

  const crossBorderCount = events.filter(
    e => e.currency !== 'CNY' &&
    (e.eventType === 'TRANSFER_OUT' || e.eventType === 'BANK_WITHDRAWAL')
  ).length;

  const suspiciousCryptoCount = events.filter(
    e => e.assetClass === 'CRYPTO' && e.complianceStatus !== 'COMPLIANT'
  ).length;

  const brokenFlowCount = events.filter(
    e => e.linkedEventId && !e.fundFlowPath?.length
  ).length;

  const totalRiskScore =
    (largeTransactionCount * LARGE_TX_SCORE) +
    (crossBorderCount * CROSS_BORDER_SCORE) +
    (suspiciousCryptoCount * SUSPICIOUS_CRYPTO_SCORE) +
    (brokenFlowCount * BROKEN_FLOW_SCORE);

  return {
    largeTransactionCount,
    crossBorderCount,
    suspiciousCryptoCount,
    brokenFlowCount,
    totalRiskScore,
  };
};

export const assessEventRisk = (event: UnifiedEvent): number => {
  let score = 0;

  // Large transaction
  if (Math.abs(event.functionalAmount) > LARGE_TRANSACTION_THRESHOLD) {
    score += LARGE_TX_SCORE;
  }

  // Cross-border
  if (event.currency !== 'CNY' &&
      (event.eventType === 'TRANSFER_OUT' || event.eventType === 'BANK_WITHDRAWAL')) {
    score += CROSS_BORDER_SCORE;
  }

  // Suspicious crypto
  if (event.assetClass === 'CRYPTO' && event.complianceStatus !== 'COMPLIANT') {
    score += SUSPICIOUS_CRYPTO_SCORE;
  }

  // Verification status
  if (event.verificationStatus === 'RISK_FLAG') {
    score += 25;
  } else if (event.verificationStatus === 'UNVERIFIED') {
    score += 10;
  }

  // Long-arm jurisdiction
  if (event.jurisdictionType === 'LONG_ARM') {
    score += 20;
  }

  return score;
};
