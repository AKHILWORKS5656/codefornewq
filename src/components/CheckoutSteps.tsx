
import React from 'react';

interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const steps = ['Overview', 'Shipping', 'Payment', 'Summary'];

  return (
    <div className="max-w-xl mx-auto mb-12">
      <div className="flex items-center">
        {steps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center flex-1 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-500 z-10 ${
                idx <= currentStep 
                  ? 'bg-black border-black text-white shadow-lg' 
                  : 'bg-white border-gray-200 text-gray-400'
              }`}>
                {idx + 1}
              </div>
              <span className={`absolute -bottom-7 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                idx <= currentStep ? 'text-black' : 'text-gray-400'
              }`}>
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-gray-100 relative top-0">
                <div className={`h-full bg-black transition-all duration-500`} style={{ width: idx < currentStep ? '100%' : '0%' }}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
