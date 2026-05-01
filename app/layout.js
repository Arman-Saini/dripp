import "./globals.css";

export const metadata = {
  title: "dripp",
  description: "Animated sneaker showcase"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
