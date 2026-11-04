# cater-capacity-engine

High-precision capacity planning, queue wait time algorithms, and live counter duplication heuristics for South Indian weddings and grand buffet catering.

## Installation

```bash
npm install cater-capacity-engine
```

## Features

- **Queue Bottleneck Diagnostics**: Calculates real-world guest flow rates and live counter wait times.
- **Counter Duplication Heuristics**: Automatically flags when live cooking stations (e.g. Dosa griddle) need to be duplicated into North and South wings.
- **Infrastructure Sizing**: Computes total electrical power (kW) and plumbing/water line requirements for the hall.
- **Pure TypeScript**: Zero UI or DOM dependencies; runs seamlessly in Node.js, browsers, or Edge workers.

## Usage

```typescript
import { calculateCateringCapacity } from "cater-capacity-engine";

const analysis = calculateCateringCapacity(500, ["buffet_spread", "dosa", "sweet_halwa"]);

console.log(analysis.queueStatus); // "congested"
console.log(analysis.recommendedDosaCounters); // 3
console.log(analysis.adviceList[0].title); 
// "Critical Bottleneck: Duplicate Live Dosa Counter (1 active vs 3 needed)"
```
