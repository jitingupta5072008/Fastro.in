import React from 'react';

const OrderTracking = ({ status }) => {
    const steps = [
        { label: 'Pending', key: 'Pending', description: 'Your order is being reviewed and will be processed soon.' },
        { label: 'Order Placed', key: 'Placed', description: 'Order successfully placed. We’ve started preparing your item.' },
        { label: 'Shipped', key: 'Shipped', description: 'Your package has left our warehouse and is on its way.' },
        { label: 'Out for Delivery', key: 'Out for Delivery', description: 'Your order is out for delivery and will reach you shortly.' },
        { label: 'Delivered', key: 'Delivered', description: 'Your order has been successfully delivered. We hope you love it!' },
      ];
      
      // Status from backend
      const orderStatus = status; // Example value from backend
      
      // Find the current step index
      const currentStepIndex = steps.findIndex((step) => step.key === orderStatus);
      

  return (
    <section className="text-gray-600 body-font">
    <div className="container px-5 mx-auto">
      <h2 className="text-center text-xl font-bold mb-10 ">Track Your Order</h2>
      <div className="flex flex-col mx-auto">
      {steps.map((step, index) => (
  <div key={step.key} className="flex relative pb-12">
    <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
      {index < steps.length - 1 && (
        <>
          <div className={`h-full w-1 ${index <= currentStepIndex ? 'bg-pink-500' : 'bg-gray-200'} pointer-events-none`} />
          {index === currentStepIndex && (
            <span className="blink-dot"></span>
          )}
        </>
      )}
    </div>
    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${index <= currentStepIndex ? 'bg-pink-500' : 'bg-gray-300'} inline-flex items-center justify-center text-white relative z-10`}>
      {index <= currentStepIndex ? (
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
      <h2 className={`font-medium title-font text-sm ${index <= currentStepIndex ? 'text-pink-600' : 'text-gray-500'} mb-1 tracking-wider`}>
        STEP {index + 1}
      </h2>
      <p className="leading-relaxed font-semibold">{step.label}</p>
      <p className="text-sm text-gray-500 mt-1">
        {index <= currentStepIndex ? step.description : ''}
      </p>
    </div>
  </div>
))}

      </div>
    </div>
  </section>
  

  );
};

export default OrderTracking;
