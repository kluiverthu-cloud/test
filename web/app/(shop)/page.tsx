import { redirect } from "next/navigation";

export default function HomePage() {
    // For this UI demo, we show the products catalog as the main view
    redirect("/products");
}
