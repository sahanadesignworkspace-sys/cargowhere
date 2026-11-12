# Project Prompts & Development History

This document collates all prompts used during the development of **ParkSG (Cargowhere)**: a Singapore-based real-time carpark availability application with serverless LTA DataMall integration.

---

## Prompt 1: Initial Frontend Application Build

**Date**: 2026-11-12  
**Prompt**:
```text
Build a Singapore based carpark application that tracks real time carpark lots availability. Build just the frontend for now, I will integrate the backend later.
```

**Actions Taken**:
- Developed interactive Singapore carpark application with Leaflet maps, custom lot-count markers, color-coded availability (High, Moderate, Low, Full), and district quick jumps.
- Built scannable Carpark Directory with real-time filters (Vehicle Type: Cars/Bikes/Heavy, HDB/URA/Commercial/Malls, EV Charging, Sheltered).
- Implemented Carpark Detail drawer with live lots breakdown, 24h peak occupancy pattern chart, parking tariff breakdown, and dynamic parking fee calculator with grace period calculation.
- Added fee comparison modal and comprehensive Singapore Parking Guide (white/red/bi-coloured lots, EPS, Free Parking Scheme, EV guidelines).
- Integrated official Data.gov.sg real-time carpark availability feed with 60-second periodic sync and manual refresh.

---

## Prompt 2: GitHub Repository Push

**Date**: 2026-11-12  
**Prompt**:
```text
git push https://ghp_***@github.com/sahanadesignworkspace-sys/cargowhere.git
```
*(Token redacted for security)*

**Actions Taken**:
- Initialized git repository with main branch.
- Added all 21 project files, committed initial build, and pushed to `https://github.com/sahanadesignworkspace-sys/cargowhere.git`.

---

## Prompt 3: Serverless LTA DataMall v2 Integration

**Date**: 2026-11-12  
**Prompt**:
```text
1. add a serverless connection that pulls live data from LTA's datamall using the following endpoint: 

# Live carpark lots (HDB, LTA and URA):
https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2

# Every request needs the header:  AccountKey: <LTA_ACCOUNT_KEY>

2. store this in /api folder at project root root level (not the src file)
3. include /health.ts and /carparkavailability.ts within the same sub folder
4. do not hardcode any key, I will input them later
```

**Actions Taken**:
- Created `/api/carparkavailability.ts` connecting to `https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2` with `AccountKey` header injection.
- Implemented environment variable handling via `process.env.LTA_ACCOUNT_KEY` without hardcoding credentials, including fallback handling and pagination support (`?all=true` or `$skip`).
- Created `/api/health.ts` for service health monitoring and verification.
- Created `/server.ts` full-stack server mounting `/api/*` routes and Vite frontend.
- Documented `LTA_ACCOUNT_KEY` in `/.env.example`.
- Committed and pushed to GitHub repository (`commit fa054f5`).

---

## Prompt 4: Prompts Documentation

**Date**: 2026-11-12  
**Prompt**:
```text
collate all of the prompts and store them as a PROMPTS.md file
```

**Actions Taken**:
- Collated all project prompts, chronological logs, and corresponding implementation actions into `PROMPTS.md`.
