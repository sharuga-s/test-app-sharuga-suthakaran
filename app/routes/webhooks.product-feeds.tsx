import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import crypto from "crypto";

export const action = async ({ request }: ActionFunctionArgs) => {
  // Verify webhook authenticity
  const hmac = request.headers.get("X-Shopify-Hmac-Sha256");
  const body = await request.text();
  
  // You'll need to add your webhook secret to verify
  // const calculatedHmac = crypto
  //   .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET!)
  //   .update(body, "utf8")
  //   .digest("base64");

  try {
    const productFeedData = JSON.parse(body);
    
    console.log("🎉 Received product feed data:", productFeedData);
    console.log("📦 Products:", productFeedData.products?.length || 0);
    
    // Process your product data here
    // This is where you'd sync products to your sales channel
    
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return new Response("Error", { status: 500 });
  }
};