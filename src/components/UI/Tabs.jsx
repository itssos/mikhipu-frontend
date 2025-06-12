import { useState } from 'react';

const Tabs = ({ tabs }) => {
  const [active, setActive] = useState(0);

  return (
    <div className="w-full mx-auto">
      <div className="flex bg-white rounded-xl shadow-md p-1 mb-6">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActive(idx)}
            className={`flex-1 px-4 py-2 hover:cursor-pointer rounded-lg text-lg transition-all font-semibold 
              ${active === idx
                ? 'bg-blue-500 text-white shadow'
                : 'bg-transparent text-blue-500 hover:bg-blue-100'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 min-h-[300px]">
        {tabs[active].content}
      </div>
    </div>
  );
};

export default Tabs;
