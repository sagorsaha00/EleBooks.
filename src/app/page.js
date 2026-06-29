import EleBooksHero from "./component/heroSection";
import AuthorProfileSection from "./component/writerSection";
import FeaturedAndCategories from "./component/feathure";
import OurBestsellers from './component/bestSellerSection'
import AnimatedReviewSection from "./component/reviwSection";
import AttractivePremiumFooter from "./component/footerSection";
import TopLibrarians from './component/topLibarian'
export default function Page() {
  return (
    <>
      <EleBooksHero />
      <AuthorProfileSection />
      <FeaturedAndCategories></FeaturedAndCategories>
      <OurBestsellers />
      <TopLibrarians></TopLibrarians>
      <AnimatedReviewSection />
      <AttractivePremiumFooter />

    </>
  );
}
