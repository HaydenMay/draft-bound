#!/usr/bin/env python3
"""Validate the supplied v1.4.1 receiver export and emit Draftbound runtime JSON."""

from __future__ import annotations

import argparse
import csv
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

ATTRIBUTES = [
    ("speed", "speed"),
    ("acceleration", "acceleration"),
    ("hands", "hands"),
    ("routeRunning", "routeRunning"),
    ("release", "release"),
    ("vertical", "vertical"),
    ("bodyControl", "bodyControl"),
    ("yardsAfterCatch", "yardsAfterCatch"),
    ("footballIQ", "awareness"),
]
GRADES = {"S", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"}
CEILINGS = {"S": 99, "A+": 96, "A": 93, "A-": 90, "B+": 87, "B": 84, "B-": 81, "C+": 78, "C": 75, "C-": 72, "D+": 69, "D": 66, "D-": 63, "F": 60}
WEIGHTS = {"speed": .14, "acceleration": .08, "hands": .16, "routeRunning": .18, "release": .12, "vertical": .08, "bodyControl": .10, "yardsAfterCatch": .08, "awareness": .06}
BENCHMARK_COLUMNS = {"speed": "SPD", "acceleration": "ACC", "hands": "HND", "routeRunning": "RTE", "release": "REL", "vertical": "VRT", "bodyControl": "BCT", "yardsAfterCatch": "YAC", "awareness": "IQ"}
CATALOG_VERSION = "wr-v1.4.1-provisional-498"
EXPECTED_SOURCE = {"profiles": 498, "memberships": 521, "teams": 32, "benchmarks": 20}
STABLE_ID = re.compile(r"^[a-z0-9]+(?:[-_][a-z0-9]+)*$")


def _split_codes(value: str) -> list[str]:
    return [part.strip().upper() for part in (value or "").split(";") if part.strip()]


def _split_values(value: str) -> list[str]:
    return [part.strip() for part in (value or "").split(";") if part.strip()]


def _csv(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))


def transform(
    rows: list[dict[str, str]],
    team_rows: list[dict[str, str]],
    membership_rows: list[dict[str, str]] | None = None,
    benchmarks: list[dict[str, str]] | None = None,
    unassigned: list[dict[str, str]] | None = None,
    expected: dict[str, int] | None = None,
) -> dict[str, Any]:
    benchmarks = benchmarks or []
    unassigned = unassigned or []
    team_by_code: dict[str, dict[str, str]] = {}
    for team in team_rows:
        code = (team.get("code") or "").strip().upper()
        name = (team.get("name") or "").strip()
        if not code or not name or code in team_by_code:
            raise ValueError(f"invalid or duplicate team code: {code or '(blank)'}")
        team_by_code[code] = {"id": code.lower(), "code": code, "displayName": name}
    if not team_by_code:
        raise ValueError("team catalog is empty")

    profiles: list[dict[str, Any]] = []
    profile_by_id: dict[str, dict[str, Any]] = {}
    profile_by_name: dict[str, list[dict[str, Any]]] = {}
    for row in rows:
        player_id = (row.get("player_id") or "").strip()
        name = (row.get("player_name") or "").strip()
        if not STABLE_ID.fullmatch(player_id):
            raise ValueError(f"invalid stable profile ID: {player_id or '(blank)'}")
        if player_id in profile_by_id:
            raise ValueError(f"duplicate profile ID: {player_id}")
        if not name:
            raise ValueError(f"{player_id}: missing player name")

        eligible_codes = _split_codes(row.get("eligible_teams", ""))
        source_codes = _split_codes(row.get("source_teams", ""))
        if not eligible_codes:
            raise ValueError(f"{player_id}: no eligible team")
        if len(eligible_codes) != len(set(eligible_codes)):
            raise ValueError(f"{player_id}: duplicate eligible team")
        for code in eligible_codes + source_codes:
            if code not in team_by_code:
                raise ValueError(f"{player_id}: unknown eligible team {code}")

        grades: dict[str, str] = {}
        for csv_key, game_key in ATTRIBUTES:
            grade = (row.get(csv_key) or "").strip()
            if grade not in GRADES:
                raise ValueError(f"{player_id}: invalid grade {grade or '(blank)'} for {csv_key}")
            grades[game_key] = grade
        expected_weighted = sum(CEILINGS[grades[key]] * weight for key, weight in WEIGHTS.items())
        try:
            supplied_weighted = float(row.get("weightedPotentialCeiling", ""))
            supplied_s_count = int(row.get("s_count", ""))
        except ValueError as error:
            raise ValueError(f"{player_id}: invalid weighted ceiling or S count") from error
        actual_s_count = sum(grade == "S" for grade in grades.values())
        if abs(supplied_weighted - round(expected_weighted, 1)) > .011:
            raise ValueError(f"{player_id}: weighted ceiling disagrees with grades")
        if supplied_s_count != actual_s_count:
            raise ValueError(f"{player_id}: S count disagrees with grades")

        profile = {
            "id": player_id,
            "name": name,
            "status": (row.get("status") or "").strip(),
            "eligibleTeamIds": [code.lower() for code in eligible_codes],
            "sourceTeamIds": [code.lower() for code in source_codes],
            "grades": grades,
            "weightedPotentialCeiling": round(supplied_weighted, 2),
            "sCount": supplied_s_count,
            "provenance": {
                "sourceIds": _split_values(row.get("source_ids", "")),
                "gradingMethod": (row.get("grading_method") or "").strip(),
                "confidence": (row.get("confidence") or "").strip(),
                "basis": (row.get("basis") or "").strip(),
                "scoutingReference": (row.get("scouting_reference") or "").strip(),
                "rosterReference": (row.get("roster_reference") or "").strip(),
                "reviewStatus": (row.get("review_status") or "").strip(),
                "notes": (row.get("notes") or "").strip(),
            },
        }
        profiles.append(profile)
        profile_by_id[player_id] = profile
        profile_by_name.setdefault(name.casefold(), []).append(profile)

    memberships: list[dict[str, Any]] = []
    seen_eligible: set[tuple[str, str]] = set()
    if membership_rows is None:
        membership_rows = [
            {"Team ID": code, "Canonical player ID": profile["id"], "Eligible in 2026 draw?": "yes"}
            for profile in profiles
            for code in (row for row in next(item for item in rows if item["player_id"] == profile["id"])["eligible_teams"].split(";") if row.strip())
        ]
    for row in membership_rows:
        code = (row.get("Team ID") or "").strip().upper()
        player_id = (row.get("Canonical player ID") or "").strip()
        if not code or code not in team_by_code:
            raise ValueError(f"membership has unknown eligible team {code or '(blank)'}")
        if player_id not in profile_by_id:
            raise ValueError(f"membership has unknown profile ID {player_id or '(blank)'}")
        eligible = (row.get("Eligible in 2026 draw?") or "").strip().lower() in {"yes", "true", "1"}
        key = (code.lower(), player_id)
        if eligible and key in seen_eligible:
            raise ValueError(f"duplicate eligible membership: {code}/{player_id}")
        if eligible:
            seen_eligible.add(key)
        memberships.append({
            "teamId": code.lower(),
            "receiverId": player_id,
            "eligible": eligible,
            "poolCategory": (row.get("Pool category") or "").strip(),
            "rosterStatus": (row.get("Roster status") or "").strip(),
            "snapshot": (row.get("Snapshot") or "").strip(),
            "provenance": (row.get("Provenance") or "").strip(),
            "note": (row.get("Review note") or "").strip(),
        })

    eligible_by_profile: dict[str, set[str]] = {player_id: set() for player_id in profile_by_id}
    eligible_by_team: Counter[str] = Counter()
    for membership in memberships:
        if membership["eligible"]:
            eligible_by_profile[membership["receiverId"]].add(membership["teamId"])
            eligible_by_team[membership["teamId"]] += 1
    for profile in profiles:
        declared = set(profile["eligibleTeamIds"])
        observed = eligible_by_profile[profile["id"]]
        if declared != observed:
            raise ValueError(f"{profile['id']}: eligible teams disagree with membership source")
    if any(team["id"] not in eligible_by_team for team in team_by_code.values()):
        raise ValueError("every team must have an eligible receiver pool")

    normalized_benchmarks = []
    for row in benchmarks:
        name = (row.get("Receiver") or "").strip()
        if not name:
            continue
        grades = {game_key: (row.get(BENCHMARK_COLUMNS[game_key]) or "").strip() for _csv_key, game_key in ATTRIBUTES}
        for grade in grades.values():
            if grade not in GRADES:
                raise ValueError(f"benchmark {name}: invalid grade {grade or '(blank)'}")
        matches = profile_by_name.get(name.casefold(), [])
        if (row.get("In eligible pool?") or "").strip().lower() == "yes":
            if len(matches) != 1:
                raise ValueError(f"eligible benchmark {name}: expected exactly one catalog profile")
            if matches[0]["grades"] != grades:
                raise ValueError(f"benchmark grades disagree with profile: {name}")
        normalized_benchmarks.append({
            "name": name,
            "grades": grades,
            "eligibleInPool": (row.get("In eligible pool?") or "").strip().lower() == "yes",
            "note": (row.get("Note") or "").strip(),
            "catalogProfileId": matches[0]["id"] if len(matches) == 1 else None,
        })

    catalog = {
        "catalogVersion": CATALOG_VERSION,
        "sourceStatus": "provisional",
        "attributes": [game_key for _csv_key, game_key in ATTRIBUTES],
        "teams": list(team_by_code.values()),
        "profiles": profiles,
        "memberships": memberships,
        "benchmarks": normalized_benchmarks,
        "unassignedSources": unassigned,
    }
    if expected:
        actual = {
            "profiles": len(profiles),
            "memberships": len(seen_eligible),
            "teams": len(team_by_code),
            "benchmarks": len(normalized_benchmarks),
        }
        for key, count in expected.items():
            if actual[key] != count:
                raise ValueError(f"snapshot mismatch for {key}: expected {count}, received {actual[key]}")
    return catalog


def audit(catalog: dict[str, Any]) -> dict[str, Any]:
    eligible = [membership for membership in catalog["memberships"] if membership["eligible"]]
    team_counts = Counter(membership["teamId"] for membership in eligible)
    profiles = catalog["profiles"]
    return {
        "catalogVersion": catalog["catalogVersion"],
        "sourceStatus": catalog["sourceStatus"],
        "counts": {
            "profiles": len(profiles),
            "current2026Profiles": sum(profile["status"] == "current_2026" for profile in profiles),
            "historicalCandidateProfiles": sum(profile["status"] == "historical_candidate" for profile in profiles),
            "teams": len(catalog["teams"]),
            "eligibleMemberships": len(eligible),
            "ineligibleMembershipRows": len(catalog["memberships"]) - len(eligible),
            "unassignedReviewProfiles": len(catalog["unassignedSources"]),
            "benchmarks": len(catalog["benchmarks"]),
        },
        "gradingMethods": dict(Counter(profile["provenance"]["gradingMethod"] for profile in profiles)),
        "confidence": dict(Counter(profile["provenance"]["confidence"] for profile in profiles)),
        "reviewStatus": dict(Counter(profile["provenance"]["reviewStatus"] for profile in profiles)),
        "eligiblePoolSizes": {team["id"]: team_counts[team["id"]] for team in catalog["teams"]},
        "teamPoolSizeRange": {"minimum": min(team_counts.values()), "maximum": max(team_counts.values())},
        "duplicateEligibleMemberships": 0,
    }


def runtime_catalog(catalog: dict[str, Any]) -> dict[str, Any]:
    """Keep only gameplay fields in the downloaded bundle; full evidence stays in CSV."""
    return {
        "catalogVersion": catalog["catalogVersion"],
        "sourceStatus": catalog["sourceStatus"],
        "attributes": catalog["attributes"],
        "teams": catalog["teams"],
        "profiles": [{
            "id": profile["id"],
            "name": profile["name"],
            "status": profile["status"],
            "eligibleTeamIds": profile["eligibleTeamIds"],
            "grades": profile["grades"],
            "provenance": {
                "gradingMethod": profile["provenance"]["gradingMethod"],
                "confidence": profile["provenance"]["confidence"],
                "reviewStatus": profile["provenance"]["reviewStatus"],
            },
        } for profile in catalog["profiles"]],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-dir", type=Path, default=Path("tools/data"))
    parser.add_argument("--output", type=Path, default=Path("src/app/data/receiver-catalog.json"))
    parser.add_argument("--audit", type=Path, default=Path("docs/validation/V1_4_2_CATALOG_AUDIT.json"))
    parser.add_argument("--snapshot-check", action="store_true", help="enforce the supplied 498/521/32/20 source snapshot")
    args = parser.parse_args()
    data = args.data_dir
    teams = json.loads((data / "receiver-teams.json").read_text(encoding="utf-8"))
    catalog = transform(
        _csv(data / "receiver-grades.csv"),
        teams,
        _csv(data / "team-memberships.csv"),
        _csv(data / "receiver-benchmarks.csv"),
        _csv(data / "unassigned-sources.csv"),
        EXPECTED_SOURCE if args.snapshot_check else None,
    )
    report = audit(catalog)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.audit.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(runtime_catalog(catalog), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.audit.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report["counts"], sort_keys=True))


if __name__ == "__main__":
    main()
