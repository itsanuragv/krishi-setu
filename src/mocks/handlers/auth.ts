import { http, HttpResponse } from "msw";
import { DEMO_OTP, delay, users } from "@/mocks/data";
import type { User } from "@/lib/schemas/user";

export const authHandlers = [
  http.post("/api/auth/otp", async ({ request }) => {
    await delay();
    const body = (await request.json()) as { phone?: string };
    if (!body.phone || !/^[6-9]\d{9}$/.test(body.phone)) {
      return HttpResponse.json({ message: "Invalid phone number" }, { status: 400 });
    }
    return HttpResponse.json({ sent: true, demoHint: DEMO_OTP });
  }),

  http.post("/api/auth/verify", async ({ request }) => {
    await delay();
    const body = (await request.json()) as {
      phone?: string;
      otp?: string;
      role?: User["role"];
      name?: string;
      district?: string;
      state?: string;
      village?: string;
      language?: User["language"];
    };

    if (body.otp !== DEMO_OTP) {
      return HttpResponse.json({ message: "Incorrect OTP" }, { status: 401 });
    }

    let user = users.find((u) => u.phone === body.phone);
    if (!user) {
      if (!body.role || !body.name) {
        return HttpResponse.json({ message: "Complete registration first" }, { status: 404 });
      }
      user = {
        id: `u-${crypto.randomUUID()}`,
        role: body.role,
        name: body.name,
        phone: body.phone ?? "",
        language: body.language ?? "en",
        district: body.district,
        state: body.state,
        village: body.village,
        trustScore: 50,
      };
      users.push(user);
    }

    return HttpResponse.json({ user });
  }),

  http.get("/api/me", async ({ request }) => {
    await delay(120);
    const uid = request.headers.get("X-User-Id");
    const user = users.find((u) => u.id === uid);
    if (!user) return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    return HttpResponse.json({ user });
  }),
];
