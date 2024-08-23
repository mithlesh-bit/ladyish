"use client";
import SimpleImageCarousel from "@/components/home/SimpleImageCarousel";
import Banner2 from "@/components/home/Banner2";
import Banner3 from "@/components/home/Banner3";
import Banner from "@/components/home/Banner";
import ExpertChoice from "@/components/home/ExpertChoice";
import NewArrivals from "@/components/home/NewArrivals";
import NicheExplorer from "@/components/home/NicheExplorer";
import Steps from "@/components/home/Steps";
import Trending from "@/components/home/Trending";
import Main from "@/components/shared/layouts/Main";

export default function Home() {
  return (
    <>
      <Main>
        <main className="flex flex-col gap-y-20 w-full">
          <SimpleImageCarousel />
          <Steps />
          <NewArrivals />
          <Banner />
          <ExpertChoice />
          <NicheExplorer />
          <Banner3 />
          <Trending />
          <Banner2 />
          {/* Optional Banner3 */}
        </main>
      </Main>
    </>
  );
}
