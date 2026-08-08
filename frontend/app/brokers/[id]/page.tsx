import React from 'react';
import BrokerProfileClient from './BrokerProfileClient';
import { SEED_BROKERS } from '@/lib/data/seedData';

export function generateStaticParams() {
  return SEED_BROKERS.map(b => ({ id: b.id }));
}

export default async function BrokerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BrokerProfileClient id={id} />;
}
