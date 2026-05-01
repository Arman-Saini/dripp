"use client";

import { useEffect, useMemo, useState } from "react";

const emptyShoe = {
  id: "",
  name: "",
  brand: "",
  description: "",
  image: "",
  brandLogo: "",
  background: "rgb(211, 190, 153)",
  titleColor: "beige",
  brandBackground: "beige",
  brandColor: "black",
  descriptionColor: "black",
  imageFit: "contain",
  imageScale: 1,
  imageOffsetY: 0,
  shoeAreaWidth: 58
};

export default function Home() {
  const [shoes, setShoes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState("home");
  const [cart, setCart] = useState([]);
  const [expandedMode, setExpandedMode] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [form, setForm] = useState(emptyShoe);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [login, setLogin] = useState({ username: "admin", password: "dripp123" });

  const activeShoe = shoes[currentIndex];
  const activeNavBackground = activeShoe?.brandBackground || "beige";

  useEffect(() => {
    loadShoes();
  }, []);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId;
    const cursor = document.querySelector(".cursor");

    function onMouseMove(event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!frameId && cursor) {
        cursor.style.left = `${currentX || mouseX}px`;
        cursor.style.top = `${currentY || mouseY}px`;
      }
    }

    function animateCursor() {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      if (cursor) {
        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;
      }
      frameId = requestAnimationFrame(animateCursor);
    }

    document.addEventListener("mousemove", onMouseMove);
    animateCursor();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (currentIndex > shoes.length - 1) {
      setCurrentIndex(Math.max(shoes.length - 1, 0));
    }
  }, [currentIndex, shoes.length]);

  useEffect(() => {
    if (!shoes.length || !window.matchMedia("(max-width: 760px)").matches) {
      return undefined;
    }

    const panels = [...document.querySelectorAll("[data-shoe-index]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleEntry) {
          setCurrentIndex(Number(visibleEntry.target.getAttribute("data-shoe-index")));
        }
      },
      { threshold: [0.55, 0.75] }
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, [shoes.length]);

  const pageStyle = useMemo(
    () => ({
      transform: `translateX(-${currentIndex * 100}vw)`,
      width: `${Math.max(shoes.length, 1) * 100}vw`
    }),
    [currentIndex, shoes.length]
  );

  async function loadShoes() {
    const response = await fetch("/api/shoes", { cache: "no-store" });
    const nextShoes = await response.json();
    setShoes(nextShoes);
  }

  async function saveShoe(event) {
    event.preventDefault();
    setMessage("");

    const endpoint = editingId ? `/api/shoes/${editingId}` : "/api/shoes";
    const method = editingId ? "PUT" : "POST";
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || "Could not save shoe.");
      return;
    }

    setMessage(editingId ? "Shoe updated." : "Shoe added.");
    setForm(emptyShoe);
    setEditingId("");
    await loadShoes();
  }

  async function deleteShoe(id) {
    await fetch(`/api/shoes/${id}`, { method: "DELETE" });
    setMessage("Shoe deleted.");
    await loadShoes();
  }

  async function checkLogin(event) {
    event.preventDefault();
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });
    const result = await response.json();
    setMessage(result.message);
  }

  function editShoe(shoe) {
    setEditingId(shoe.id);
    setForm(shoe);
    setAdminOpen(true);
    setMessage(`Editing ${shoe.name}.`);
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function goHome() {
    setView("home");
    setAdminOpen(false);
    setExpandedMode(false);
    window.history.replaceState(null, "", "/");
  }

  function addToCart(shoe) {
    setCart((items) => [...items, { ...shoe, cartId: `${shoe.id}-${Date.now()}` }]);
    setMessage(`${shoe.name} added to cart.`);
  }

  function removeFromCart(cartId) {
    setCart((items) => items.filter((item) => item.cartId !== cartId));
  }

  function toggleShoe() {
    if (window.matchMedia("(max-width: 760px)").matches) {
      return;
    }
    setExpandedMode((current) => !current);
  }

  function goToShoe(index) {
    const nextIndex = Math.min(Math.max(index, 0), shoes.length - 1);
    setCurrentIndex(nextIndex);

    if (window.matchMedia("(max-width: 760px)").matches) {
      document.getElementById(`shoe-${nextIndex}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }

  return (
    <main className="container">
      <nav className="navBar" style={{ background: activeNavBackground }}>
        <button className="drippName" onClick={goHome}>
          <span>dripp</span>
        </button>
        <div className="rightSide">
          <button type="button" onClick={() => setView("cart")}>
            CART
          </button>
          <button type="button" onClick={() => setView("account")}>
            ACCOUNT
          </button>
          <button type="button" onClick={() => setView("about")}>
            ABOUT
          </button>
        </div>
      </nav>

      <section
        className={`showcase ${view !== "home" ? "showcaseHidden" : ""} ${
          expandedMode ? "showcaseExpanded" : ""
        }`}
        aria-label="Sneaker showcase"
      >
        <div className="shoePages" style={pageStyle}>
          {shoes.map((shoe, index) => (
            <article
              className={`shoePanel ${expandedMode ? "shoePanelExpanded" : ""}`}
              id={`shoe-${index}`}
              data-shoe-index={index}
              style={{
                background: shoe.background,
                "--shoe-scale": shoe.imageScale,
                "--shoe-offset-y": `${shoe.imageOffsetY}px`,
                "--shoe-title-fluid": `${7.2 / Math.max(Number(shoe.imageScale) || 1, 0.75)}vw`,
                "--shoe-desc-fluid": `${2.6 / Math.max(Number(shoe.imageScale) || 1, 0.75)}vw`,
                "--shoe-area": `${Number(shoe.shoeAreaWidth) || 58}%`,
                "--text-area": `${100 - (Number(shoe.shoeAreaWidth) || 58)}%`,
                "--shoe-hover-color": shoe.titleColor,
                "--mobile-top-bar": index > 0 ? "42px" : "0px",
                "--mobile-bottom-bar": index < shoes.length - 1 ? "42px" : "0px"
              }}
              key={shoe.id}
            >
              {index > 0 && (
                <button
                  className="mobileIdentityBar mobileIdentityBarTop"
                  type="button"
                  onClick={() => goToShoe(index - 1)}
                  style={{
                    background: shoes[index - 1].brandBackground,
                    color: shoes[index - 1].brandColor
                  }}
                >
                  <span>{shoes[index - 1].name}</span>
                  <span>{shoes[index - 1].brand}</span>
                </button>
              )}
              {index < shoes.length - 1 && (
                <button
                  className="mobileIdentityBar mobileIdentityBarBottom"
                  type="button"
                  onClick={() => goToShoe(index + 1)}
                  style={{
                    background: shoes[index + 1].brandBackground,
                    color: shoes[index + 1].brandColor
                  }}
                >
                  <span>{shoes[index + 1].name}</span>
                  <span>{shoes[index + 1].brand}</span>
                </button>
              )}
              <div className="shoePic">
                <button
                  className="shoeImageButton"
                  type="button"
                  onClick={toggleShoe}
                  aria-label={`Toggle ${shoe.name} feature view`}
                >
                  <img
                    className="shoeImage"
                    src={shoe.image}
                    alt={`${shoe.brand} ${shoe.name}`}
                    style={{ objectFit: shoe.imageFit }}
                  />
                </button>
              </div>
              <div className="shoeInfo">
                <div className="shoeInfoInner">
                  <h1 className="shoeName" style={{ color: shoe.titleColor }}>
                    {shoe.name}
                  </h1>
                  <div
                    className="brand"
                    style={{ background: shoe.brandBackground, color: shoe.brandColor }}
                  >
                    {shoe.brandLogo ? <img src={shoe.brandLogo} alt={shoe.brand} /> : shoe.brand}
                  </div>
                  <p className="desc" style={{ color: shoe.descriptionColor }}>
                    {shoe.description}
                  </p>
                  <button className="cartPunch" type="button" onClick={() => addToCart(shoe)}>
                    ADD TO CART
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="change" aria-label="Change shoe">
          <button
            className="arrowButton left"
            type="button"
            onClick={() => goToShoe(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Previous shoe"
          >
            <img src="/FigmaAssets/shoesPics/left arrow google.png" alt="" />
          </button>
          <button
            className="arrowButton right"
            type="button"
            onClick={() => goToShoe(currentIndex + 1)}
            disabled={currentIndex >= shoes.length - 1}
            aria-label="Next shoe"
          >
            <img src="/FigmaAssets/shoesPics/right arrow google.png" alt="" />
          </button>
        </div>

        {activeShoe && (
          <div className="counter">
            {String(currentIndex + 1).padStart(2, "0")} / {String(shoes.length).padStart(2, "0")}
          </div>
        )}
      </section>

      {view !== "home" && (
        <section className="viewPanel" style={{ background: activeShoe?.background || "rgb(211, 190, 153)" }}>
          {view === "cart" && (
            <>
              <div className="viewHero">
                <h1>CART</h1>
                <p>Your picks, parked here before checkout becomes real.</p>
              </div>
              <div className="cartList">
                {cart.length === 0 ? (
                  <div className="posterNote">No shoes yet. Go bully the ADD TO CART button a little.</div>
                ) : (
                  cart.map((item) => (
                    <div className="cartItem" key={item.cartId}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <h2>{item.name}</h2>
                        <p>{item.brand}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.cartId)}>
                        REMOVE
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {view === "account" && (
            <>
              <div className="viewHero">
                <h1>ACCOUNT</h1>
                <p>Dev-mode account zone. Admin is open right now so you can tune the store fast.</p>
              </div>
              <div className="accountGrid">
                <button type="button" onClick={() => setAdminOpen(true)}>
                  OPEN ADMIN
                </button>
                <div className="posterNote">
                  Hardcoded backend login: `admin` / `dripp123`. Change it in the backend or env vars before launch.
                </div>
              </div>
            </>
          )}

          {view === "about" && (
            <>
              <div className="viewHero">
                <h1>ABOUT</h1>
                <p>
                  dripp is a loud little sneaker wall: oversized type, rough-edged polish, and shoes treated
                  like album covers.
                </p>
              </div>
              <div className="aboutCopy">
                <p>
                  The idea is simple: every shoe gets its own mood. Color, logo strip, image scale, and copy
                  can all shift from the admin panel, so the page can stay expressive without rewriting code.
                </p>
                <button type="button" onClick={goHome}>
                  BACK TO SHOES
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {adminOpen && (
        <aside className="adminPanel" aria-label="Admin panel">
          <div className="adminHeader">
            <h2>ADMIN</h2>
            <button type="button" onClick={() => setAdminOpen(false)} aria-label="Close admin">
              X
            </button>
          </div>

          <form className="loginStrip" onSubmit={checkLogin}>
            <input
              value={login.username}
              onChange={(event) => setLogin({ ...login, username: event.target.value })}
              placeholder="username"
            />
            <input
              value={login.password}
              onChange={(event) => setLogin({ ...login, password: event.target.value })}
              placeholder="password"
              type="password"
            />
            <button type="submit">CHECK</button>
          </form>

          <form className="shoeForm" onSubmit={saveShoe}>
            <input
              value={form.id}
              onChange={(event) => updateForm("id", event.target.value)}
              placeholder="id, like air-force-1"
              disabled={Boolean(editingId)}
            />
            <input
              value={form.name}
              onChange={(event) => updateForm("name", event.target.value)}
              placeholder="shoe name"
            />
            <input
              value={form.brand}
              onChange={(event) => updateForm("brand", event.target.value)}
              placeholder="brand"
            />
            <textarea
              value={form.description}
              onChange={(event) => updateForm("description", event.target.value)}
              placeholder="description"
            />
            <input
              value={form.image}
              onChange={(event) => updateForm("image", event.target.value)}
              placeholder="image URL, for example /FigmaAssets/shoesPics/samba.png"
            />
            <input
              value={form.brandLogo}
              onChange={(event) => updateForm("brandLogo", event.target.value)}
              placeholder="brand logo URL, optional"
            />
            <div className="adminHint">
              Use local paths like /FigmaAssets/shoesPics/samba.png or hosted image URLs from Cloudinary/Supabase.
            </div>
            <div className="styleGrid">
              <input
                value={form.background}
                onChange={(event) => updateForm("background", event.target.value)}
                placeholder="background"
              />
              <input
                value={form.titleColor}
                onChange={(event) => updateForm("titleColor", event.target.value)}
                placeholder="title color"
              />
              <input
                value={form.brandBackground}
                onChange={(event) => updateForm("brandBackground", event.target.value)}
                placeholder="brand strip"
              />
              <input
                value={form.descriptionColor}
                onChange={(event) => updateForm("descriptionColor", event.target.value)}
                placeholder="desc color"
              />
              <input
                value={form.imageScale}
                onChange={(event) => updateForm("imageScale", event.target.value)}
                type="number"
                step="0.05"
                min="0.3"
                max="2"
                placeholder="image zoom"
              />
              <input
                value={form.imageOffsetY}
                onChange={(event) => updateForm("imageOffsetY", event.target.value)}
                type="number"
                placeholder="image y"
              />
            </div>
            <label className="rangeControl">
              SHOE ZOOM
              <input
                value={form.imageScale}
                onChange={(event) => updateForm("imageScale", event.target.value)}
                type="range"
                min="0.3"
                max="2"
                step="0.05"
              />
              <span>{form.imageScale}</span>
            </label>
            <label className="rangeControl">
              SHOE AREA
              <input
                value={form.shoeAreaWidth}
                onChange={(event) => updateForm("shoeAreaWidth", event.target.value)}
                type="range"
                min="45"
                max="72"
                step="1"
              />
              <span>{form.shoeAreaWidth || 58}%</span>
            </label>
            <select value={form.imageFit} onChange={(event) => updateForm("imageFit", event.target.value)}>
              <option value="contain">contain</option>
              <option value="cover">cover</option>
            </select>
            <div className="formActions">
              <button type="submit">{editingId ? "UPDATE SHOE" : "ADD SHOE"}</button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId("");
                    setForm(emptyShoe);
                  }}
                >
                  CLEAR
                </button>
              )}
            </div>
          </form>

          {message && <p className="adminMessage">{message}</p>}

          <div className="shoeList">
            {shoes.map((shoe) => (
              <div className="shoeRow" key={shoe.id}>
                <span>{shoe.name}</span>
                <div>
                  <button type="button" onClick={() => editShoe(shoe)}>
                    EDIT
                  </button>
                  <button type="button" onClick={() => deleteShoe(shoe.id)}>
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      <div className="cursor" />
    </main>
  );
}
