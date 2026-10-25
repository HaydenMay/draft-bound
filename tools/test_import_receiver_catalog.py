import importlib.util
import json
import unittest
from pathlib import Path


SPEC = importlib.util.spec_from_file_location(
    "import_receiver_catalog", Path(__file__).with_name("import_receiver_catalog.py")
)
IMPORTER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(IMPORTER)


def row(player_id="alpha", teams="BUF", grade="A"):
    item = {
        "player_id": player_id,
        "player_name": player_id.title(),
        "eligible_teams": teams,
        "source_teams": teams,
        "status": "current_2026",
        "source_ids": player_id,
        "weightedPotentialCeiling": "93.0",
        "s_count": "0",
        "grading_method": "player_specific_proposal",
        "confidence": "medium",
        "basis": "test basis",
        "scouting_reference": "",
        "roster_reference": "",
        "review_status": "needs_manual_verification",
        "notes": "",
    }
    item.update({column: grade for column, _attribute in IMPORTER.ATTRIBUTES})
    return item


class ReceiverCatalogImportTests(unittest.TestCase):
    def test_approved_source_snapshot_keeps_auditable_benchmarks_and_memberships(self):
        data = Path(__file__).parent / "data"
        catalog = IMPORTER.transform(
            IMPORTER._csv(data / "receiver-grades.csv"),
            json.loads((data / "receiver-teams.json").read_text(encoding="utf-8")),
            IMPORTER._csv(data / "team-memberships.csv"),
            IMPORTER._csv(data / "receiver-benchmarks.csv"),
            IMPORTER._csv(data / "unassigned-sources.csv"),
            IMPORTER.EXPECTED_SOURCE,
        )
        benchmarks = {item["name"]: item for item in catalog["benchmarks"]}
        self.assertEqual(benchmarks["John Ross"]["grades"]["speed"], "S")
        self.assertEqual(benchmarks["John Ross"]["grades"]["acceleration"], "A+")
        self.assertEqual(benchmarks["DK Metcalf"]["grades"]["routeRunning"], "C+")
        self.assertEqual(sum(row["eligible"] for row in catalog["memberships"]), 521)
        self.assertEqual(sum(not row["eligible"] for row in catalog["memberships"]), 4)
        self.assertEqual(len(catalog["benchmarks"]), 20)

    def test_converts_profiles_and_team_memberships_without_losing_provenance(self):
        teams = [{"code": "BUF", "name": "Buffalo Bills"}]
        catalog = IMPORTER.transform([row()], teams)

        self.assertEqual(catalog["profiles"][0]["id"], "alpha")
        self.assertEqual(catalog["profiles"][0]["grades"]["awareness"], "A")
        self.assertEqual(catalog["profiles"][0]["provenance"]["reviewStatus"], "needs_manual_verification")
        self.assertEqual(catalog["memberships"], [{
            "teamId": "buf", "receiverId": "alpha", "eligible": True,
            "poolCategory": "", "rosterStatus": "", "snapshot": "",
            "provenance": "", "note": "",
        }])

    def test_rejects_duplicate_profile_ids(self):
        with self.assertRaisesRegex(ValueError, "duplicate profile ID"):
            IMPORTER.transform([row(), row()], [{"code": "BUF", "name": "Buffalo Bills"}], [])

    def test_runtime_projection_retains_grades_and_review_flags_without_bundling_audit_notes(self):
        full = IMPORTER.transform([row()], [{"code": "BUF", "name": "Buffalo Bills"}])
        runtime = IMPORTER.runtime_catalog(full)
        self.assertEqual(runtime["profiles"][0]["grades"]["speed"], "A")
        self.assertEqual(runtime["profiles"][0]["provenance"]["reviewStatus"], "needs_manual_verification")
        self.assertNotIn("basis", runtime["profiles"][0]["provenance"])
        self.assertNotIn("memberships", runtime)

    def test_rejects_unknown_team_codes(self):
        with self.assertRaisesRegex(ValueError, "unknown eligible team"):
            IMPORTER.transform([row(teams="XYZ")], [{"code": "BUF", "name": "Buffalo Bills"}], [])

    def test_rejects_invalid_grade_values(self):
        with self.assertRaisesRegex(ValueError, "invalid grade"):
            bad = row(grade="A++")
            IMPORTER.transform([bad], [{"code": "BUF", "name": "Buffalo Bills"}], [])


if __name__ == "__main__":
    unittest.main()
