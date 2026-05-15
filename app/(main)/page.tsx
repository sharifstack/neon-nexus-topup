import connectToDatabase from "@/lib/mongodb";
import Game from "@/models/Game";
import HomePageClient from "./HomePageClient";

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectToDatabase();

  const featuredGamesRaw = await Game.find({ isFeatured: true, isActive: true }).lean().limit(6);
  const flashDealsRaw = await Game.find({ isFlashDeal: true, isActive: true }).lean().limit(3);

  const featuredGames = JSON.parse(JSON.stringify(featuredGamesRaw));
  const flashDeals = JSON.parse(JSON.stringify(flashDealsRaw));

  return <HomePageClient featuredGames={featuredGames} flashDeals={flashDeals} />;
}
