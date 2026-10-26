# Career recap and ceiling labels

Confirmed defects: the career synopsis appended stored induction criteria (including two All-Pro seasons for modern careers) directly after retirement age, making requirements look like earned outcomes. The saved blueprint interpolated raw fractional ceilings while rounding current ability; other views formatted ceilings differently.

The recap now states the recorded earned All-Pro count. Stored induction criteria live under an explicit Hall of Fame requirements disclosure. Existing careers retain their own criteria, awards, season flags and outcomes. Current ability and ceiling labels use the same whole-number convention; underlying attribute values and saved ceilings retain full precision.

Three new browser tests failed on the original code and passed after the fix: zero earned awards versus two required; two actually earned awards; mobile fractional school-earned ceilings and unchanged data after reload. Typecheck and all 156 unit tests passed. Pages production build passed with the existing initial-size budget warning. Full browser coverage is gated by the GitHub release workflow. This is presentation-only; no award eligibility or training rules changed. Legal release checkpoint reviewed.

Fresh read-only review: no actionable defects. Mobile screenshots visually checked for the earned-count/requirements distinction and whole-number blueprint labels. The original owner save was not inspected; the confirmed wording and formatting defects were reproduced with synthetic saved careers. If a count-versus-season-table discrepancy persists, it needs separate save-specific investigation.
