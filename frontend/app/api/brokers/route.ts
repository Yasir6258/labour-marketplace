import { NextResponse } from 'next/server';
import { SEED_BROKERS } from '@/lib/data/seedData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const division = searchParams.get('division');
  const district = searchParams.get('district');
  const upazila = searchParams.get('upazila');
  const service = searchParams.get('service');
  const q = searchParams.get('q')?.toLowerCase();

  let filtered = [...SEED_BROKERS];

  if (division && division !== 'All') {
    filtered = filtered.filter(b => b.location.division === division);
  }
  if (district && district !== 'All') {
    filtered = filtered.filter(b => b.location.district === district);
  }
  if (upazila && upazila !== 'All') {
    filtered = filtered.filter(b => b.location.upazila === upazila);
  }
  if (service && service !== 'All') {
    filtered = filtered.filter(b => b.servicesOffered.includes(service));
  }
  if (q) {
    filtered = filtered.filter(
      b =>
        b.name.toLowerCase().includes(q) ||
        (b.nameBn && b.nameBn.includes(q)) ||
        b.location.district.toLowerCase().includes(q) ||
        b.location.upazila.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
}
