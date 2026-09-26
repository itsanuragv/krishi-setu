#!/usr/bin/env python3
"""Push local fixes to itsanuragv/krishi-setu: branch, commit files, open PR, merge."""
import base64
import json
import sys
import urllib.request

sys.path.insert(0, "/opt/hatch/skills/skill-creator/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response

API = "https://api.github.com"
REPO = "/repos/itsanuragv/krishi-setu"
WORKDIR = "/home/hatch/workspace/krishi-setu-fix"
BRANCH = "fix/consumer-pricing-p0"
FILES = [
    "src/lib/mock-data.ts",
    "src/app/consumer/page.tsx",
    "src/context/LanguageContext.tsx",
    "src/components/shared/MatchScoreModal.tsx",
]


def api(method, path, body=None):
    data = None
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "muse-agent",
    }
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(API + path, data=data, headers=headers, method=method)
    add_surrogate_to_request(req, "custom.github", allowed_hosts=["api.github.com"])
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.status, read_json_response(resp)
    except urllib.error.HTTPError as e:
        try:
            payload = json.loads(e.read().decode())
        except Exception:
            payload = {"_error": f"HTTP {e.code}"}
        return e.code, payload


def main():
    # 1. main sha
    code, ref = api("GET", f"{REPO}/git/ref/heads/main")
    assert code == 200, ref
    main_sha = ref["object"]["sha"]
    print("main sha:", main_sha[:8])

    # 2. create branch (ignore if exists)
    code, out = api("POST", f"{REPO}/git/refs",
                    {"ref": f"refs/heads/{BRANCH}", "sha": main_sha})
    print("create branch:", code, out.get("message", out.get("ref", "")))

    # 3. push each file
    for f in FILES:
        code, cur = api("GET", f"{REPO}/contents/{f}?ref={BRANCH}")
        assert code == 200, (f, cur)
        with open(f"{WORKDIR}/{f}", "rb") as fh:
            content = base64.b64encode(fh.read()).decode()
        code, out = api("PUT", f"{REPO}/contents/{f}", {
            "message": f"fix: {f} (P0 consumer pricing bugs)",
            "content": content,
            "sha": cur["sha"],
            "branch": BRANCH,
        })
        print(f"push {f}: {code}", out.get("commit", {}).get("sha", out.get("message"))[:8] if code in (200, 201) else out.get("message"))

    # 4. open PR
    code, pr = api("POST", f"{REPO}/pulls", {
        "title": "Fix P0 consumer pricing bugs (negative savings + unit mismatch)",
        "head": BRANCH,
        "base": "main",
        "body": (
            "## Kya fix kiya\n\n"
            "1. **Negative savings bug (root cause):** `src/lib/mock-data.ts` me 7 listings me "
            "`farmGatePrice > mandiBenchmarkPrice` tha, jisse consumer card pe "
            "`Save ₹-750/quintal (-28% Cheaper)` dikhta tha. Ab farm-gate < mandi (farmer page ke "
            "convention ke hisaab se: mandi = floorPrice × 1.38), savings 19–24% positive.\n\n"
            "2. **Defensive badge:** `src/app/consumer/page.tsx` — agar kabhi bhi savings ≤ 0 ho "
            "(jaise live mandi override me), to ab `-X% Cheaper` ki jagah amber me "
            "`₹X/unit above mandi rate` dikhega. Negative kabhi render nahi hoga.\n\n"
            "3. **Unit mismatch:** `MatchScoreModal.tsx` me price metric hardcoded `/kg` tha jabki "
            "listing unit `quintal` hai — ab `/${listing.unit}` use hota hai.\n\n"
            "4. **i18n:** `card_above_mandi_label` key add (EN + HI).\n\n"
            "## Verify\n- `npm run build` local pe successful (Next.js 15).\n"
        ),
    })
    print("open PR:", code, pr.get("number", pr.get("message")))
    if code != 201:
        # maybe PR already exists
        code2, prs = api("GET", f"{REPO}/pulls?head=itsanuragv:{BRANCH}&state=open")
        pr = prs[0] if prs else None
        print("existing PR lookup:", code2, pr["number"] if pr else None)
    if not pr or "number" not in pr:
        print("FAILED to open/find PR"); sys.exit(1)
    number = pr["number"]

    # 5. merge
    code, out = api("PUT", f"{REPO}/pulls/{number}/merge",
                    {"merge_method": "merge",
                     "commit_title": f"Fix P0 consumer pricing bugs (#{number})"})
    print("merge:", code, out.get("message"), out.get("sha", "")[:8] if out.get("sha") else "")
    print("PR_URL:", pr.get("html_url"))


if __name__ == "__main__":
    main()
