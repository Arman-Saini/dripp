import { NextResponse } from "next/server";
import { getShoes, normalizeShoe, saveShoes } from "../../../lib/shoes";

export async function GET() {
  return NextResponse.json(await getShoes());
}

export async function POST(request) {
  try {
    const shoes = await getShoes();
    const shoe = normalizeShoe(await request.json());

    if (shoes.some((item) => item.id === shoe.id)) {
      return NextResponse.json({ error: "A shoe with this id already exists." }, { status: 409 });
    }

    shoes.push(shoe);
    await saveShoes(shoes);
    return NextResponse.json(shoe, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
