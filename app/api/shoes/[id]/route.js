import { NextResponse } from "next/server";
import { getShoes, normalizeShoe, saveShoes } from "../../../../lib/shoes";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const shoes = await getShoes();
    const index = shoes.findIndex((shoe) => shoe.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Shoe not found." }, { status: 404 });
    }

    const shoe = normalizeShoe({ ...(await request.json()), id });
    shoes[index] = shoe;
    await saveShoes(shoes);
    return NextResponse.json(shoe);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const shoes = await getShoes();
  const nextShoes = shoes.filter((shoe) => shoe.id !== id);

  if (nextShoes.length === shoes.length) {
    return NextResponse.json({ error: "Shoe not found." }, { status: 404 });
  }

  await saveShoes(nextShoes);
  return NextResponse.json({ ok: true });
}
