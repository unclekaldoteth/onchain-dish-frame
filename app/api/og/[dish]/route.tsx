import { ImageResponse } from "next/og";
import { DISHES } from "@/lib/dishes";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET(
  req: Request,
  context: { params: Promise<{ dish: string }> }
) {
  // Next 16: params adalah Promise -> wajib di-await
  const { dish } = await context.params;

  const dishData =
    DISHES.find((d) => d.id === dish) ?? DISHES[0];

  const origin = new URL(req.url).origin;
  const rawImage = (dishData as any).image as string | undefined;

  const imageUrl =
    rawImage && rawImage.startsWith("http")
      ? rawImage
      : rawImage
      ? `${origin}${rawImage}`
      : `${origin}/favicon.ico`; // fallback simple

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#020617",
          color: "#f9fafb",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
        }}
      >
        {/* LEFT COLUMN */}
        <div
          style={{
            flex: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              borderRadius: 32,
              overflow: "hidden",
              boxShadow:
                "0 24px 60px rgba(15,23,42,0.9), 0 0 0 1px rgba(148,163,184,0.4)",
            }}
          >
            <img
              src={imageUrl}
              alt={dishData.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div
          style={{
            flex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: 40,
            paddingBottom: 40,
            paddingRight: 40,
            paddingLeft: 0,
          }}
        >
          {/* TOP TEXT BLOCK */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: "#9CA3AF",
              }}
            >
              Onchain Dish · Recipe NFT
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 42,
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              {dishData.title}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#E5E7EB",
                maxWidth: 420,
              }}
            >
              {dishData.tagline}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 16,
                color: "#9CA3AF",
              }}
            >
              Region · {dishData.region}
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: 999,
                border: "1px solid #4F46E5",
                padding: "8px 18px",
                fontSize: 16,
                color: "#E5E7EB",
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(56,189,248,0.05))",
              }}
            >
              Minted on Base · Testnet
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: 18,
                color: "#9CA3AF",
              }}
            >
              onchaindish.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
