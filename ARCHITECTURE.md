# Architecture

```
leftBehind, moved (or legs)
        │
        ▼
   movedShare → total, bps, leftBps, flags
        │
        ├── fromLegs
        ├── allocationBps
        ├── movedBar
        └── exportMovedMarkdown
```

Honesty boundary: no Alcor API, no wallet, no broadcast.
