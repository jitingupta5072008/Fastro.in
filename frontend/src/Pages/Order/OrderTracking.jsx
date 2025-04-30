import React from 'react';

const OrderTracking = ({ status }) => {
  const allSteps = [
    { label: 'Pending', key: 'Pending', description: 'Your order is being reviewed and will be processed soon.' },
    { label: 'Order Placed', key: 'Placed', description: 'Order successfully placed. We’ve started preparing your item.' },
    { label: 'Shipped', key: 'Shipped', description: 'Your package has left our warehouse and is on its way.' },
    { label: 'Out for Delivery', key: 'Out for Delivery', description: 'Your order is out for delivery and will reach you shortly.' },
    { label: 'Delivered', key: 'Delivered', description: 'Your order has been successfully delivered. We hope you love it!' },
    { label: 'Cancelled', key: 'Cancelled', description: 'Your order has been cancelled. If you have already paid, a refund will be processed shortly.' }
  ];

  let stepsToShow = [];

  // Logic to decide which steps to show
  if (status === 'Cancelled') {
    // If cancelled but placed before, show 3 steps
    stepsToShow = [
      allSteps.find(step => step.key === 'Pending'),
      allSteps.find(step => step.key === 'Placed'),
      allSteps.find(step => step.key === 'Cancelled')
    ].filter(Boolean); // filter removes undefined if Placed is not applicable
  } else {
    // Normal flow, show all except Cancelled
    stepsToShow = allSteps.filter(step => step.key !== 'Cancelled');
  }

  const currentStepIndex = stepsToShow.findIndex((step) => step.key === status);

  // Determine color
  const getColor = (key) => {
    if (status === 'Cancelled') return 'red';
    if (key === 'Delivered') return 'green';
    return 'pink';
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 mx-auto">
        <h2 className="text-center text-xl font-bold mb-10">Track Your Order</h2>
        <div className="flex flex-col mx-auto">
          {stepsToShow.map((step, index) => {
            const stepColor = getColor(step.key);
            const isActive = index <= currentStepIndex;

            return (
              <div key={step.key} className="flex relative pb-12">
                <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
                  {index < stepsToShow.length - 1 && (
                    <div className={`h-full w-1 ${isActive ? `${stepColor === 'pink' ? 'bg-pink-500' : stepColor === 'green' ? 'bg-green-500' : 'bg-red-500'}` : 'bg-gray-200'} pointer-events-none`} />
                  )}
                </div>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${isActive ? `${stepColor === 'pink' ? 'bg-pink-500' : stepColor === 'green' ? 'bg-green-500' : 'bg-red-500'}` : 'bg-gray-300'} inline-flex items-center justify-center text-white relative z-10`}>
                  {isActive ? (
                    <svg fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  )}
                </div>
                <div className="flex-grow pl-4">
                  <h2 className={`font-medium title-font text-sm ${isActive ? `${stepColor === 'pink' ? 'text-pink-600' : stepColor === 'green' ? 'text-green-600' : 'text-red-600'}` : 'text-gray-500'} mb-1 tracking-wider`}>
                    STEP {index + 1}
                  </h2>
                  <p className="leading-relaxed font-semibold">{step.label}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {isActive ? step.description : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OrderTracking;
