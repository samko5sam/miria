import React from "react";

const FeatureItem: React.FC<{
  icon: string;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 bg-primary/20 rounded-full p-2">
      <span className="material-symbols-outlined text-primary">{icon}</span>
    </div>
    <div>
      <h4 className="text-white font-bold">{title}</h4>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <>
      <main className="flex-1">
        {/* HeadlineText */}
        <h1 className="text-white tracking-light text-[32px] font-bold leading-tight px-4 text-center pb-3 pt-6">
          The Marketplace for Digital Creators
        </h1>

        {/* BodyText */}
        <p className="text-white/70 text-base font-normal leading-normal pb-3 pt-1 px-4 text-center max-w-md mx-auto">
          Discover and sell unique digital products, from art and templates to
          courses and more.
        </p>

        {/* HeaderImage */}
        <div className="px-4 py-3">
          <div
            className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-80"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtEBHMOUAoVNDW3-8TfhrUDAKz1XldKnBJGHkTId0VNkYQgemD0wGp3Uq8nfNyNi7eSguW2r83YwnCCQpk_Ej8iC6vdL-0t2WTq9vdGA6JxlBwTacK2mNeePdBtuOQTX1gYO4O-7ZIxpW0CWRRkgo1xihj_NXDk_C3ioOrOHC_lCmw6UwYadrYb3qy6VadP0bZ7yNE_y6ziPy-Xob977mxn0-SZ0M-D2rY2n5MQuXnuZVZzkidyBp27rFClhbURaeLnoLFpSyYzmqR")',
            }}
            aria-label="Abstract gradient waves in vibrant purple, pink, and blue hues"
          ></div>
        </div>

        {/* ButtonGroup */}
        <div className="flex justify-center">
          <div className="flex flex-1 gap-3 max-w-[480px] flex-col items-stretch px-4 py-3">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <span className="truncate">Explore Products</span>
            </button>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-white/10 text-white text-base font-bold leading-normal tracking-[0.015em] w-full transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <span className="truncate">Become a Creator</span>
            </button>
          </div>
        </div>
      </main>

      <section className="px-4 py-8">
        <div className="bg-black/20 p-6 rounded-xl space-y-8 max-w-4xl mx-auto">
          {/* For Buyers */}
          <div>
            <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-4">
              For Buyers
            </h3>
            <div className="space-y-4">
              <FeatureItem
                icon="star"
                title="Discover Unique Products"
                description="Find one-of-a-kind digital goods from independent creators worldwide."
              />
              <FeatureItem
                icon="download_for_offline"
                title="Instant Access"
                description="Get your digital purchases immediately after checkout."
              />
              <FeatureItem
                icon="favorite"
                title="Support Creators"
                description="Your purchases directly support your favorite artists and makers."
              />
            </div>
          </div>

          {/* For Creators */}
          <div>
            <h3 className="text-primary text-sm font-bold uppercase tracking-widest mb-4">
              For Creators
            </h3>
            <div className="space-y-4">
              <FeatureItem
                icon="rocket_launch"
                title="Launch in Minutes"
                description="Set up your beautiful, custom storefront with ease."
              />
              <FeatureItem
                icon="public"
                title="Global Audience"
                description="Reach a passionate, built-in community of buyers."
              />
              <FeatureItem
                icon="insights"
                title="Simple Tools"
                description="Manage your products and sales with our powerful dashboard."
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
