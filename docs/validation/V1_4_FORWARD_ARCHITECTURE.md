# v1.4.1 Forward Architecture Note

This is a handoff note only; it does not authorize v1.4.1 implementation.

Before adding more playable positions, a v1.4.1 architecture pass should define position-owned schemas for attributes, natural-gift source pools, training groups, recruiting inputs, team and school identities, prospect display, development and overall formulas, draft logic, professional simulation, achievements, card rendering, and migrations. Shared interfaces should describe the gameplay lifecycle, while position-specific adapters provide their own implementation. Avoid widening the WR-specific model with optional fields for every future position.

Add contract tests for save migration, deterministic RNG boundaries, source-catalog versioning, attribute-to-potential validation, card rendering inputs, and unsupported-position round trips before implementing another position. Keep existing serialized WR data and professional outcomes as golden compatibility fixtures. The current v1.4 source/rules discriminators are the minimum versioning pattern to carry forward.

Future recruiting, real-world team references, analytics or advertising, accounts, and Firebase/cloud saves each change privacy/legal or data-retention assumptions. Before implementing any of those systems, review the About, Terms, Privacy, and Contact copy and get owner approval for the required legal/policy updates.
