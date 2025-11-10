import AboutSection from "@/components/about-section";
import FeatureSection from "@/components/feature-section";
import { Header } from "@/components/header";
import HeroSection from "@/components/hero-coba";
import React from "react";

const page = () => {
	return (
		<div>
			<Header />
			<HeroSection />
			<AboutSection />
			<FeatureSection />
		</div>
	);
};

export default page;
