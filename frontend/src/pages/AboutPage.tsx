import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t('about')}
        </h1>
        <div className="h-1 w-20 bg-primary rounded-full"></div>
      </div>

      {/* Content Card */}
      <div className="bg-white dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 p-8 shadow-sm dark:shadow-none space-y-6">
        {/* Introduction */}
        <div>
          <p className="text-gray-700 dark:text-white/80 text-lg leading-relaxed">
            Welcome to <span className="font-bold text-primary">Miria</span>, our next-generation digital shopping platform. Far more than a conventional online marketplace, Miria is built on forward-thinking design and innovative concepts to create an exceptional environment for both sellers and buyers. We are committed to ensuring the highest level of user security while delivering a seamless, intuitive, and enjoyable shopping experience.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/10"></div>

        {/* Name Origin */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">auto_awesome</span>
            The Name "Miria"
          </h2>
          <p className="text-gray-700 dark:text-white/80 leading-relaxed">
            The name <span className="font-semibold text-primary">Miria</span> is inspired by the fusion of <span className="font-semibold">"Mirai"</span>—meaning "future"—and <span className="font-semibold">"via."</span> This reflects our vision: to offer users a glimpse into the future of digital commerce through cutting-edge features and refined user experiences. We empower sellers to showcase their quality products to a wider audience, and we enable buyers to discover and purchase outstanding goods with ease and confidence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          {/* For Sellers */}
          <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-6 border border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-3xl">storefront</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">For Sellers</h3>
            </div>
            <p className="text-gray-600 dark:text-white/70 text-sm">
              Showcase your quality products to a wider audience with our intuitive platform designed for creators and entrepreneurs.
            </p>
          </div>

          {/* For Buyers */}
          <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-6 border border-gray-200 dark:border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-primary text-3xl">shopping_bag</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">For Buyers</h3>
            </div>
            <p className="text-gray-600 dark:text-white/70 text-sm">
              Discover and purchase outstanding digital goods with ease and confidence in a secure shopping environment.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">verified</span>
            Our Commitment
          </h2>
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-1">security</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Security First</h4>
                <p className="text-gray-600 dark:text-white/70 text-sm">
                  Ensuring the highest level of user security in every transaction.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-1">design_services</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Innovative Design</h4>
                <p className="text-gray-600 dark:text-white/70 text-sm">
                  Forward-thinking design that creates an exceptional user experience.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-1">trending_up</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Future-Ready</h4>
                <p className="text-gray-600 dark:text-white/70 text-sm">
                  Cutting-edge features that offer a glimpse into the future of digital commerce.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
