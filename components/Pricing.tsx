import React from 'react';
import type { Tier } from '../types';
import { WandIcon, BrainIcon, RobotIcon } from './Icons';
import { STRIPE_PAYMENT_LINKS } from '../constants-stripe';

interface PricingCardProps {
  tier: Tier;
  title: string;
  price: string;
  features: string[];
  selected: boolean;
  onSelect: (tier: Tier) => void;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  tier,
  title,
  price,
  features,
  selected,
  onSelect,
  Icon,
  color,
}) => {
  const borderColor = selected ? color : 'border-purple-600/50';
  const buttonColor = selected
    ? `${color.replace('border-', 'bg-')}`
    : 'bg-purple-600 hover:bg-purple-700';

  const handleSubscribe = () => {
    // Redirect to Stripe payment link with return URLs
    const paymentLink = STRIPE_PAYMENT_LINKS[tier];

    if (paymentLink && !paymentLink.includes('YOUR_')) {
      // Get current app URL
      const appUrl = window.location.origin;

      // Add return URLs with tier information
      const separator = paymentLink.includes('?') ? '&' : '?';
      const successUrl = `${appUrl}/?payment=success&tier=${tier}`;
      const cancelUrl = `${appUrl}/?payment=canceled`;

      // Construct full URL with return parameters
      // Note: Payment Links in Stripe Dashboard must have redirect URLs configured
      // See STRIPE_REDIRECT_SETUP.md for configuration instructions
      const fullUrl = `${paymentLink}${separator}client_reference_id=${tier}&success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;

      // Open Stripe checkout in same window
      window.location.href = fullUrl;
    } else {
      // Fallback: just select the tier (payment links not configured yet)
      console.warn(
        '⚠️ Payment links not configured yet. Update constants-stripe.ts'
      );
      alert('💳 Payment system is being set up! Check back soon.');
      onSelect(tier);
    }
  };

  return (
    <div
      className={`bg-black/20 p-6 rounded-xl border-2 ${borderColor} transition-all duration-300 flex flex-col`}
    >
      <div className='flex items-center gap-4'>
        <Icon className={`w-10 h-10 ${color.replace('border-', 'text-')}`} />
        <div>
          <h3 className='text-2xl font-bold text-white'>{title}</h3>
          <p className='text-3xl font-creepster tracking-wider'>
            {price}
            <span className='text-base font-inter text-purple-300'>/mo</span>
          </p>
        </div>
      </div>
      <ul className='mt-6 space-y-3 text-purple-300 flex-grow'>
        {features.map((feature, index) => (
          <li key={index} className='flex items-start'>
            <svg
              className='w-5 h-5 mr-2 text-green-400 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubscribe}
        disabled={selected}
        className={`w-full mt-8 py-2 px-4 font-bold rounded-lg transition-colors ${buttonColor} ${selected ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        {selected ? 'Current Plan' : 'Subscribe Now'}
      </button>
    </div>
  );
};

interface PricingProps {
  selectedTier: Tier;
  onSelectTier: (tier: Tier) => void;
}

const Pricing: React.FC<PricingProps> = ({ selectedTier, onSelectTier }) => {
  const tiers = [
    {
      tier: 'free' as Tier,
      title: 'Free',
      price: 'FREE',
      features: [
        '300 tokens ($1.20 value)',
        '3 image transforms',
        'Basic Halloween costumes',
        'One-time lifetime tokens',
      ],
      Icon: WandIcon,
      color: 'border-gray-500',
    },
    {
      tier: 'basic' as Tier,
      title: 'Basic',
      price: '$4.99',
      features: [
        '1,250 tokens monthly ($5 value)',
        '12 images OR 1 video',
        'All Halloween costumes',
        'Priority processing',
        'Monthly token refresh',
      ],
      Icon: WandIcon,
      color: 'border-orange-500',
    },
    {
      tier: 'pro' as Tier,
      title: 'Pro',
      price: '$14.99',
      features: [
        '3,750 tokens monthly ($15 value)',
        '37 images OR 3 videos',
        'Custom costume prompts',
        'Highest quality outputs',
        'Priority processing',
        'Monthly token refresh',
      ],
      Icon: BrainIcon,
      color: 'border-purple-500',
    },
    {
      tier: 'magic' as Tier,
      title: 'Magic',
      price: '$29.99',
      features: [
        '7,500 tokens monthly ($30 value)',
        '75 images OR 7 videos',
        'Mix images & videos freely',
        '3-second spooky animations',
        'All Pro features',
        'Monthly token refresh',
      ],
      Icon: RobotIcon,
      color: 'border-green-400',
    },
  ];

  return (
    <section className='mt-12'>
      <h2 className='text-3xl font-bold text-center mb-6 text-white'>
        Choose Your Magic Level
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {tiers.map(tierInfo => (
          <PricingCard
            key={tierInfo.tier}
            {...tierInfo}
            selected={selectedTier === tierInfo.tier}
            onSelect={onSelectTier}
          />
        ))}
      </div>
    </section>
  );
};

export default Pricing;
