import { connectDB } from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { requireAdmin } from "@/lib/adminMiddleware";
import { refresh, TAGS } from "@/lib/cache";
import { NextResponse } from "next/server";

const FIELDS = [
  "role",
  "company",
  "companyUrl",
  "employmentType",
  "location",
  "startDate",
  "endDate",
  "current",
  "description",
  "tools",
];

// Keep only known fields and normalise them
function clean(body) {
  const data = {};
  for (const key of FIELDS) if (key in body) data[key] = body[key];

  if (typeof data.tools === "string") {
    data.tools = data.tools.split(",").map((t) => t.trim()).filter(Boolean);
  }
  data.current = Boolean(data.current);
  if (data.current || !data.endDate) data.endDate = null;

  if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
    throw new Error("End date can't be before start date");
  }
  return data;
}

export async function GET() {
  await connectDB();
  const list = await Experience.find().sort({ current: -1, startDate: -1 }).lean();
  return NextResponse.json(list);
}

export async function POST(req) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const item = await Experience.create(clean(await req.json()));
    refresh(TAGS.content);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { id, ...body } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const item = await Experience.findByIdAndUpdate(id, clean(body), {
      new: true,
      runValidators: true,
    });
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    refresh(TAGS.content);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  await connectDB();
  await Experience.findByIdAndDelete(id);
  refresh(TAGS.content);
  return NextResponse.json({ message: "Deleted" });
}
